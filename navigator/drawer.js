import React, { Component } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LoginStack from './loginStack';
import MainTab from './mainTab';
import FriendsStack from './friendsStack';
import Logout from '../components/screens/logout';

const Drawer = createDrawerNavigator();

class MainDrawer extends Component {
  render() {
    return (
      <NavigationContainer initialRouteName="LoginStack">
        <Drawer.Navigator
          screenOptions={{
            headerTitle: 'Spacebook',
            headerTintColor: '#62929A',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 30
            },
          }}

        >
          <Drawer.Screen name="Home" component={MainTab} />
          <Drawer.Screen name="Friends" component={FriendsStack} />
          <Drawer.Screen
            name="Logout"
            component={Logout}
            options={{ headerLeft: false }}
          />
          <Drawer.Screen
            name="LoginStack"
            component={LoginStack}
            options={{
              headerShown: false,
              drawerLabel: () => null,
              drawerIcon: () => null,
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
}

export default MainDrawer;
