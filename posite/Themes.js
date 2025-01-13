import { StyleSheet } from 'react-native';


const CalendarStyle = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
        marginBottom: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    weekdayText: {
        width: '14.28%',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 14,
        color: '#aaa'
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayContainer: {
        width: '14.28%',
        height: 50,
        justifyContent: 'center'
    },
    dayText: {
        textAlign: 'center',
        fontSize: 16
    },
    otherMonthDay: {
        color: '#ccc',
    },
    sundayText: {
        textAlign: 'center',
        width: '14.28%',
        justifyContent: 'center',
        fontSize: 14,
        color: '#c00',
    },
    saturdayText: {
        textAlign: 'center',
        width: '14.28%',
        justifyContent: 'center',
        fontSize: 14,
        color: '#0cc'
    }
});

export default CalendarStyle;
