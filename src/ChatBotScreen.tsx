import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  // BackHandler,
  // Image,
} from 'react-native';

import React, {Component} from 'react';

interface ChatBotScreenProps {}

interface ChatBotScreenState {
  messages: {content: string; role: 'user' | 'assistant'}[];
  inputText: string;
}

class ChatBotScreen extends Component<ChatBotScreenProps, ChatBotScreenState> {
  scrollViewRef: React.RefObject<ScrollView>;
  constructor(props: ChatBotScreenProps) {
    super(props);
    this.state = {
      messages: [],
      inputText: '',
    };
    this.scrollViewRef = React.createRef();
  }

  updateMessages(messages: any) {
    this.setState(
      {
        messages: messages,
        inputText: '',
      },
      () => {
        // scroll to end of messages after updating state
        if (this.scrollViewRef.current) {
          this.scrollViewRef.current.scrollToEnd();
        }
      },
    );
  }
  onSendText = async () => {
    const {messages, inputText} = this.state;
    if (!inputText.trim()) {
      return;
    }
    messages.push({content: inputText, role: 'user'});
    this.updateMessages(messages);

    // send inputText to OpenAI API and get response
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer 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',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: this.state.messages,
        max_tokens: 100,
        temperature: 0.7,
        n: 1,
        stop: '\\\\n',
      }),
    });
    const {choices} = await response.json();
    const botResponse = choices[0].message;
    messages.push(botResponse);
    this.updateMessages(messages);
  };

  render() {
    const {messages, inputText} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>与Chat GPT聊天</Text>
        </View>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          ref={this.scrollViewRef}>
          <View style={styles.messagesContainer}>
            {messages.map((message, index) => (
              <View key={index}>
                {message.role === 'user' ? (
                  <View style={styles.userMessageContainer}>
                    {/*<Image*/}
                    {/*  // source={require('../image/bot.png')}*/}
                    {/*  style={styles.botAvatar}*/}
                    {/*/>*/}
                    <Text style={styles.userMessageText}>{message.content}</Text>
                  </View>
                ) : (
                  <View style={styles.botMessageContainer}>
                    <Text style={styles.botMessageText}>{message.content}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={text => this.setState({inputText: text})}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={this.onSendText}>
              <Text style={styles.sendButtonText}>发送</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EDEDED',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center', // add this line
    justifyContent: 'center',
    backgroundColor: '#EDEDED',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  titleText: {
    fontSize: 18,
    color: '#3c3c3c',
  },
  messagesContainer: {
    margin: 10,
  },
  botMessageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    alignSelf: 'flex-start',
    margin: 5,
    maxWidth: '80%',
  },
  userMessageText: {
    fontSize: 16,
    color: '#2f2f2f',
  },
  userMessageContainer: {
    backgroundColor: '#A6EA78',
    borderRadius: 10,
    padding: 10,
    alignSelf: 'flex-end',
    margin: 5,
    maxWidth: '80%',
  },
  botMessageText: {
    fontSize: 16,
    color: '#2f2f2f',
  },
  inputContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#F7F7F7',
    // padding: 10,
    // borderTopWidth: 1,
    // borderTopColor: '#ccc',
    paddingTop: 10,
    paddingBottom: 28,
    paddingLeft: 10,
    paddingRight: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#2f2f2f',
    backgroundColor: '#EFEFEF',
  },
  buttonContainer: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    backgroundColor: '#E9E9E9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#07B95C',
    fontSize: 14,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  botMessageTextContainer: {
    // flex: 1,
  },
});

export default ChatBotScreen;
