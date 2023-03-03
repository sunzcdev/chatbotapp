/**
 * @format
 */

import {AppRegistry, StyleSheet, View} from 'react-native';
import {name as appName} from './app.json';
import ChatBotScreen from './src/ChatBotScreen';

const App = () => {
  return (
    <View style={styles.container}>
      <ChatBotScreen />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
});

AppRegistry.registerComponent(appName, () => App);
