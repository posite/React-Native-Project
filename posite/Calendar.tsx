import React, { useState, useRef, useCallback } from 'react';
import { Animated, Text, View, TouchableOpacity, PanResponder, LogBox } from 'react-native';
import calendarStyle from './Themes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addDays, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, subDays, subMonths, subWeeks, addWeeks, addMonths, eachWeekendOfMonth } from 'date-fns';
import PagerView, { PagerViewOnPageScrollEvent, PagerViewOnPageSelectedEvent } from 'react-native-pager-view';

LogBox.ignoreLogs([
    "Warning: Each child in a list should have a unique \"key\" prop",
]);

const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isWeekly, setIsWeekly] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(2)
    const [swipeDirection, setSwipteDirection] = useState('')

    const weekDates = eachWeekOfInterval(
        {
            start: subDays(new Date(), 14),
            end: addDays(new Date(), 14)
        },
        {
            weekStartsOn: 0
        }
    ).reduce((acc: Date[][], cur) => {
        const allDays = eachDayOfInterval({
            start: cur,
            end: addDays(cur, 6)
        });
        acc.push(allDays);
        return acc;
    }, [])

    const monthDates = eachMonthOfInterval(
        {
            start: subMonths(new Date(), 2),
            end: addMonths(new Date(), 2),
        },

    ).reduce((acc: Date[][], cur) => {
        const start = new Date(cur)
        //console.log(start + " " + start.getDay())
        let subStart = 0
        if (start.getDay() != 0) {
            subStart = start.getDay();
        }
        //console.log("after : " + start + " " + start.getDay())
        const end = new Date(cur)
        //console.log("cur " + cur)
        //console.log("days" + getDaysInMonth(end.getFullYear(), end.getMonth()))
        end.setDate(getDaysInMonth(end.getFullYear(), end.getMonth()))
        let addEnd = 0
        if (end.getDay() != 6) {
            addEnd = 6 - end.getDay()
        }
        //console.log("end" + end)
        const allMonth = eachDayOfInterval({
            start: subDays(start, subStart),
            end: addDays(end, addEnd)
        });
        acc.push(allMonth);
        return acc;
    }, [])

    //console.log(dates)

    function getDaysInMonth(year: number, month: number) {
        return new Date(year, month + 1, 0).getDate();
    };

    const animatedHeight = useRef(new Animated.Value((getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) / 7) * 40)).current; // 초기 높이 설정
    let height = (getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) / 7) * 40

    function getFirstDayOfMonth(year: number, month: number) {
        return new Date(year, month, 1).getDay();
    };

    function getLastDayOfMonth(year: number, month: number) {
        return new Date(year, month, getDaysInMonth(year, month)).getDay();
    };


    function getPreviousMonthDays(year: number, month: number) {
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

    function getNextMonthDays(year: number, month: number) {
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

    function checkConditions(day: number, start: number, limit: number) {
        if (day <= 0) {
            return start + day;
        } else if (day > limit) {
            return day - limit;
        } else {
            return day;
        }
    }

    function isSelectedDate(year: number, month: number, day: number, limit: number) {
        if (day > limit || day <= 0) return calendarStyle.dayText;
        if (selectedDate == null) return calendarStyle.dayText;
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
                if (Math.abs(gestureState.dy) < 10) return true
                let standard = (getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) / 7) * 40
                if (monthDates[currentWeek].length > 35) standard += 40
                //console.log(gestureState.dy)
                const value = height + gestureState.dy
                //console.log("value " + value)
                if (gestureState.dy > 0) {
                    //console.log(true);
                    setIsWeekly(false);
                    if (value > standard) {
                        height = standard
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
                if (Math.abs(gestureState.dy) < 10 && Math.abs(gestureState.dx) < 10) return true
                // if (gestureState.dx < -10) {
                //     handleMonthChange(1)
                //     return true
                // } else if (gestureState.dx > 10) {
                //     handleMonthChange(-1)
                //     return true
                // }
                const value = height + gestureState.dy
                let standard = (getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) / 7) * 40
                if (monthDates[currentWeek].length > 35) standard += 40
                //console.log("value " + value)
                if (value <= 50) {
                    Animated.spring(animatedHeight, {
                        toValue: 50,
                        useNativeDriver: false,
                    }).start();
                    height = 50
                    setIsWeekly(true);
                } else if (value > standard) {
                    height = standard;
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

    function renderDays() {
        //console.log("today " + new Date())
        //console.log("selected day " + selectedDate);
        // const prevMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
        // const prevYear = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
        // const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
        // const lastMonth = getPreviousMonthDays(currentDate.getFullYear(), currentDate.getMonth())
        // let weekDays = Array()
        // const startOfWeek = currentDate.getDate() - (currentDate.getDay() || 7);
        // //console.log(lastMonth.length)
        // if (lastMonth.length == 0) {
        //     if (currentDate.getDate() < 7) {
        //         weekDays = Array.from({ length: 7 }, (_, i) => i + 1);
        //     } else {
        //         weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek + i);
        //     }
        // } else {
        //     weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek + i);
        // }
        //console.log(weekDays)
        //height = 50
        //console.log("height " + height)
        console.log(currentDate)
        if (isWeekly) {
            const week = weekDates[currentWeek]
            let standard = week[6]
            if (swipeDirection == 'Right') standard = week[0]
            return weekDates.map((week, i) => (
                <Animated.View key={i} style={[{ height: animatedHeight, overflow: 'hidden', borderBottomWidth: 1, borderStyle: 'dotted', borderColor: '#ccc' }]} {...panResponder.panHandlers}>
                    <View style={calendarStyle.pagerRow}>
                        {week.map(day => {
                            const disabled = day.getMonth() != standard.getMonth() || day.getFullYear() != standard.getFullYear();
                            //console.log(disabled)
                            return (
                                <TouchableOpacity onPress={() => setSelectedDate(day)} style={calendarStyle.dateText}>
                                    <Text style={[isSelectedDate(day.getFullYear(), day.getMonth(), day.getDate(), getDaysInMonth(day.getFullYear(), day.getMonth())),
                                    disabled ? calendarStyle.otherMonthDay : calendarStyle.dayText
                                    ]}>{day.getDate()}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>


                </Animated.View>

            ));
        } else {
            const month = monthDates[currentWeek]
            const standard = month[6]
            //if(swipeDirection == 'Right') standard = month[0]
            return monthDates.map((week, i) => (
                <Animated.View key={i} style={[{ height: animatedHeight, overflow: 'hidden', borderBottomWidth: 1, borderStyle: 'dotted', borderColor: '#ccc' }]} {...panResponder.panHandlers}>
                    <View style={calendarStyle.pagerRow}>
                        {week.map(day => {
                            const disabled = day.getMonth() != standard.getMonth() || day.getFullYear() != standard.getFullYear();
                            //console.log(disabled)
                            //console.log(i)
                            return (
                                <TouchableOpacity onPress={() => setSelectedDate(day)} style={calendarStyle.dateText}>
                                    <Text style={[isSelectedDate(day.getFullYear(), day.getMonth(), day.getDate(), getDaysInMonth(day.getFullYear(), day.getMonth())),
                                    disabled ? calendarStyle.otherMonthDay : calendarStyle.dayText]}>{day.getDate()}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>


                </Animated.View>

            ));
        }
        //console.log("currentDate " + currentDate)
        // if (isWeekly) {
        //     const lastMonth = getPreviousMonthDays(currentDate.getFullYear(), currentDate.getMonth())
        //     let weekDays = Array()
        //     const startOfWeek = currentDate.getDate() - (currentDate.getDay() || 7);
        //     //console.log(lastMonth.length)
        //     if (lastMonth.length == 0) {
        //         if (currentDate.getDate() < 7) {
        //             weekDays = Array.from({ length: 7 }, (_, i) => i + 1);
        //         } else {
        //             weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek + i);
        //         }
        //     } else {
        //         weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek + i);
        //     }
        //     //console.log(weekDays)
        //     height = 50
        //     return weekDates.map((week, i) => (

        //         <View key={i}>
        //             <View style={{flexDirection: 'row', alignItems: 'center'}}>
        //                 {week.map(day => {
        //                     console.log(i)
        //                     return (
        //                         <TouchableOpacity onPress={() => setSelectedDate(day)} style={{ flexDirection: 'row', justifyContent: 'center' }}>
        //                             <Text style={calendarStyle.dayText}>{day.getDate()}</Text>
        //                         </TouchableOpacity>
        //                     )
        //                 })}
        //             </View>


        //         </View>

        //     ));
        // } else {
        //     const days = Array(getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth())).concat(
        //         getPreviousMonthDays(currentDate.getFullYear(), currentDate.getMonth()), Array.from({ length: getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }, (_, i) => i + 1), getNextMonthDays(currentDate.getFullYear(), currentDate.getMonth())
        //     );

        //     return days.map((day, index) => (
        //         <View key={index} style={calendarStyle.dayContainer}>
        //             <TouchableOpacity onPress={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}>
        //                 <Text
        //                     style={[
        //                         isSelectedDate(currentDate.getFullYear(), currentDate.getMonth(), day, getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())),
        //                         day <= 0 || day > getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) ? calendarStyle.otherMonthDay : calendarStyle.dayText,
        //                     ]}
        //                 >
        //                     {checkConditions(day, daysInPrevMonth, getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()))}
        //                 </Text>
        //             </TouchableOpacity>
        //         </View>
        //     ));
        // }
    };

    function handleMonthChange(offset: number) {
        if (isWeekly) {
            const newDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + offset * 7
            );
            //console.log("new Date " + newDate)
            setCurrentDate(newDate);
        } else {
            const newDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + offset,
            );
            setCurrentDate(newDate);
        }

    };

    function renderDate(date: String) {
        if (date == 'Sun') {
            return calendarStyle.sundayText
        } else if (date == 'Sat') {
            return calendarStyle.saturdayText
        } else {
            return calendarStyle.weekdayText
        }
    }

    // const handlePageScroll = (event: PagerViewOnPageScrollEvent) => {
    //     const { position, offset } = event.nativeEvent;

    //     if (offset > 0) {
    //         // 스크롤이 오른쪽으로 이동 중
    //         if (position > currentWeek) {
    //             setSwipteDirection('Right');
    //             //setCurrentWeek(position)
    //         } else if (position < currentWeek) {
    //             setSwipteDirection('Left');
    //             //setCurrentWeek(position)
    //         }

    //     }
    //     console.log(currentWeek)
    //     console.log(swipeDirection)
    // };

    const handlePageSelected = (event: PagerViewOnPageSelectedEvent) => {
        const { position } = event.nativeEvent;
        setCurrentDate(monthDates[position][6])
        console.log(position + " " + monthDates[position].length)
        let standard = (getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) / 7) * 40
        if (monthDates[position].length > 35) standard += 45
        if (!isWeekly) {
            height = standard
            Animated.spring(animatedHeight, {
                toValue: standard,
                useNativeDriver: false,
            }).start();
        }
        if (position > currentWeek) {
            setSwipteDirection('Right');
            //setCurrentWeek(position)
        } else if (position < currentWeek) {
            setSwipteDirection('Left');
            //setCurrentWeek(position)
        }
        setCurrentWeek(position)
        //console.log(currentWeek)
        //console.log(swipeDirection)
    };

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
            <View style={calendarStyle.pagerContainer}>
                <View style={calendarStyle.pagerRow}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <Text key={index} style={renderDate(day)}>{day}</Text>

                    ))}
                </View>
                <PagerView style={calendarStyle.pagerContainer} initialPage={currentWeek} onPageSelected={handlePageSelected}>
                    {renderDays()}
                </PagerView>
            </View>
            {/* 날짜 */}

            {/* <Animated.View style={[calendarStyle.daysGrid, { height: animatedHeight, overflow: 'hidden' }]} {...panResponder.panHandlers}>
                
            </Animated.View> */}

        </View>
    );
};

export default Calendar;