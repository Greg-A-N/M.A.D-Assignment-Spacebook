import React, { Component } from 'react';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { View } from 'react-native-web';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      valid: false,
      invalidPassword: '',
      invalidEmail: '',
    };
  }

  signup = () => {
    if (this.state.password.length <= 5) {
      this.setState({
        invalidPassword: 'Password needs to be greater than 5 characters',
      });
    } else {
      this.setState({
        invalidPassword: '',
        valid: true,
      });
    }

    const pattern = /[a-zA-Z0-9]?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
    const result = pattern.test(this.state.email);
    if (result === false) {
      this.setState({
        invalidEmail: 'Invalid email address',
    
      });
    } else {
      this.setState({
        invalidEmail: '',
      });
    }

    if(this.state.valid && result === true)
    return fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 400) {
          throw 'Failed validation';
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        console.log('User created with ID: ', responseJson);
        this.props.navigation.navigate('Login');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.header}> Signup </Text>

          <TextInput
            placeholder="Enter your first name..."
            onChangeText={(first_name) => this.setState({ first_name })}
            value={this.state.first_name}
            style={{ padding: 5, borderWidth: 1, margin: 5 }}
          />
          <TextInput
            placeholder="Enter your last name..."
            onChangeText={(last_name) => this.setState({ last_name })}
            value={this.state.last_name}
            style={{ padding: 5, borderWidth: 1, margin: 5 }}
          />
          <TextInput
            placeholder="Enter your email..."
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
            style={{ padding: 5, borderWidth: 1, margin: 5 }}
          />
          <TextInput
            placeholder="Enter your password..."
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            secureTextEntry
            style={{ padding: 5, borderWidth: 1, margin: 5 }}
          />
          <TouchableOpacity style={styles.button} onPress={() => this.signup()}>
            <Text style={styles.buttonText}> Create an account </Text>
          </TouchableOpacity>
          <Text style={styles.errorText}> {this.state.invalidPassword} </Text>
          <Text style={styles.errorText}> {this.state.invalidEmail} </Text>
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
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
  },
  button: {
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
    color: '#b30404',
    fontSize: 16,
    paddingVertical: 5,
    textAlign: 'center',
  },
});

export default Signup;
