import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      my_user_id: '',
      session_token: '',
      isLoading: true,
      listData: [],
      useCamera: false,
      hasPermission: null,
      type: Camera.Constants.Type.back,
      photo: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',

      new_first_name: '',
      new_last_name: '',
      new_email: '',
      new_password: '',
      invalidEmail: '',
    };
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({ isLoading: true });
      this.getData();
    });

    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  }

  componentWillUnmount() {
    this.unsubscribe();
    clearInterval(this.state);
  }

  getData = async () => {
    const myUserId = await AsyncStorage.getItem('@my_user_id');

    if (myUserId !== null) {
      this.setState({
        my_user_id: myUserId,
      });
    } else {
      console.log('Data Not Loaded');
    }

    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + this.state.my_user_id,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate('LoginStack');
        } else {
          throw 'Something went wrong';
        }
      })
      .then(async (responseJson) => {
        console.log(responseJson);
        this.setState({
          first_name: responseJson.first_name,
          last_name: responseJson.last_name,
          email: responseJson.email,
          new_first_name: responseJson.first_name,
          new_last_name: responseJson.last_name,
          new_email: responseJson.email,
        });
        this.getProfileImage();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updateDetails = async () => {
    let my_user_id = await AsyncStorage.getItem('@my_user_id');

  

    const pattern = /[a-zA-Z0-9]?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
    const result = pattern.test(this.state.new_email);
    if (result === false) {
      this.setState({
        invalidEmail: 'Invalid email address',
    
      });
    } else {
      this.setState({
        invalidEmail: '',
      });
    }


    let to_send = {};

    if (this.state.new_first_name != this.state.first_name) {
      to_send['first_name'] = this.state.new_first_name;
    }

    if (this.state.new_last_name != this.state.last_name) {
      to_send['last_name'] = this.state.new_last_name;
    }

    if (this.state.new_email != this.state.email) {
       to_send['email'] = this.state.new_email;
    }

    console.log(JSON.stringify(to_send));

    if(result === true)
    return fetch('http://localhost:3333/api/1.0.0/user/' + my_user_id, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token'),
      },
      body: JSON.stringify(to_send),
    })
      .then((response) => {
        this.getData();
        console.log('Item updated');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getProfileImage = async () => {
    fetch(
      'http://localhost:3333/api/1.0.0/user/' +
        this.state.my_user_id +
        '/photo',
      {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      }
    )
      .then((res) => {
        return res.blob();
      })
      .then((resBlob) => {
        let data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  uploadProfileImage = async (data) => {
    let session_token = await AsyncStorage.getItem('@session_token');
    let my_user_id = await AsyncStorage.getItem('@my_user_id');

    let res = await fetch(data.base64);
    let blob = await res.blob();

    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + my_user_id + '/photo',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'image/png',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
        body: blob,
      }
    )
      .then((response) => {
        console.log('Image Uploaded', response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.uploadProfileImage(data),
      };
      const data = await this.camera.takePictureAsync(options);
    }
  };

  toggleCamera(boolean) {
    this.setState({
      useCamera: boolean,
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator size="medium" color="powderblue" />
        </View>
      );
    } else if (this.state.hasPermission && this.state.useCamera) {
      return (
        <View style={styles.container}>
          <Camera style={styles.camera} type={this.state.type}>
            <View style={styles.cameraButtonContainer}>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => {
                  let type =
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back;

                  this.setState({ type: type });
                }}
              >
                <Text style={styles.cameraButtonText}> Flip </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => {
                  this.takePicture();
                }}
              >
                <Text style={styles.cameraButtonText}> Take Photo </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => {
                  this.toggleCamera(false);
                }}
              >
                <Text style={styles.cameraButtonText}> Exit </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.userContainer}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: this.state.photo }} style={styles.image} />
            </View>

            <Text>
              {' '}
              name: {this.state.first_name} {this.state.last_name}{' '}
            </Text>
            <Text> email: {this.state.email} </Text>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => {
                this.toggleCamera(true);
              }}
            >
              <Text style={styles.text}> Camera </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.header}>Update User Details:</Text>

            <TextInput
              style={styles.textInput}
              placeholder="Enter new First Name..."
              onChangeText={(new_first_name) =>
                this.setState({ new_first_name })
              }
              value={this.state.new_first_name}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter new Last Name..."
              onChangeText={(new_last_name) => this.setState({ new_last_name })}
              value={this.state.new_last_name}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter new Email..."
              onChangeText={(new_email) => this.setState({ new_email })}
              value={this.state.new_email}
            />
          </View>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => this.updateDetails()}
          >
            <Text style={styles.updateButtonText}> Update </Text>
          </TouchableOpacity>

          <Text style={styles.errorText}> {this.state.invalidEmail} </Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
    margin: 5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  inputContainer: {
    padding: 12,
  },
  textInput: {
    borderColor: '#D4D4D4',
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 10,
    fontSize: 20,
  },
  updateButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  updateButton: {
    backgroundColor: '#62929A',
    padding: 7,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  camera: {
    display: 'flex',
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
  },
  cameraButtonText: {
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraButtonContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  cameraButton: {
    backgroundColor: '#8A8A8A',
    opacity: 0.5,
    padding: 10,
    marginBottom: 25,
    borderRadius: 5,
  },

  image: {
    flex: 1,
    width: null,
    height: null,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  imageContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
    width: 250,
    height: 250,
    display: 'flex',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },

  text: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    margin: 5,
    color: '#b30404',
    fontSize: 16,
    alignSelf: 'center',
  },
});

export default Settings;
