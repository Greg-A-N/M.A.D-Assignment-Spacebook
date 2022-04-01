import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SearchList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      session_token: '',
      userListData: [],
      totalUserListData: [],
      search_text: '',
      user_id: '',
      first_name: '',
      last_name: '',
      limit: 20,
      offset: 0,
      pageCounter: 0,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({ isLoading: true });
      this.getUsers();
      this.getTotalUsers();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    clearInterval(this.state);
    console.log('search component unmounting');
  }

  pageForward = async () => {
    if (this.state.totalUserListData.length > this.state.limit) {
      this.setState({
        pageCounter: this.state.pageCounter + 1,
        offset: this.state.offset + this.state.limit,
      });
      console.log('page forwards');
      console.log(this.state.offset);
      this.getUsers();
    }
  };

  pageBack = async () => {
    if (this.state.pageCounter != 0) {
      this.setState({
        pageCounter: this.state.pageCounter - 1,
        offset: this.state.offset - this.state.limit,
      });
      this.getUsers();
    }
  };

  getUsers = async () => {
    console.log('get users..');
    //console.log(this.state.offset)
    return fetch(
      'http://localhost:3333/api/1.0.0/search?q=' +
        this.state.search_text +
        '&limit=' +
        this.state.limit +
        '&offset=' +
        this.state.offset,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          userListData: responseJson,
        });
        console.log(this.state.userListData.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getTotalUsers = async () => {
    console.log('get users..');
    //console.log(this.state.offset)
    return fetch(
      'http://localhost:3333/api/1.0.0/search?q=' + this.state.search_text,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          totalUserListData: responseJson,
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
    } else {
      return (
        <ScrollView>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Search Spacebook</Text>

            <TextInput
              style={styles.textInput}
              placeholder="Search..."
              onChangeText={(search_text) => this.setState({ search_text })}
              value={this.state.search_text}
            />

            <TextInput
              style={styles.textInput}
              placeholder="Limit per page"
              onChangeText={(limit) =>
                this.setState({ limit, offset: 0, pageCounter: 0 })
              }
              value={this.limit}
            />

            <TouchableOpacity
              style={styles.inputButton}
              onPress={() => this.getUsers()}
            >
              <Text style={styles.inputButtonText}> Search </Text>
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
                      this.props.navigation.navigate('Home', {
                        screen: 'Search',
                        params: {
                          screen: 'OtherProfile',
                          params: {
                            user_id: item.user_id,
                          },
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
            <View  style={styles.pageButtonsContainer}>
            <TouchableOpacity
              style={styles.pageButton}
              onPress={() => this.pageBack()}
            >
              <Text style={styles.text}> Back page </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.pageButton}
              onPress={() => this.pageForward()}
            >
              <Text style={styles.text}> Next Page </Text>
            </TouchableOpacity>

           
            </View>
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
  headerContainer: {
    backgroundColor: 'white',
  },
  names: {
    fontSize: 18,
    padding: 5,
    margin: 5,
    alignSelf: 'center',
  },
  inputButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#62929A',
    padding: 10,
  },
  textInput: {
    borderTopColor: '#D4D4D4',
    borderTopWidth: 1,
    backgroundColor: 'white',
    padding: 10,
    fontSize: 20,
  },
  inputButtonText: {
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
    marginTop: 10,
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
  pageButtonsContainer: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  pageButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    //display: 'flex',
    //flexDirection: 'row',
  },
});

export default SearchList;
