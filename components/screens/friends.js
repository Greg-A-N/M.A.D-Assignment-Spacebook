import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Friends extends Component {
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
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({ isLoading: true });
      this.getUsers();
    });
  }

  componentWillUnmount() {
    clearInterval(this.state);
    console.log('profile component unmounting');
  }

  getUsers = async () => {
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
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + user_id + '/friends',
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
          userListData: responseJson,
        });
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
          <View>
            <Text style={styles.header}> My Friends</Text>

            <TouchableOpacity style={styles.button}
                   onPress={() =>
                    this.props.navigation.navigate('Friends', {
                      screen: 'FriendRequests',
                    })
                  }
                  >
                     <Text style={styles.ButtonText}> Friend Requests
                    </Text>
                    </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <FlatList
              contentContainerStyle={styles.flatList}
              data={this.state.userListData}
              renderItem={({ item }) => (
                <View style={styles.profileBox}>

                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('Friends', {
                        screen: 'OtherProfile',
                        params: {
                          user_id: item.user_id,
                        },
                      })
                    }
                  >
                     <Text style={styles.names}>
                      {' '}
                      {item.user_givenname + ' ' + item.user_familyname}{' '}
                    </Text>
                    </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => item.user_id.toString()}
            />
          </View>
        </ScrollView>
      );
      // friends of friends
    } else {
      return (
        <ScrollView>
          <View>
            <Text style={styles.header}> {this.props.route.params.first_name} {this.props.route.params.last_name} Friends</Text>
          </View>

          <View style={styles.container}>
            <FlatList
              contentContainerStyle={styles.flatList}
              data={this.state.userListData}
              renderItem={({ item }) => (
                <View style={styles.profileBox}>
                
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('Friends', {
                        screen: 'OtherProfile',
                        params: {
                          user_id: item.user_id,
                        },
                      })
                    }
                  >
                    <Text style={styles.names}>
                      {' '}
                      {item.user_givenname + ' ' + item.user_familyname}{' '}
                    </Text>
                    </TouchableOpacity>

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
  button: {
    backgroundColor: '#62929A',
    padding: 7,
    display: 'flex',
    alignItems: 'center'
  },
  ButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
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
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
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

export default Friends;
