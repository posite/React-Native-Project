import React from "react"

import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Calendar from './Calendar';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View style={CenterStyle.container}>
      <Text>Home</Text>
    </View>
  );
}

function LibraryScreen() {
  return (
    <View style={CenterStyle.container}>
      <Text>Library</Text>
    </View>
  );
}

function MyPaceScreen() {
  return (
    <View style={CenterStyle.container}>
      <Text>My Pace</Text>
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={() => {
        return { tabBarStyle: { height: 75 }, headerShown: false, tabBarLabelStyle: { marginTop: 5, } };
      }}
    >
      <Tab.Screen name="HOME" component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (<Ionicons
            name={focused ? "home-sharp" : "home-outline"}
            size={30}
          />)
        }} />
      <Tab.Screen name="CALENDAR" component={Calendar}
        options={{
          tabBarIcon: ({ focused }) => (<Ionicons
            name={focused ? "calendar" : "calendar-outline"}
            size={30}
          />)
        }} />
      <Tab.Screen name="LIBRARY" component={LibraryScreen}
        options={{
          tabBarIcon: ({ focused }) => (<Ionicons
            name={focused ? "library" : "library-outline"}
            size={30}
          />)
        }} />

      <Tab.Screen name="MYPACE" component={MyPaceScreen}
        options={{
          tabBarIcon: ({ focused }) => (<Ionicons
            name={focused ? "person" : "person-outline"}
            size={30}
          />)
        }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </>
  );
}

const CenterStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})