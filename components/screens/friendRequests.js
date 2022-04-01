import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendRequests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      session_token: '',
      userListData: [],
      toggleRequests: false,
      user_id: '',
      my_user_id: '',
      first_name: '',
      last_name: '',
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.getFriendRequests();
  }

  componentWillUnmount() {
    clearInterval(this.state);
  }

  getFriendRequests = async () => {
    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token'),
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          userListData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  acceptFriend = async (user_id) => {
    return fetch('http://localhost:3333/api/1.0.0/friendrequests/' + user_id, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token'),
      },
    })
      .then(async (responseJson) => {
        this.getFriendRequests();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  rejectFriend = async (user_id) => {
    return fetch('http://localhost:3333/api/1.0.0/friendrequests/' + user_id, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token'),
      },
    })
      .then((response) => {
        this.getFriendRequests();
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
    } else {
      return (
        <ScrollView>
          <View>
            <Text style={styles.header}>Friend Requests</Text>
          </View>

          <View style={styles.container}>
            <FlatList
              contentContainerStyle={styles.flatList}
              data={this.state.userListData}
              renderItem={({ item }) => (
                <View style={styles.profileBox}>
                  <Text style={styles.names}>
                    {item.first_name} {item.last_name}
                  </Text>

                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => this.acceptFriend(item.user_id)}
                    >
                      <Text style={styles.buttonText}>Accept Friend </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => this.rejectFriend(item.user_id)}
                    >
                      <Text style={styles.buttonText}> Reject Friend </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => item.user_id.toString()}
            />
          </View>
        </ScrollView>
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
  names: {
    fontSize: 18,
    padding: 5,
    margin: 5,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
  },
  button: {
    backgroundColor: '#62929A',
    padding: 10,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
  },

  buttonsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopColor: '#D4D4D4',
    borderTopWidth: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    padding: 8,
    alignSelf: 'stretch',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
  },
  flatList: {
    marginTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  profileBox: {
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

export default FriendRequests;
