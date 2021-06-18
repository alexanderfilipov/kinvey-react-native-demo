/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, PureComponent} from 'react';
import {StyleSheet, Text, View, FlatList, Button, Linking} from 'react-native';
import {AuthorizationGrant, DataStore, DataStoreType, User} from 'kinvey-react-native-sdk';
import {register, unregister} from 'kinvey-react-native-sdk/lib/push';

class BookListItem extends PureComponent {
  render() {
    return (
      <View>
        <Text>{this.props.title}</Text>
      </View>
    );
  }
}

type Props = {};

export default class App extends Component<Props> {
  state = { books: [] };

  _keyExtractor = (item, index) => item._id;

  _renderItem = ({ item }) => (
    <BookListItem
      id={item._id}
      title={item.title}
    />
  );

  async componentDidMount() {
    if (await User.getActiveUser()) {
      console.log('Active user available');
    } else {
      console.log('No active user, please logging in');
    }

    // this.setState({ books });
  }

  async loadCollection() {
    const collection = DataStore.collection('Books', DataStoreType.Network);
    const books = await collection.find().toPromise();
    console.log('books: ' + JSON.stringify(books));
  }

  async registerForPush() {
    const options = {
      // senderID: 'senderId',
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      onRegister: info => {
        console.log('onRegister: ' + JSON.stringify(info));
      },
      onRegistrationError: info => {
        console.log('onRegister: ' + JSON.stringify(info));
      },
      onNotification: notification => {
        console.log('onNotification: ' + JSON.stringify(notification));
      },
    };

    console.log('registering for push...');
    return register(options)
      .then(deviceToken => {
        console.log(deviceToken);
      })
      .catch(error => {
        console.error(error);
      });
  }

  async login() {
    await User.login('admin', 'admin');
    console.log('logged in as admin');
  }

  async loginWithMic() {
    return User.loginWithMIC('kinveydemo://callback', AuthorizationGrant.AuthorizationCodeLoginPage, { micId: 'f58c1bd4f82f416e809ce05e79d44111' })
      .then(user => {
        console.log('logged in with: ' + JSON.stringify(user));
      })
      .catch(err => console.log(err));
  }

  async logout() {
    await User.logout();
    console.log('user logged out');
  }

  render() {
    return (
      <View style={styles.container}>
        <Button title="Login" onPress={this.login} />
        <Button title="Login with MIC" onPress={this.loginWithMic} />
        <Button title="Logout" onPress={this.logout} />
        <Button title="Register Push SDK" onPress={this.registerForPush} />
        <Button title="Hello" onPress={() => console.log('Hello world!')} />
        <Button title="Load collection" onPress={this.loadCollection} />
        <Text>Data collection</Text>
        <FlatList
          data={this.state.books}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          style={styles.item}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
