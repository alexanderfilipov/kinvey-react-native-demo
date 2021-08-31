/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, PureComponent} from 'react';
import {StyleSheet, Text, View, FlatList, Button, Linking, Image} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {AuthorizationGrant, DataStore, DataStoreType, User, Files} from 'kinvey-react-native-sdk';
import {register, unregister} from 'kinvey-react-native-sdk/lib/push';
import { Buffer } from 'buffer';

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
  state = { books: [], image: null };

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

  async uploadFile() {
    try {
      const selectedFiles = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      const metadata = selectedFiles[0];
      metadata.public = true;
      metadata.filename = metadata.name;
      metadata.mimeType = metadata.type;

      const fileContent = await RNFS.readFile(metadata.uri, 'base64');
      const buff = Buffer.from(fileContent, 'base64');
      await Files.upload(buff, metadata);

      // display the image
      const fileWithType = `data:image/jpeg;base64,${fileContent}`
      this.setState({
        image: fileWithType,
      });
    } catch (err) {
      console.log(err + JSON.stringify(err));
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
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
        <Button title="Upload file" onPress={() => { this.uploadFile() }} />
        <Text>Data collection</Text>
        <FlatList
          data={this.state.books}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          style={styles.item}
        />
        <Image style={{ width: 300, height: 150, margin: 20 }} source={{ uri: this.state.image }} />
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
