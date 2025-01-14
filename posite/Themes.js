import { StyleSheet } from 'react-native';


const CalendarStyle = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff'
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
        width: '14.2%',
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
        width: '14.2%',
        height: 50,
        alignItems: 'center',
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
        width: '14.2%',
        justifyContent: 'center',
        fontSize: 14,
        color: '#c00',
    },
    saturdayText: {
        textAlign: 'center',
        width: '14.2%',
        justifyContent: 'center',
        fontSize: 14,
        color: '#0cc'
    }, selectedDay: {
        borderColor: '#0cc',
        borderWidth: 1,
        height: 40,
        aspectRatio: 1,
        borderRadius: 50,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16
    }
});

export default CalendarStyle;
