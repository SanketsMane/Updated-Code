(()=>{var e={};e.id=540,e.ids=[540,7169],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4573:e=>{"use strict";e.exports=require("node:buffer")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},14985:e=>{"use strict";e.exports=require("dns")},15786:(e,r,t)=>{"use strict";t.d(r,{Z:()=>s});var i=t(57226);async function s(e){try{if(!process.env.EMAIL_HOST&&!process.env.EMAIL_USER)return console.log("---------------------------------------------------"),console.log("EMAIL SENT (MOCKED):"),console.log("To:",e.to),console.log("Subject:",e.subject),console.log("---------------------------------------------------"),!0;let r="gmail"===process.env.EMAIL_SERVICE?i.createTransport({service:"gmail",auth:{user:process.env.EMAIL_USER||"",pass:process.env.EMAIL_PASS||""}}):i.createTransport({host:process.env.EMAIL_HOST,port:parseInt(process.env.EMAIL_PORT||"587"),secure:"true"===process.env.EMAIL_SECURE,auth:{user:process.env.EMAIL_USER||"",pass:process.env.EMAIL_PASS||""}}),t={from:e.from||process.env.EMAIL_FROM||process.env.EMAIL_USER,to:e.to,subject:e.subject,html:e.html},s=await r.sendMail(t);return console.log("Email sent successfully:",s.messageId),!0}catch(e){return console.error("Error sending email:",e),!1}}},21820:e=>{"use strict";e.exports=require("os")},27910:e=>{"use strict";e.exports=require("stream")},28354:e=>{"use strict";e.exports=require("util")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},34631:e=>{"use strict";e.exports=require("tls")},35979:()=>{},37067:e=>{"use strict";e.exports=require("node:http")},37086:(e,r,t)=>{"use strict";t.d(r,{z:()=>s});var i=t(96330);let s=global.prisma||new i.PrismaClient},44708:e=>{"use strict";e.exports=require("node:https")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},46339:(e,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"ReflectAdapter",{enumerable:!0,get:function(){return t}});class t{static get(e,r,t){let i=Reflect.get(e,r,t);return"function"==typeof i?i.bind(e):i}static set(e,r,t,i){return Reflect.set(e,r,t,i)}static has(e,r){return Reflect.has(e,r)}static deleteProperty(e,r){return Reflect.deleteProperty(e,r)}}},49522:(e,r,t)=>{"use strict";t.d(r,{j:()=>p});var i=t(85817),s=t(95027),n=t(37086),a=t(94149),o=t(37628),l=t(15786);let p=(0,i.li)({database:(0,s._)(n.z,{provider:"postgresql"}),trustedOrigins:["http://localhost:3000","http://localhost:3001","http://localhost:3002","http://localhost:3003"],socialProviders:{github:{clientId:a._.AUTH_GITHUB_CLIENT_ID,clientSecret:a._.AUTH_GITHUB_SECRET}},emailAndPassword:{enabled:!0},user:{additionalFields:{role:{type:"string"}}},plugins:[(0,o.yI)({async sendVerificationOTP({email:e,otp:r}){await (0,l.Z)({to:e,subject:"KIDOKOOL - Verify your email",html:`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px; margin-bottom: 30px;">
                <h1>🔐 Email Verification</h1>
              </div>
              <p>Hi there,</p>
              <p>Please use the following OTP to verify your email address:</p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border-left: 4px solid #667eea;">
                <h2 style="color: #667eea; font-size: 36px; margin: 0; letter-spacing: 4px;">${r}</h2>
              </div>
              <p>This OTP will expire in 10 minutes for security reasons.</p>
              <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
                <p>If you didn't request this verification, please ignore this email.</p>
              </div>
            </div>
          `})}}),(0,o.wr)()]})},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},57975:e=>{"use strict";e.exports=require("node:util")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:e=>{"use strict";e.exports=require("zlib")},77598:e=>{"use strict";e.exports=require("node:crypto")},78474:e=>{"use strict";e.exports=require("node:events")},79551:e=>{"use strict";e.exports=require("url")},79646:e=>{"use strict";e.exports=require("child_process")},81630:e=>{"use strict";e.exports=require("http")},82879:(e,r,t)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),!function(e,r){for(var t in r)Object.defineProperty(e,t,{enumerable:!0,get:r[t]})}(r,{isRequestAPICallableInsideAfter:function(){return l},throwForSearchParamsAccessInUseCache:function(){return o},throwWithStaticGenerationBailoutError:function(){return n},throwWithStaticGenerationBailoutErrorWithDynamicError:function(){return a}});let i=t(97447),s=t(3295);function n(e,r){throw Object.defineProperty(new i.StaticGenBailoutError(`Route ${e} couldn't be rendered statically because it used ${r}. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`),"__NEXT_ERROR_CODE",{value:"E576",enumerable:!1,configurable:!0})}function a(e,r){throw Object.defineProperty(new i.StaticGenBailoutError(`Route ${e} with \`dynamic = "error"\` couldn't be rendered statically because it used ${r}. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`),"__NEXT_ERROR_CODE",{value:"E543",enumerable:!1,configurable:!0})}function o(e){let r=Object.defineProperty(Error(`Route ${e.route} used "searchParams" inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use "searchParams" outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`),"__NEXT_ERROR_CODE",{value:"E634",enumerable:!1,configurable:!0});throw e.invalidUsageError??=r,r}function l(){let e=s.afterTaskAsyncStorage.getStore();return(null==e?void 0:e.rootTaskSpawnPhase)==="action"}},85230:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>x,routeModule:()=>m,serverHooks:()=>y,workAsyncStorage:()=>h,workUnitAsyncStorage:()=>f});var i={};t.r(i),t.d(i,{POST:()=>g});var s=t(36639),n=t(99880),a=t(77991),o=t(11246),l=t(37086),p=t(49522),c=t(79082),u=t(15786);let d=c.z.object({name:c.z.string().min(2,"Name must be at least 2 characters"),email:c.z.string().email("Invalid email address"),password:c.z.string().min(8,"Password must be at least 8 characters"),bio:c.z.string().min(50,"Bio must be at least 50 characters"),expertiseAreas:c.z.array(c.z.string()).min(1,"At least one expertise area is required"),languages:c.z.array(c.z.string()).optional().default([]),hourlyRate:c.z.string().transform(e=>parseInt(e)).refine(e=>e>=100&&e<=5e4,"Hourly rate must be between ₹100-50000"),experience:c.z.string().transform(e=>parseInt(e)).refine(e=>e>=0,"Experience must be 0 or more years")});async function g(e){try{let r=await e.json(),t=d.parse(r),i=await l.z.user.findUnique({where:{email:t.email}}),s="";if(i)s=i.id;else{let e=await p.j.api.signUpEmail({body:{email:t.email,password:t.password,name:t.name},asResponse:!1});if(!e)return o.NextResponse.json({error:"Failed to create user account"},{status:500});s=e.user.id}for(let e of(await l.z.teacherProfile.findUnique({where:{userId:s}})||await l.z.teacherProfile.create({data:{userId:s,bio:t.bio,expertise:t.expertiseAreas,languages:t.languages,hourlyRate:100*t.hourlyRate,isVerified:!1,isApproved:!1,timezone:"UTC"}}),await l.z.user.update({where:{id:s},data:{role:"teacher"}}),await (0,u.Z)({to:t.email,subject:"Welcome to KIDOKOOL - Teacher Application Received",html:`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px; margin-bottom: 30px;">
            <h1>🎓 Welcome to KIDOKOOL!</h1>
            <p style="margin: 0; font-size: 18px;">Your teacher application has been received</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hi ${t.name},</p>
            
            <p>Thank you for applying to become a teacher on KIDOKOOL! We're excited about your interest in sharing knowledge with our students worldwide.</p>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0;">Application Details:</h3>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${t.name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${t.email}</p>
              <p style="margin: 5px 0;"><strong>Expertise:</strong> ${t.expertiseAreas.join(", ")}</p>
              <p style="margin: 5px 0;"><strong>Hourly Rate:</strong> $${t.hourlyRate}/hour</p>
              <p style="margin: 5px 0;"><strong>Experience:</strong> ${t.experience} years</p>
            </div>
            
            <h3 style="color: #374151;">What's Next?</h3>
            <ol style="color: #6b7280; line-height: 1.6;">
              <li><strong>Review Process:</strong> Our team will review your application within 24-48 hours</li>
              <li><strong>Profile Verification:</strong> We may request additional documents or information</li>
              <li><strong>Account Activation:</strong> Once approved, you'll receive login credentials</li>
              <li><strong>Platform Training:</strong> Access to teacher resources and platform tutorials</li>
              <li><strong>Start Teaching:</strong> Begin creating courses and accepting students</li>
            </ol>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h4 style="color: #1e40af; margin-top: 0;">💡 While You Wait:</h4>
              <ul style="color: #374151; margin-bottom: 0;">
                <li>Prepare your course materials and lesson plans</li>
                <li>Think about your teaching methodology and approach</li>
                <li>Consider your availability and schedule preferences</li>
                <li>Review our <a href="#" style="color: #3b82f6;">Teacher Guidelines</a></li>
              </ul>
            </div>
            
            <p>If you have any questions or concerns, please don't hesitate to reach out to our support team.</p>
            
            <p>Best regards,<br>The KIDOKOOL Team</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
            <p>This email was sent to ${t.email}</p>
            <p>If you didn't apply to become a teacher, please ignore this email.</p>
          </div>
        </div>
      `}),await l.z.user.findMany({where:{role:"admin"}})))await (0,u.Z)({to:e.email,subject:"New Teacher Application - KIDOKOOL",html:`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>🆕 New Teacher Application</h2>
            <p>A new teacher has applied to join KIDOKOOL:</p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${t.name}</p>
              <p><strong>Email:</strong> ${t.email}</p>
              <p><strong>Expertise:</strong> ${t.expertiseAreas.join(", ")}</p>
              <p><strong>Hourly Rate:</strong> $${t.hourlyRate}/hour</p>
              <p><strong>Experience:</strong> ${t.experience} years</p>
              <p><strong>Bio:</strong> ${t.bio.substring(0,200)}...</p>
            </div>
            
            <p>Please review the application in the admin panel and approve or reject as appropriate.</p>
            
            <a href="${process.env.BETTER_AUTH_URL||"http://localhost:3001"}/admin/team" 
               style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Review Application
            </a>
          </div>
        `});return o.NextResponse.json({success:!0,message:"Teacher application submitted successfully",userId:s},{status:201})}catch(e){if(console.error("Teacher registration error:",e),e instanceof c.z.ZodError)return o.NextResponse.json({error:"Invalid form data",details:e.errors},{status:400});return o.NextResponse.json({error:"Registration failed. Please try again."},{status:500})}}let m=new s.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/teacher/register/route",pathname:"/api/teacher/register",filename:"route",bundlePath:"app/api/teacher/register/route"},resolvedPagePath:"/Users/sanket/Documents/LMS-Organomed copy/app/api/teacher/register/route.ts",nextConfigOutput:"standalone",userland:i}),{workAsyncStorage:h,workUnitAsyncStorage:f,serverHooks:y}=m;function x(){return(0,a.patchFetch)({workAsyncStorage:h,workUnitAsyncStorage:f})}},91645:e=>{"use strict";e.exports=require("net")},94149:(e,r,t)=>{"use strict";t.d(r,{_:()=>n});var i=t(97191),s=t(79082);let n=(0,i.w)({server:{DATABASE_URL:s.z.string().url(),BETTER_AUTH_SECRET:s.z.string().min(1),BETTER_AUTH_URL:s.z.string().url(),AUTH_GITHUB_CLIENT_ID:s.z.string().min(1),AUTH_GITHUB_SECRET:s.z.string().min(1),EMAIL_SERVICE:s.z.string().optional(),EMAIL_HOST:s.z.string().optional(),EMAIL_PORT:s.z.string().optional(),EMAIL_SECURE:s.z.string().optional(),EMAIL_USER:s.z.string().optional(),EMAIL_PASS:s.z.string().optional(),EMAIL_FROM:s.z.string().optional(),AWS_ACCESS_KEY_ID:s.z.string().min(1),AWS_SECRET_ACCESS_KEY:s.z.string().min(1),AWS_ENDPOINT_URL_S3:s.z.string().min(1),AWS_ENDPOINT_URL_IAM:s.z.string().min(1),AWS_REGION:s.z.string().min(1),STRIPE_SECRET_KEY:s.z.string().min(1),STRIPE_WEBHOOK_SECRET:s.z.string().min(1)},skipValidation:!!process.env.SKIP_ENV_VALIDATION,client:{NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES:s.z.string().min(1)},experimental__runtimeEnv:{NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES:"placeholder-bucket"}})},94735:e=>{"use strict";e.exports=require("events")},95651:()=>{},96330:e=>{"use strict";e.exports=require("@prisma/client")},97169:(e,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),!function(e,r){for(var t in r)Object.defineProperty(e,t,{enumerable:!0,get:r[t]})}(r,{describeHasCheckingStringProperty:function(){return s},describeStringPropertyAccess:function(){return i},wellKnownProperties:function(){return n}});let t=/^[A-Za-z_$][A-Za-z0-9_$]*$/;function i(e,r){return t.test(r)?"`"+e+"."+r+"`":"`"+e+"["+JSON.stringify(r)+"]`"}function s(e,r){let t=JSON.stringify(r);return"`Reflect.has("+e+", "+t+")`, `"+t+" in "+e+"`, or similar"}let n=new Set(["hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toString","valueOf","toLocaleString","then","catch","finally","status","displayName","toJSON","$$typeof","__esModule"])}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),i=r.X(0,[7991,2692,1135,4714],()=>t(85230));module.exports=i})();