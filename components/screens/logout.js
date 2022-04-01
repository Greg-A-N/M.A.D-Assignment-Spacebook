import React, { Component } from 'react';
import { Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native-web';

class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value !== null) {
      this.setState({ token: value });
    } else {
      this.props.navigation.navigate('LoginStack');
    }
  };

  logout = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'post',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate('LoginStack');
        } else if (response.status === 401) {
          this.props.navigation.navigate('LoginStack');
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.header}>Are you sure you want to logout?</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => (
              this.logout(), this.props.navigation.navigate('LoginStack')
            )}
          >
            <Text style={styles.buttonText}> Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => this.props.navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}> Cancel </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 60,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
    margin: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
  },

  logoutButton: {
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#B52118',
    padding: 8,
    marginVertical: 3,
  },

  cancelButton: {
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#62929A',
    padding: 8,
    marginVertical: 3,
  },
  errorText: {
    margin: 5,
    color: '#b30404',
    fontSize: 16,
    alignSelf: 'center',
  },
});

export default Logout;
