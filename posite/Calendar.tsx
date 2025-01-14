import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Button } from 'react-native';
import calendarStyle from './Themes';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const getLastDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, getDaysInMonth(year, month)).getDay();
    };

    const getPreviousMonthDays = (year: number, month: number) => {
        const firstDay = getFirstDayOfMonth(year, month);
        const prevMonthDays = [];
        if (firstDay !== 0) {
            //console.log("prevMonth " + prevMonth)
            for (let i = 0; i < firstDay; i++) {
                prevMonthDays.push(-firstDay + i + 1);
            }
        }
        return prevMonthDays;
    };

    const getNextMonthDays = (year: number, month: number) => {
        const lastDay = getLastDayOfMonth(year, month);
        const nextMonthDays = [];
        const lastDate = getDaysInMonth(year, month)
        if (lastDay !== 6) {
            for (let i = lastDay + 1; i < 7; i++) {
                nextMonthDays.push(lastDate - lastDay + i);
            }
        }
        return nextMonthDays;
    };

    const checkConditions = (day: number, start: number, limit: number) => {
        if (day <= 0) {
            return start + day;
        } else if (day > limit) {
            return day - limit;
        } else {
            return day;
        }
    }

    const isSelectedDate = (year: number, month: number, day: number, limit:number) => {
        if(day > limit || day <= 0) return calendarStyle.dayText;
        if(selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day) {
            return calendarStyle.selectedDay;
        }
        return calendarStyle.dayText;
    }

    const renderDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const prevMonthDays = getPreviousMonthDays(year, month);
        const nextMonthDays = getNextMonthDays(year, month);
        //console.log("today " + new Date())
        //console.log("selected day " + selectedDate);
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

        const days = Array(firstDay).concat(
            prevMonthDays, Array.from({ length: daysInMonth }, (_, i) => i + 1), nextMonthDays
        );
        
        return days.map((day, index) => (
            <View key={index} style={calendarStyle.dayContainer}>
                <TouchableOpacity onPress={() => setSelectedDate(new Date(year, month, day))}>
                    <Text
                        style={[
                            isSelectedDate(year, month, day, daysInMonth),
                            day <= 0 || day > daysInMonth ? calendarStyle.otherMonthDay : calendarStyle.dayText,
                        ]}
                    >
                        {checkConditions(day, daysInPrevMonth, daysInMonth)}
                    </Text>
                </TouchableOpacity>
            </View>
        ));
    };

    const handleMonthChange = (offset: number) => {
        const newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + offset,
            1
        );
        setCurrentDate(newDate);
    };

    const renderDate = (date: String) => {
        if (date == 'Sun') {
            return calendarStyle.sundayText
        } else if (date == 'Sat') {
            return calendarStyle.saturdayText
        } else {
            return calendarStyle.weekdayText
        }
    }

    return (
        <View style={calendarStyle.container}>
            {/* 월 변경 */}
            <View style={calendarStyle.header}>
                <TouchableOpacity onPress={() => handleMonthChange(-1)}>
                    <MaterialCommunityIcons name="chevron-left" size={24} color='#0cc' />
                </TouchableOpacity>
                <Text style={calendarStyle.headerText}>
                    {currentDate.toLocaleString('en-US', { month: 'long' })} {currentDate.getFullYear()}
                </Text>
                <TouchableOpacity onPress={() => handleMonthChange(1)}>
                    <MaterialCommunityIcons name="chevron-right" size={24} color='#0cc' />
                </TouchableOpacity>
            </View>

            {/* 요일 */}
            <View style={calendarStyle.daysGrid}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <Text key={index} style={renderDate(day)}>{day}</Text>
                ))}
            </View>

            {/* 날짜 */}
            <View style={calendarStyle.daysGrid}>{renderDays()}</View>
        </View>
    );
};

export default Calendar;