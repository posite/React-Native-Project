import { Text, View } from 'react-native';
import CenterStyle from './Themes'

function Calendar() {
    return (
        <View style={CenterStyle.container}>
            <Text>Calendar View </Text>
        </View>
    );
}

export function CalendarScreen() {
    return (
        Calendar()
    );
}