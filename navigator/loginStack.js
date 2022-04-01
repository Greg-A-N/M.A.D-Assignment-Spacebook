import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';

import MainDrawer from './drawer';
import Login from '../components/screens/login';
import Signup from '../components/screens/signup';
import Logout from '../components/screens/logout';

const Stack = createNativeStackNavigator();

class LoginStack extends Component {
  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerTitle: 'Spacebook',
          headerTintColor: '#62929A',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 30,
          },
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Home"
          component={MainDrawer}
          options={{ headerLeft: (props) => null, headerShown: false }}
        />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Logout" component={Logout} />
      </Stack.Navigator>
    );
  }
}
export default LoginStack;
