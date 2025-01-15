import React, { useState, useRef } from 'react';
import { Animated, Text, View, TouchableOpacity, PanResponder } from 'react-native';
import calendarStyle from './Themes';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isWeekly, setIsWeekly] = useState(false);
    


    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };
    const animatedHeight = useRef(new Animated.Value(getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) / 7 * 50 + 24)).current; // 초기 높이 설정
    let height = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) / 7 * 50 + 24

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

    const isSelectedDate = (year: number, month: number, day: number, limit: number) => {
        if (day > limit || day <= 0) return calendarStyle.dayText;
        if (selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day) {
            return calendarStyle.selectedDay;
        }
        return calendarStyle.dayText;
    }

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 10; // 작은 움직임은 무시
            },
            onStartShouldSetPanResponderCapture: () => false,
            onPanResponderMove(e, gestureState) {
                if(Math.abs(gestureState.dy) < 5) return true
                //console.log(gestureState.dy)
                const value = height + gestureState.dy
                if (gestureState.dy > 0) {
                    //console.log(true);
                    setIsWeekly(false);
                    if (value > (renderDays().length / 7 - 1) * 50 + 24) {
                        height = (renderDays().length / 7 - 1) * 50 + 24
                        Animated.spring(animatedHeight, {
                            toValue: height,
                            useNativeDriver: false,
                        }).start();
                    } else {
                        Animated.spring(animatedHeight, {
                            toValue: value,
                            useNativeDriver: false,
                        }).start();
                    }
                } else {
                    if (value <= 50) {
                        setIsWeekly(true);
                        height = 50
                        Animated.spring(animatedHeight, {
                            toValue: 50,
                            useNativeDriver: false,
                        }).start();
                    } else {
                        Animated.spring(animatedHeight, {
                            toValue: value,
                            useNativeDriver: false,
                        }).start();
                    }
                    
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if(Math.abs(gestureState.dy) < 5) return true
                const value = height + gestureState.dy
                //console.log("height " + height)
                if (value < 50) {
                    Animated.spring(animatedHeight, {
                        toValue: 50,
                        useNativeDriver: false,
                    }).start();
                    setIsWeekly(true);
                } else if(value > (renderDays().length / 7 - 1) * 50 + 24) {
                    height = (renderDays().length / 7 - 1) * 50 + 24;
                    Animated.spring(animatedHeight, {
                        toValue: height,
                        useNativeDriver: false,
                    }).start();
                } else {
                    setIsWeekly(false);
                    Animated.spring(animatedHeight, {
                        toValue: value,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

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
        if (isWeekly) {
            const selectedDay = selectedDate.getDate();
            const startOfWeek = selectedDay - (selectedDate.getDay() || 7);
            const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek + i);
            height = 50
            return weekDays.map((day, index) => (
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
        } else {
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
        }
    };

    const handleMonthChange = (offset: number) => {
        const newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + offset,
            1
        );
        setCurrentDate(newDate);
    };

    const handleWeekChange = (offset: number) => {
        const newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + offset * 7
        );
        setCurrentDate(newDate);
    }

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

            <Animated.View style={[calendarStyle.daysGrid, { height: animatedHeight, overflow: 'hidden' }]} {...panResponder.panHandlers}>
                {renderDays()}
            </Animated.View>

        </View>
    );
};

export default Calendar;