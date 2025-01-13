import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import calendarStyle from './Themes';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const getLastDayOfMonth = (year, month) => {
        return new Date(year, month, getDaysInMonth(year, month)).getDay();
    };

    const getPreviousMonthDays = (year, month) => {
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

    const getNextMonthDays = (year, month) => {
        const lastDay = getLastDayOfMonth(year, month);
        const nextMonthDays = [];
        const lastDate = getDaysInMonth(year,month)
        if (lastDay !== 6) {
            for (let i = lastDay + 1; i < 7; i++) {
                nextMonthDays.push(lastDate-lastDay+i);
            }
        }
        return nextMonthDays;
    };

    const checkConditions = (day: number, start: number, limit: number) => {
        if(day <= 0) {
            return start + day;
        } else if(day > limit) {
            return day - limit;
        } else {
            return day;
        }
    }

    const renderDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const prevMonthDays = getPreviousMonthDays(year, month);
        const nextMonthDays = getNextMonthDays(year, month);

        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

        const days = Array(firstDay).concat(
            prevMonthDays, Array.from({ length: daysInMonth }, (_, i) => i + 1), nextMonthDays
        );
        const start = prevMonthDays.length;
        const end = start + daysInMonth;
        return days.map((day, index) => (
            <View key={index} style={calendarStyle.dayContainer}>
                {<Text
                    style={[
                        calendarStyle.dayText,
                        day <= 0 || day > daysInMonth ? calendarStyle.otherMonthDay : calendarStyle.dayText,
                    ]}
                >
                    {checkConditions(day, daysInPrevMonth, daysInMonth)}
                </Text>}
            </View>
        ));
    };

    const handleMonthChange = (offset) => {
        const newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + offset,
            1
        );
        setCurrentDate(newDate);
    };

    const renderDate = (date) => {
        if(date == 'Sun') {
            return calendarStyle.sundayText
        } else if(date == 'Sat') {
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
                    <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={calendarStyle.headerText}>
                    {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                </Text>
                <TouchableOpacity onPress={() => handleMonthChange(1)}>
                <MaterialCommunityIcons name="chevron-right" size={24} color="black" />
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