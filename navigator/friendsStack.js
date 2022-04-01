import React, { Component } from 'react';
import 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Profile from '../components/screens/profile';
import Post from '../components/screens/Post';
import Friends from '../components/screens/friends';
import FriendRequests from '../components/screens/friendRequests';

const Stack = createNativeStackNavigator();

class FriendsStack extends Component {
  render() {
    return (
      <Stack.Navigator screen>
        <Stack.Screen name="FriendsList" component={Friends}    options={{
            title: false,
            headerLeft: (props) => null,
            headerShown: false,
          }}/>
        <Stack.Screen
          name="OtherProfile"
          component={Profile}
        />
        <Stack.Screen
          name="OtherProfilePost"
          component={Post}
          options={{
            title: false,
            headerLeft: (props) => null,
            headerShown: false,
          }}
        />
        <Stack.Screen name="FriendRequests" component={FriendRequests} />
      </Stack.Navigator>
    );
  }
}
export default FriendsStack;
