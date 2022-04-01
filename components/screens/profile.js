import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

class Profile extends Component {
  constructor() {
    super();

    this.state = {
      my_user_id: '',
      session_token: '',
      user_id: '',
      photo: '',

      isLoading: true,
      first_name: '',
      last_name: '',
      email: '',
      isFriend: true,
      requestSent: '',

      postListData: [],
      post_id: '',
      text: '',
      timestamp: '',
      author: [],
      quantity: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({ isLoading: true });
      this.getData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    clearInterval(this.state);
    console.log('profile component unmounting');
  }

  getData = async () => {
    const sessionToken = await AsyncStorage.getItem('@session_token');
    const myUserId = await AsyncStorage.getItem('@my_user_id');

    this.setState({ my_user_id: myUserId });
    let user_id = null;
    if (
      sessionToken &&
      myUserId !== null &&
      this.props.route.params?.user_id !== undefined
    ) {
      user_id = this.props.route.params.user_id;
      this.setState({
        user_id: this.props.route.params.user_id,
      });
    } else if (sessionToken && myUserId !== null) {
      user_id = myUserId;
      this.setState({
        user_id: myUserId,
      });
    } else {
      console.log('Data Not Loaded');
    }
    return fetch('http://localhost:3333/api/1.0.0/user/' + user_id, {
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token'),
      },
    })
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
        });
        this.getPosts();
        this.getProfileImage();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getProfileImage = async () => {
    fetch(
      'http://localhost:3333/api/1.0.0/user/' + this.state.user_id + '/photo',
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

  getPosts = async () => {
    console.log('getting post data...');
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + this.state.user_id + '/post',
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
        } else if (response.status === 403) {
          this.setState({ isFriend: false });
          throw 'Can only view the posts of yourself or your friends';
        } else {
          throw 'Something went wrong';
        }
      })
      .then(async (responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          postListData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addPost = async () => {
    let to_send = {
      text: this.state.text,
    };
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + this.state.user_id + '/post',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
        body: JSON.stringify(to_send),
      }
    )
      .then(async (responseJson) => {
        console.log(responseJson);
        this.getPosts();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  likePost = async (post_id) => {
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' +
        this.state.user_id +
        '/post/' +
        post_id +
        '/like',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      }
    )
      .then(async (responseJson) => {
        this.getPosts();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  removeLike = async (post_id) => {
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' +
        this.state.user_id +
        '/post/' +
        post_id +
        '/like',
      {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      }
    )
      .then((response) => {
        this.getPosts();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addFriend = async () => {
    // may have to be id of current users profile!
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + this.state.user_id + '/friends',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      }
    )
      .then((response) => {
        if (response.status === 201) {
          this.setState({ requestSent: 'Friend Request Sent!' });
          console.log('Friend Added!');
        } else if (response.status === 403) {
          this.setState({ requestSent: 'Friend Request Already Sent' });
        } else {
          throw 'Something went wrong';
        }
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
    } else if (this.state.user_id == this.state.my_user_id) {
      return (
        <ScrollView>
          <View style={styles.userContainer}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: this.state.photo }} style={styles.image} />
            </View>

            <Text style={styles.name}>
              {this.state.first_name} {this.state.last_name}
            </Text>

            <View style={styles.profileButtonsContainer}>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() =>
                  this.props.navigation.goBack('Home', {
                    screen: 'HomeTab',
                    screen: 'Feed',
                  })
                }
              >
                <Text style={styles.buttonText}> Manage Profile </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileButton}
                onPress={() =>
                  this.props.navigation.navigate('Home', {
                    screen: 'Profile',
                    params: {
                      screen: 'Friends',
                      params: {
                        user_id: this.state.user_id,
                      },
                    },
                  })
                }
              >
                <Text style={styles.buttonText}> Friends </Text>
                <Ionicons name="people-outline" size={20} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Enter New Post..."
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
            />

            <TouchableOpacity
              style={styles.inputButton}
              onPress={() => this.addPost()}
            >
              <Text style={styles.inputButtonText}> Post </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <FlatList
              contentContainerStyle={styles.flatList}
              data={this.state.postListData}
              renderItem={({ item }) => (
                <View style={styles.post}>
                  <Text style={styles.postText}>
                    {item.author.first_name} {item.author.last_name}{' '}
                    {moment(item.timestamp).format(' HH:mm - DD/MM/YYYY ')}{' '}
                    Likes: {item.numLikes}{' '}
                  </Text>

                  <Text>{item.text}</Text>

                  <View style={styles.postButtons}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => this.likePost(item.post_id)}
                    >
                      <Text style={styles.text}> Like </Text>
                      <Ionicons name="heart-outline" size={20} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => this.removeLike(item.post_id)}
                    >
                      <Text style={styles.text}> Remove Like </Text>
                      <Ionicons name="heart-dislike-outline" size={20} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() =>
                        this.props.navigation.navigate('Home', {
                          screen: 'Profile',
                          params: {
                            screen: 'Post',
                            params: {
                              user_id: this.state.user_id,
                              my_user_id: this.state.my_user_id,
                              post_id: item.post_id,
                              author_id: item.author.user_id,
                            },
                          },
                        })
                      }
                    >
                      <Text style={styles.text}> Edit Post </Text>
                      <Ionicons name="create-outline" size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              //keyExtractor={(item,index) => item.id.toString()}
            />
          </View>
        </ScrollView>
      );
      // if not friends profile
    } else if (this.state.isFriend === false) {
      return (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: this.state.photo }} style={styles.image} />
            </View>

            <Text style={styles.name}>
              {this.state.first_name} {this.state.last_name}
            </Text>

            <TouchableOpacity
              style={styles.addFriendButton}
              onPress={() => this.addFriend()}
            >
              <Text style={styles.inputButtonText}> Add Friend </Text>
            </TouchableOpacity>
            <Text style={styles.text}> {this.state.requestSent} </Text>
          </View>
        </ScrollView>
      );
      // other friends profile
    } else {
      return (
        <ScrollView>
          <View>
            <View style={styles.imageContainer}>
              <Image source={{ uri: this.state.photo }} style={styles.image} />
            </View>

            <Text style={styles.name}>
              {this.state.first_name} {this.state.last_name}
            </Text>
          </View>

          <View style={styles.profileButtonsContainer}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() =>
                this.props.navigation.navigate('Home', {
                  screen: 'Profile',
                  params: {
                    screen: 'Friends',
                    params: {
                      screen: 'FriendsList',
                      params: {
                        user_id: this.state.user_id,
                        first_name: this.state.first_name,
                        last_name: this.state.last_name,
                      },
                    },
                  },
                })
              }
            >
              <Text style={styles.buttonText}> Friends </Text>
              <Ionicons name="people-outline" size={20} />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.header}>New Post</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter New Post..."
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
            />

            <TouchableOpacity
              style={styles.inputButton}
              onPress={() => this.addPost()}
            >
              <Text style={styles.inputButtonText}> Post </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <FlatList
              contentContainerStyle={styles.flatList}
              data={this.state.postListData}
              renderItem={({ item }) => (
                <View style={styles.post}>
                  <Text style={styles.postText}>
                    {item.author.first_name} {item.author.last_name}{' '}
                    {moment(item.timestamp).format(' HH:mm - DD/MM/YYYY ')}{' '}
                    Likes: {item.numLikes}{' '}
                  </Text>

                  <Text>{item.text}</Text>

                  <View style={styles.postButtons}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => this.likePost(item.post_id)}
                    >
                      <Text style={styles.text}> Like </Text>
                      <Ionicons name="heart-outline" size={20} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => this.removeLike(item.post_id)}
                    >
                      <Text style={styles.text}> Remove Like </Text>
                      <Ionicons name="heart-dislike-outline" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() =>
                        this.props.navigation.navigate('Home', {
                          screen: 'Search',
                          params: {
                            screen: 'OtherProfilePost',
                            params: {
                              user_id: this.state.user_id,
                              my_user_id: this.state.my_user_id,
                              post_id: item.post_id,
                              author_id: item.author.user_id,
                            },
                          },
                        })
                      }
                    >
                      <Text style={styles.text}> Edit Post </Text>
                      <Ionicons name="create-outline" size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              //keyExtractor={(item,index) => item.id.toString()}
            />
          </View>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 5,
    margin: 5,
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'center',
  },
  container: {},
  userContainer: {
    backgroundColor: '#FBFBFB',
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
  },
  addFriendButton: {
    backgroundColor: '#62929A',
    padding: 10,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileButtonsContainer: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    padding: 10,
  },
  profileButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  textInput: {
    borderTopColor: '#D4D4D4',
    borderTopWidth: 1,
    backgroundColor: 'white',
    padding: 10,
    fontSize: 20,
  },
  inputButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#62929A',
    padding: 10,
  },
  inputButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },

  postText: {
    fontWeight: '600',
    paddingHorizontal: 2,
  },

  postButtons: {
    marginTop: 10,
    paddingTop: 10,
    borderTopColor: '#D4D4D4',
    borderTopWidth: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  flatList: {
    flex: 1,
    marginTop: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 20,
    alignSelf: 'stretch',
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
    alignSelf: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  post: {
    display: 'flex',
    marginTop: 20,
    backgroundColor: '#FBFBFB',
    paddingHorizontal: 5,
    paddingVertical: 10,
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

export default Profile;
