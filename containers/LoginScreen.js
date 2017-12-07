import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, TextInput, Image, Button} from 'react-native';
import NavigationBar from 'react-native-navbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loginActions from '../actions/loginActions';
import { Actions } from 'react-native-router-flux';

class LoginScreen extends Component {
  state = {
    userName: 'weaVaer',
    userKey: '2c6428ac510246478134b64db43355df',
  };

  login = () => {
    const { userName, userKey } = this.state;
    this.props.actions.loginRequest(userName, userKey);
  };

  render() {
    const { userName, userKey } = this.state;
    const { user } = this.props;

    let error;
    if (user.errorMessage !== '') {
      console.log('user', user, user.errorMessage);
      error = <Text style={{backgroundColor: 'red'}}>{user.errorMessage}</Text>;
    }

    return (
      <View style={styles.container}>
        <View>
          {error}
          <View style={styles.row}>
            {/* <Icon name="user-o" size={25} color="#900" /> */}
            <Image
              style={styles.icon}
              source={require('../assets/icons/user_icon.png')}
            />
            <TextInput
              style={styles.input}
              placeholder="userName"
              onChangeText={userName => this.setState({userName})}
              value={userName}
            />
          </View>          
          <View style={styles.row}>
            {/* <Icon name="key" size={25} color="#900" /> */}
            <Image
              style={styles.icon}
              source={require('../assets/icons/pass_icon.png')}
            />
            <TextInput
              style={styles.input}
              placeholder="userKey"
              onChangeText={userKey => this.setState({userKey})}
              value={userKey}
            />
          </View>
          
          <View style={styles.row}>
            {/* <Icon.Button
              name="envelope-o"
              style={styles.loginBtn}
              onPress={this.login}>
              Login
            </Icon.Button> */}
            <Button
              onPress={this.login}
              title="Login"
              color="#841584"
              accessibilityLabel="Login"
            />
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    //alignSelf: 'center',
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    margin: 10
  },

  row: {
    //flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {

  },

  loginBtn: {
    width: 250,
  }
});

function mapStateToProps(state) {
  const { user } = state;

  return {
    user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(loginActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);