import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, AlertTriangle, ChevronLeft, ChevronRight, ExternalLink, Clock, Calendar as CalendarIcon } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';

// Utility functions
const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const lastDay = new Date(year, month + 1, 0);

    for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push(new Date(year, month, day));
    }
    return days;
};

const isCurrentDay = (day) => {
    const today = new Date();
    return (
        day.getDate() === today.getDate() &&
        day.getMonth() === today.getMonth() &&
        day.getFullYear() === today.getFullYear()
    );
};

const getEventsForDay = (day, events) => {
    return events.filter(event => {
        const eventDate = new Date(event.startTime);
        return (
            eventDate.getDate() === day.getDate() &&
            eventDate.getMonth() === day.getMonth() &&
            eventDate.getFullYear() === day.getFullYear()
        );
    });
};

const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const formatTimeRange = (start, end) => {
    return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const formatDuration = (start, end) => {
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

// CalendarHeader component
const CalendarHeader = ({ currentMonth, prevMonth, nextMonth }) => {
    return (
        <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-2xl font-bold text-gray-800">{formatMonthYear(currentMonth)}</h2>
            <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={prevMonth} className="border-gray-300 hover:bg-gray-100">
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                    <span className="sr-only">Previous month</span>
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth} className="border-gray-300 hover:bg-gray-100">
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                    <span className="sr-only">Next month</span>
                </Button>
            </div>
        </div>
    );
};

// EventItem component
const EventItem = ({ event }) => {
    const getPlatformColor = (platform) => {
        const colors = {
            'leetcode': '#FFA116',
            'codeforces': '#318CE7',
            'codechef': '#5B4638',
            'atcoder': '#222222',
            'hackerrank': '#00EA64',
            'geeksforgeeks': '#2F8D46',
            'gfg': '#2F8D46'
        };
        return colors[platform] || '#6366F1';
    };

    const getPlatformName = (platform) => {
        const names = {
            'leetcode': 'LeetCode',
            'codeforces': 'Codeforces',
            'codechef': 'CodeChef',
            'atcoder': 'AtCoder',
            'hackerrank': 'HackerRank',
            'geeksforgeeks': 'GeeksforGeeks',
            'gfg': 'GeeksforGeeks'
        };
        return names[platform] || 'Other';
    };

    const addToCalendar = () => {
        const start = event.startTime.toISOString().replace(/-|:|\.\d+/g, '');
        const end = event.endTime.toISOString().replace(/-|:|\.\d+/g, '');
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.url)}`;
        window.open(url, '_blank');
    };

    const isToday = () => {
        const today = new Date();
        const eventDate = new Date(event.startTime);
        return today.toDateString() === eventDate.toDateString();
    };

    const isSoon = () => {
        const now = new Date();
        const eventTime = new Date(event.startTime);
        const timeDiff = eventTime.getTime() - now.getTime();
        return timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000;
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className="event-item text-left p-2 rounded-md border-l-4 hover:bg-gray-50 cursor-pointer truncate flex items-start gap-1 mb-1 shadow-sm"
                        style={{ borderLeftColor: getPlatformColor(event.platform), borderLeftWidth: '4px' }}
                    >
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium truncate">{event.title}</h4>
                            <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-2 w-2 mr-1" />
                                <span className="truncate">{formatTimeRange(new Date(event.startTime), new Date(event.endTime))}</span>
                            </div>
                        </div>
                        {(isToday() || isSoon()) && (
                            <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0 mt-1" />
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent className="w-64 p-4 bg-blue-50 border border-blue-600 shadow-md rounded-lg">
                    <h3 className="font-semibold text-base text-blue-700 mb-1">{event.title}</h3>
                    <div className="text-xs text-gray-600 mb-2">
                        <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: getPlatformColor(event.platform) }}></span>
                        {getPlatformName(event.platform)}
                    </div>
                    <div className="text-sm mb-2 text-gray-700">
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-600" />
                            <span>{formatTimeRange(new Date(event.startTime), new Date(event.endTime))}</span>
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                            Duration: {formatDuration(new Date(event.startTime), new Date(event.endTime))}
                        </div>
                    </div>
                    {event.description && (
                        <p className="text-sm text-gray-700 mb-2">{event.description}</p>
                    )}
                    <div className="flex justify-between items-center mt-3">
                        <button
                            onClick={addToCalendar}
                            className="text-xs text-gray-700 hover:text-blue-800 flex items-center transition-colors"
                        >
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            Add to Calendar
                        </button>
                        <a
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-blue-700 hover:text-blue-900 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Visit website <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

// Main Calendar component
export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFallbackNotice, setShowFallbackNotice] = useState(false);
    const [platformsWithFallbackData, setPlatformsWithFallbackData] = useState([]);
    const [platformFilter, setPlatformFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

                const response = await axios.get(
                    `https://node.codolio.com/api/contest-calendar/v1/all/get-contests?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`
                );

                if (response.data.status.success) {
                    const transformedEvents = response.data.data.map(contest => ({
                        id: contest._id,
                        title: contest.contestName,
                        platform: contest.platform,
                        startTime: new Date(contest.contestStartDate),
                        endTime: new Date(contest.contestEndDate),
                        url: contest.contestUrl,
                        description: contest.contestType,
                        duration: contest.contestDuration
                    }));

                    setEvents(transformedEvents);
                } else {
                    throw new Error(response.data.status.message);
                }
            } catch (error) {
                console.error('Error loading events:', error);
                setError('Failed to load events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, [currentMonth]);

    const prevMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handleRefresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
            const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

            const response = await axios.get(
                `https://node.codolio.com/api/contest-calendar/v1/all/get-contests?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`
            );

            if (response.data.status.success) {
                const transformedEvents = response.data.data.map(contest => ({
                    id: contest._id,
                    title: contest.contestName,
                    platform: contest.platform,
                    startTime: new Date(contest.contestStartDate),
                    endTime: new Date(contest.contestEndDate),
                    url: contest.contestUrl,
                    description: contest.contestType,
                    duration: contest.contestDuration
                }));

                setEvents(transformedEvents);
            } else {
                throw new Error(response.data.status.message);
            }
        } catch (error) {
            console.error('Error refreshing events:', error);
            setError('Failed to refresh events data');
        } finally {
            setLoading(false);
        }
    };

    const currentMonthEvents = events.filter(event => {
        const eventDate = new Date(event.startTime);
        const matchesMonth =
            eventDate.getMonth() === currentMonth.getMonth() &&
            eventDate.getFullYear() === currentMonth.getFullYear();

        const matchesPlatform = platformFilter === 'all' || event.platform === platformFilter;
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesMonth && matchesPlatform && matchesSearch;
    });

    const days = getDaysInMonth(currentMonth);
    const firstDayOfMonth = days[0].getDay();
    const emptyCells = Array(firstDayOfMonth).fill(null);

    return (
        <div className="calendar-container bg-white rounded-xl shadow-md p-6 max-w-6xl mx-auto">
            <CalendarHeader currentMonth={currentMonth} prevMonth={prevMonth} nextMonth={nextMonth} />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 px-2">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 font-medium">Filter by platform:</label>
                    <select
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        value={platformFilter}
                        onChange={(e) => setPlatformFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="leetcode">LeetCode</option>
                        <option value="codeforces">Codeforces</option>
                        <option value="codechef">CodeChef</option>
                        <option value="atcoder">AtCoder</option>
                        <option value="hackerrank">HackerRank</option>
                        <option value="geeksforgeeks">GeeksforGeeks</option>
                    </select>
                </div>
                <input
                    type="text"
                    placeholder="Search contest..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm w-full sm:w-64"
                />
            </div>

            {showFallbackNotice && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium">Some platform APIs are currently unavailable</p>
                            <p className="text-sm mt-1">Using sample data for: {platformsWithFallbackData.join(', ')}</p>
                            <div className="mt-2">
                                <Button variant="outline" size="sm" onClick={handleRefresh} className="text-sm">
                                    Retry API Calls
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-lg text-gray-600">Loading contests from platforms...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-lg text-red-500">{error}</p>
                    <Button onClick={handleRefresh} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                        Retry
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-7 gap-0.5 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    {daysOfWeek.map(day => (
                        <div key={day} className="py-3 font-medium text-sm text-gray-600 bg-gray-50 text-center border-b border-gray-200">
                            {day}
                        </div>
                    ))}

                    {emptyCells.map((_, index) => (
                        <div key={`empty-${index}`} className="date-cell bg-white min-h-[100px] border border-gray-100"></div>
                    ))}

                    {days.map(day => {
                        const dayEvents = getEventsForDay(day, currentMonthEvents);
                        const isToday = isCurrentDay(day);

                        return (
                            <div key={day.toString()} className={`date-cell min-h-[100px] p-2 bg-white border border-gray-100 hover:bg-gray-50 transition-colors ${isToday ? 'border-2 border-blue-500' : ''}`}>
                                <div className={`date-number text-right mb-1 ${isToday ? 'font-bold text-white bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center ml-auto' : 'text-gray-700'}`}>
                                    {day.getDate()}
                                </div>
                                <div className="mt-1 space-y-1 max-h-24 overflow-y-auto">
                                    {dayEvents.slice(0, 3).map(event => (
                                        <EventItem key={event.id} event={event} />
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <div className="text-xs text-gray-500 text-center mt-1 bg-gray-100 py-1 rounded">
                                            +{dayEvents.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
