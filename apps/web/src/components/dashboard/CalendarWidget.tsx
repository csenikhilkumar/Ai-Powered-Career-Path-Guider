import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarDay {
    date: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    hasEvent?: boolean;
    fullDate: Date;
}

export function CalendarWidget() {
    const [selectedDate] = useState<Date | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Get calendar data
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get first day of month and number of days
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Generate calendar days
    const calendarDays: CalendarDay[] = [];

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        calendarDays.push({
            date: daysInPrevMonth - i,
            isCurrentMonth: false,
            isToday: false,
            fullDate: new Date(year, month - 1, daysInPrevMonth - i)
        });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        const isToday =
            i === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

        calendarDays.push({
            date: i,
            isCurrentMonth: true,
            isToday,
            hasEvent: isToday || i === 15 || i === 22, // Mock events
            fullDate: new Date(year, month, i)
        });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - calendarDays.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
        calendarDays.push({
            date: i,
            isCurrentMonth: false,
            isToday: false,
            fullDate: new Date(year, month + 1, i)
        });
    }

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1));
    };

    const goToPreviousYear = () => {
        setCurrentDate(new Date(year - 1, month));
    };

    const goToNextYear = () => {
        setCurrentDate(new Date(year + 1, month));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <motion.div
            className="card-glass p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Calendar</h3>
                        <p className="text-sm text-purple-300 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Live
                        </p>
                    </div>
                </div>
                <button
                    onClick={goToToday}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 hover:text-white transition-colors"
                >
                    Today
                </button>
            </div>

            {/* Month & Year Navigation */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                    <button
                        onClick={goToPreviousYear}
                        className="p-2 rounded-lg hover:bg-white/10 text-purple-300 hover:text-white transition-colors"
                        title="Previous Year"
                    >
                        <ChevronsLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={goToPreviousMonth}
                        className="p-2 rounded-lg hover:bg-white/10 text-purple-300 hover:text-white transition-colors"
                        title="Previous Month"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                </div>

                <h4 className="text-white font-semibold min-w-[140px] text-center">
                    {monthNames[month]} {year}
                </h4>

                <div className="flex items-center gap-1">
                    <button
                        onClick={goToNextMonth}
                        className="p-2 rounded-lg hover:bg-white/10 text-purple-300 hover:text-white transition-colors"
                        title="Next Month"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                    <button
                        onClick={goToNextYear}
                        className="p-2 rounded-lg hover:bg-white/10 text-purple-300 hover:text-white transition-colors"
                        title="Next Year"
                    >
                        <ChevronsRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map((day) => (
                    <div
                        key={day}
                        className="text-center text-xs font-medium text-purple-300 py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.01 }}
                        className={`
                            relative aspect-square flex items-center justify-center rounded-lg text-sm
                            ${day.isCurrentMonth ? 'text-white' : 'text-purple-300/30'}
                            ${day.isToday
                                ? 'bg-gradient-to-tr from-purple-600 to-blue-600 font-bold shadow-lg shadow-purple-500/50 scale-110'
                                : 'hover:bg-white/5'
                            }
                            ${day.hasEvent && !day.isToday ? 'ring-1 ring-purple-400/50' : ''}
                            transition-all cursor-pointer
                        `}
                    >
                        {day.date}
                        {day.hasEvent && !day.isToday && (
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-400" />
                        )}
                        {day.isToday && (
                            <motion.div
                                className="absolute inset-0 rounded-lg bg-gradient-to-tr from-purple-600/20 to-blue-600/20 pointer-events-none"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Selected Date Info */}
            {selectedDate && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-400/30"
                >
                    <p className="text-sm text-white">
                        <span className="font-semibold">Selected: </span>
                        {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </motion.div>
            )}

            {/* Upcoming Events */}
            <div className="mt-6 pt-6 border-t border-white/10">
                <h5 className="text-sm font-semibold text-white mb-3">Upcoming Events</h5>
                <div className="space-y-2">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="h-2 w-2 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">Career Review</p>
                            <p className="text-xs text-purple-300">Today at 3:00 PM</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="h-2 w-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">Skill Assessment</p>
                            <p className="text-xs text-purple-300">Tomorrow at 10:00 AM</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
