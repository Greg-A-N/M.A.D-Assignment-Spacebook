import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native-web';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errorMessage: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value !== null) {
      this.props.navigation.navigate('Home');
    }
  };

  login = async () => {
    return fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            errorMessage: '',
          });
          return response.json();
        } else if (response.status === 400) {
          this.setState({
            errorMessage: 'Invalid email or password',
          });
          throw 'Invalid email or password';
        } else {
          throw 'Something went wrong';
        }
      })
      .then(async (responseJson) => {
        console.log(responseJson);
        await AsyncStorage.setItem('@session_token', responseJson.token);
        await AsyncStorage.setItem('@my_user_id', responseJson.id);
        this.props.navigation.goBack('Home');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.header}> Login </Text>

          <TextInput
            placeholder="Enter your email..."
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Enter your password..."
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            secureTextEntry
            style={styles.textInput}
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => this.login()}
          >
            <Text style={styles.loginButtonText}> Login </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => this.props.navigation.navigate('Signup')}
          >
            <Text style={styles.signupButtonText} > Don't have an account? </Text>
          </TouchableOpacity>

          <Text style={styles.errorText}> {this.state.errorMessage} </Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: '500',
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#62929A',
  },

  signupButtonText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
  },

  loginButton: {
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#BDBDBD',
    padding: 8,
    marginVertical: 3,
  },

  signupButton: {
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#62929A',
    padding: 8,
    marginVertical: 3,
  },
  container: {
    paddingHorizontal: 60,
    flex: 1,
    alignItems: 'center',
    alignItems: 'stretch',
    justifyContent: 'center',
    marginTop: 30,
  },
  textInput: {
    padding: 5,
    borderWidth: 1,
    margin: 5,
  },
  errorText: {
    margin: 5,
    color: '#b30404',
    fontSize: 16,
    alignSelf: 'center',
  },
});

export default Login;
