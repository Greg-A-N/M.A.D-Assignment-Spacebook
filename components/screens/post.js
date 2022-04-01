import React, { Component } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

class Post extends Component {
  constructor() {
    super();

    this.state = {
      user_id: '',
      my_user_id: '',
      session_token: '',
      author_id: '',
      post_id: '',

      isLoading: true,
      first_name: '',
      last_name: '',
      email: '',

      postData: [],
      text: '',
      author: [],
      quantity: '',
    };
  }

  componentDidMount() {
    this.getPost();
  }

  componentWillUnmount() {
    clearInterval(this.state);
    console.log('post component unmounting');
  }

  getPost = async () => {
    try {
      await AsyncStorage.setItem('@post_id', this.props.route.params.post_id);
    } catch (error) {
      console.log('Async data error');
    }
    this.setState({
      post_id: this.props.route.params.post_id,
      session_token: this.props.route.params.session_token,
      user_id: this.props.route.params.user_id,
      my_user_id: this.props.route.params.my_user_id,
      author_id: this.props.route.params.author_id,
    });
    console.log(this.props.route.params.user_id);
    console.log(this.state.user_id);
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' +
        this.state.user_id +
        '/post/' +
        this.state.post_id,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      }
    )
      .then((response) => response.json())
      .then(async (responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          postData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  deletePost = async () => {
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' +
        this.state.user_id +
        '/post/' +
        this.state.post_id,
      {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      }
    )
      .then(() => {
        this.props.navigation.goBack('Home', {
          screen: 'Profile',
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  editPost = async () => {
    let to_send = {
      text: this.state.text,
    };

    return fetch(
      'http://localhost:3333/api/1.0.0/user/' +
        this.state.user_id +
        '/post/' +
        this.state.post_id,
      {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
        body: JSON.stringify(to_send),
      }
    )
      .then((response) => {
        this.getPost();
        console.log('Item updated');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator size="medium" color="powderblue" />
        </View>
      );
      // can only edit and delete posts that you're the author of
    } else if (this.state.author_id == this.state.my_user_id) {
      return (
        <View style={styles.container}>
          <View style={styles.post}>
            <Text style={styles.postText}>
              {this.state.postData.author.first_name}
              {this.state.postData.author.last_name}
              {moment(this.state.postData.timestamp).format(
                ' HH:mm - DD/MM/YYYY '
              )}
            </Text>

            <Text>{this.state.postData.text}</Text>

            <Text style={styles.header}>Edit Post:</Text>
            <TextInput style={styles.textInput}
              placeholder="Enter text..."
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
            />

            <View style={styles.postButtonsContainer}>
              <TouchableOpacity
                style={styles.postButton}
                onPress={() => this.editPost()}
              >
                <Text style={styles.buttonText}> Edit Post </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.postButton}
                onPress={() => this.deletePost()}
              >
                <Text style={styles.buttonText}> Delete Post </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
      // other authors post
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.post}>
            <Text style={styles.postText}>
              {this.state.postData.author.first_name}
              {this.state.postData.author.last_name}
              {moment(this.state.postData.timestamp).format(
                ' HH:mm - DD/MM/YYYY '
              )}
            </Text>

            <Text>{this.state.postData.text}</Text>
          </View>
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
    justifyContent: 'center',
    alignContent: 'center',
  },

  postText: {
    fontWeight: '600',
    paddingHorizontal: 2,
    padding: 8,
  },
  textInput: {
    borderTopColor: '#D4D4D4',
    borderTopWidth: 1,
    padding: 10,
    fontSize: 16,
    alignSelf: 'stretch',
  },
  buttonText: {
    color: 'white',
  },
  postButton: {
    backgroundColor: '#62929A',
    padding: 10,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
  },

  postButtonsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopColor: '#D4D4D4',
    borderTopWidth: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    padding: 8,
    alignSelf: 'stretch'
  },

  post: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: '#FBFBFB',
    paddingHorizontal: 15,
    borderRadius: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
});

export default Post;
