import React, { Component } from 'react';
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import ProfileStack from './profileStack';
import Settings from '../components/screens/settings';
import SearchStack from './searchStack';

const Tab = createBottomTabNavigator();

class MainTab extends Component {
  render() {
    return (
      <Tab.Navigator
        initialRouteName="Profile"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Settings') {
              iconName = focused ? 'settings-outline' : 'settings-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search-circle' : 'search-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          headerShown: false,
        })}
        tabBarOptions={{
          activeTintColor: '#62929A',
          inactiveTintColor: 'grey',
        }}
      >
        <Tab.Screen name="Settings" component={Settings} />
        <Tab.Screen name="Profile" component={ProfileStack} />
        <Tab.Screen name="Search" component={SearchStack} />
      </Tab.Navigator>
    );
  }
}

export default MainTab;
