import { StyleSheet } from 'react-native';


const CalendarStyle = StyleSheet.create({
    container: {
        paddingVertical: 16,
        backgroundColor: '#fff',
        flex: 1
    },
    header: {
        paddingHorizontal: 20,
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
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 14,
        width: '14.2%',
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
        justifyContent: 'center',
    },
    dayText: {
        textAlign: 'center',
        fontSize: 16,
        width: 40,
        textAlignVertical: 'center',
        height: 33
    },
    otherMonthDay: {
        color: '#ccc',
    },
    sundayText: {
        width: '14.2%',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 14,
        color: '#c00',
    },
    saturdayText: {
        width: '14.2%',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 14,
        color: '#0cc'
    }, selectedDay: {
        borderColor: '#0cc',
        borderWidth: 1,
        width: '14.2%',
        height: 33,
        alignContent: 'center',
        alignItems: 'center',
        aspectRatio: 1,
        borderRadius: 50,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16,
    }, pagerContainer: {
        flex: 1,
        height: 'auto',
        marginVertical: 8
    }, pagerRow: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
    }, dateText: {
        width: '14.2%',
        textAlign: 'center',
        alignItems: 'center',
    }
});

export default CalendarStyle;
