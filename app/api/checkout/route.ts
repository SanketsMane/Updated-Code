import { getSessionWithRole } from "@/app/data/auth/require-roles";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-05-28.basil", // Use latest consistent version
    typescript: true,
});

export async function POST(req: Request) {
    try {
        const stripe = getStripe();
        const session = await getSessionWithRole();
        const user = session?.user;

        if (!user || !user.id || !user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = await req.json();

        if (!courseId) {
            return new NextResponse("Missing Course ID", { status: 400 });
        }

        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            include: {
                chapter: {
                    include: {
                        lessons: {
                            orderBy: {
                                position: "asc",
                            }
                        }
                    }
                }
            }
        });

        if (!course) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // Check if already purchased
        const purchase = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId,
                },
            },
        });

        if (purchase) {
            return new NextResponse("Already purchased", { status: 400 });
        }

        // Create Stripe Session
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: course.title,
                        description: course.smallDescription || undefined,
                        images: course.fileKey ? [`https://utfs.io/f/${course.fileKey}`] : [],
                    },
                    unit_amount: Math.round(course.price! * 100), // Stripe expects cents
                },
            },
        ];

        let stripeCustomer = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                stripeCustomerId: true,
            }
        });

        if (!stripeCustomer?.stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
            });

            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    stripeCustomerId: customer.id,
                }
            });

            stripeCustomer = { stripeCustomerId: customer.id };
        }

        // Create Pending Enrollment
        const enrollment = await prisma.enrollment.create({
            data: {
                userId: user.id,
                courseId: courseId,
                amount: Math.round(course.price! * 100),
                status: "Pending", // Important: Initial status
            }
        });

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId || undefined,
            line_items,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}?canceled=1`,
            metadata: {
                courseId: course.id,
                userId: user.id,
                enrollmentId: enrollment.id, // Pass to Webhook
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.log("[COURSE_CHECKOUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
