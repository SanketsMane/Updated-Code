"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Clock, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AvailabilitySlot {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    timezone: string;
    isActive: boolean;
}

const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export function AvailabilitySettings() {
    const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingSlot, setAddingSlot] = useState<boolean>(false);

    // New slot form state
    const [selectedDay, setSelectedDay] = useState<string>("1"); // Default Monday
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [timezone, setTimezone] = useState("UTC");

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            const response = await fetch("/api/teacher/availability");
            if (!response.ok) throw new Error("Failed to fetch availability");
            const data = await response.json();
            setSlots(data.availability);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load availability");
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlot = async () => {
        setAddingSlot(true);
        try {
            const response = await fetch("/api/teacher/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dayOfWeek: parseInt(selectedDay),
                    startTime,
                    endTime,
                    timezone
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to add slot");
            }

            setSlots([...slots, data.availability]);
            toast.success("Availability slot added");

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setAddingSlot(false);
        }
    };

    const handleDeleteSlot = async (id: string) => {
        // Optimistic update
        const previousSlots = [...slots];
        setSlots(slots.filter(s => s.id !== id));

        try {
            const response = await fetch(`/api/teacher/availability/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to delete slot");
            }
            toast.success("Slot removed");
        } catch (error: any) {
            toast.error(error.message);
            setSlots(previousSlots); // Revert
        }
    };

    const getSlotsForDay = (dayIndex: number) => {
        return slots.filter((slot) => slot.dayOfWeek === dayIndex).sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Add New Slot Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Add Availability Slot</CardTitle>
                    <CardDescription>
                        Add a new time slot when you are available for live sessions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Day</label>
                            <Select value={selectedDay} onValueChange={setSelectedDay}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {DAYS.map((day, index) => (
                                        <SelectItem key={index} value={index.toString()}>
                                            {day}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Start Time</label>
                            <Input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">End Time</label>
                            <Input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>

                        <Button onClick={handleAddSlot} disabled={addingSlot} className="w-full">
                            {addingSlot ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                            Add Slot
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Weekly Schedule Display */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Weekly Schedule</h3>
                <div className="grid gap-4">
                    {DAYS.map((day, index) => {
                        const daySlots = getSlotsForDay(index);
                        return (
                            <Card key={index} className={cn("overflow-hidden", daySlots.length === 0 && "opacity-60 bg-muted/30")}>
                                <div className="flex items-center p-4">
                                    <div className="w-32 flex-shrink-0 font-medium">{day}</div>

                                    <div className="flex-1 flex flex-wrap gap-2">
                                        {daySlots.length > 0 ? (
                                            daySlots.map((slot) => (
                                                <div
                                                    key={slot.id}
                                                    className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm border border-primary/20"
                                                >
                                                    <Clock className="h-3 w-3" />
                                                    <span>{slot.startTime} - {slot.endTime}</span>
                                                    <button
                                                        onClick={() => handleDeleteSlot(slot.id)}
                                                        className="ml-2 text-primary/50 hover:text-destructive transition-colors"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground italic">Unavailable</span>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
