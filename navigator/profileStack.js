import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';

import Profile from '../components/screens/profile';
import Post from '../components/screens/Post';
import FriendsStack from './friendsStack';

const Stack = createNativeStackNavigator();

class ProfileStack extends Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="ProfileScreen"
          component={Profile}
          options={{ headerLeft: (props) => null, headerShown: false }}
        />
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen name="Friends" component={FriendsStack} />
      </Stack.Navigator>
    );
  }
}
export default ProfileStack;
