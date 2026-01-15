'use client';

import * as React from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCalendarEvents, type CalendarEvent } from "../_actions/get-calendar-events";
import { toast } from "sonner";

export function TeacherCalendarClient() {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
    const [events, setEvents] = React.useState<CalendarEvent[]>([]);
    const [loading, setLoading] = React.useState(true);

    const fetchEvents = React.useCallback(async (date: Date) => {
        try {
            setLoading(true);
            const data = await getCalendarEvents(date);
            setEvents(data);
        } catch (error) {
            toast.error("Failed to load calendar events");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchEvents(currentDate);
    }, [fetchEvents, currentDate]);

    const days = React.useMemo(() => {
        const start = startOfWeek(startOfMonth(currentDate));
        const end = endOfWeek(endOfMonth(currentDate));
        return eachDayOfInterval({ start, end });
    }, [currentDate]);

    const selectedDateEvents = events.filter(event => isSameDay(event.start, selectedDate));

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const today = () => {
        const now = new Date();
        setCurrentDate(now);
        setSelectedDate(now);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
            {/* Calendar Grid Section */}
            <div className="flex-1 flex flex-col bg-white dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-primary" />
                        {format(currentDate, "MMMM yyyy")}
                    </h2>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" onClick={prevMonth}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={today}>
                            Today
                        </Button>
                        <Button variant="outline" size="icon" onClick={nextMonth}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 border-b bg-muted/30">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="p-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 grid grid-cols-7 grid-rows-6">
                    {days.map((day, idx) => {
                        const dayEvents = events.filter(e => isSameDay(e.start, day));
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <div
                                key={day.toString()}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    "relative p-2 border-b border-r min-h-[80px] cursor-pointer transition-colors hover:bg-muted/50 flex flex-col gap-1",
                                    !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                                    isSelected && "bg-primary/5 ring-1 ring-inset ring-primary",
                                    idx % 7 === 6 && "border-r-0" // Remove right border for last column
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <span
                                        className={cn(
                                            "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full",
                                            isToday && "bg-primary text-primary-foreground",
                                            !isToday && "text-muted-foreground"
                                        )}
                                    >
                                        {format(day, "d")}
                                    </span>
                                    {dayEvents.length > 0 && (
                                        <Badge variant="secondary" className="text-[10px] px-1 h-5 rounded-md">
                                            {dayEvents.length}
                                        </Badge>
                                    )}
                                </div>

                                {/* Tiny Event Dots/lines for visual density */}
                                <div className="flex flex-col gap-0.5 mt-1">
                                    {dayEvents.slice(0, 3).map(event => (
                                        <div key={event.id} className={cn("text-[10px] truncate px-1 rounded-sm border-l-2",
                                            event.type === 'session' ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" :
                                                "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                                        )}>
                                            {format(event.start, 'HH:mm')} {event.title}
                                        </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <div className="text-[9px] text-muted-foreground pl-1">+ {dayEvents.length - 3} more</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Side Panel: Selected Date Agenda */}
            <div className="w-full lg:w-80 flex flex-col bg-white dark:bg-card rounded-xl border border-border shadow-sm h-full">
                <div className="p-4 border-b bg-muted/30">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {format(selectedDate, "EEEE, MMMM d")}
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {selectedDateEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-center">
                            <CalendarIcon className="w-8 h-8 mb-2 opacity-20" />
                            <p>No events scheduled for this day.</p>
                        </div>
                    ) : (
                        selectedDateEvents.sort((a, b) => a.start.getTime() - b.start.getTime()).map(event => (
                            <Card key={event.id} className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-3">
                                    <div className="flex justify-between items-start mb-1">
                                        <Badge variant={event.type === 'session' ? 'default' : 'secondary'} className="text-[10px] uppercase">
                                            {event.type === 'session' ? '1-on-1' : 'Group Class'}
                                        </Badge>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-sm mb-1">{event.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        {event.type === 'session' ? (
                                            <>
                                                <Users className="w-3 h-3" />
                                                <span>Student: {event.studentName}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Users className="w-3 h-3" />
                                                <span>{event.studentCount} Students</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <Badge variant="outline" className={cn("text-[10px]",
                                            event.status === 'scheduled' || event.status === 'Scheduled' ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50"
                                        )}>
                                            {event.status}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
