import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';

import SearchList from '../components/screens/search';
import Profile from '../components/screens/profile';
import Post from '../components/screens/Post';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

class SearchStack extends Component {
  render() {
    return (
      <Stack.Navigator  screenOptions={{ title: false }}>
        <Stack.Screen
          name="SearchScreen"
          component={SearchList}
          options={{ headerLeft: (props) => null, headerShown: false }}
        />
        <Stack.Screen name="OtherProfile" component={Profile} />
        <Stack.Screen name="OtherProfilePost" component={Post} />
      </Stack.Navigator>
    );
  }
}
export default SearchStack;
