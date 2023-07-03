import React, { Component } from 'react';
import {
  NativeBaseProvider, Box, Center, Container, Heading, VStack, FormControl, Input, HStack,
  IconButton, Icon, MaterialCommunityIcons, Button, Link, View
}
  from "native-base";
import { Image, Text } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { baseUrl } from '../shared/baseUrl';
import { getDatabase, ref, child, set, get } from 'firebase/database';

import { connect } from 'react-redux';
const mapStateToProps = (state) => {
  return {
    users: state.users
  }
};
import { loginUser } from '../redux/ActionCreators';
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox';
const mapDispatchToProps = (dispatch) => ({
  loginUser: (userinfo) => dispatch(loginUser(userinfo))
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      remember: false
    }
    this.handleLogin = this.handleLogin.bind(this);
  }
  render() {
    return (
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image alt='' source={{ uri: baseUrl + './images/LogoHL.png' }}
              style={{ width: 150, height: 135, alignSelf: 'center' }}></Image>
          </View>
          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>Tài khoản</FormControl.Label>
              <Input value={this.state.username} isDisabled={this.state.inProcess} onChangeText={(username) => {
                this.setState({ username })
              }} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Mật khẩu</FormControl.Label>
              <Input type="password" secureTextEntry={true} isDisabled={this.state.inProcess} value={this.state.password} onChangeText={(password) => {
                this.setState({ password })
              }} />
            </FormControl>
            <CheckBox containerStyle={{ backgroundColor: null }}
              title={'Remember Me'}
              checked={this.state.remember}
              onPress={() => this.setState({ remember: !this.state.remember })} />
            <Button mt="2" backgroundColor={'#bd6604'} onPress={this.handleLogin} >
              Đăng nhập
            </Button>
            <HStack mt="6" justifyContent="center">
              <Text fontSize="sm" color="coolGray.600" _dark={{
                color: "warmGray.200"
              }}>
                Chưa có tài khoản ? Tạo tài khoản tại đây.{" "}
              </Text>
              <Link _text={{
                color: "indigo.500",
                fontWeight: "medium",
                fontSize: "sm",
              }} onPress={() => {
                this.props.navigation.navigate('Register')
              }}>
                Đăng ký
              </Link>
            </HStack>
          </VStack>
        </Box>
      </Center>
    )
  }
  componentDidMount() {
    if (this.props.users.userinfo && this.props.users.userinfo.remember === true) {
      this.setState({
        username: this.props.users.userinfo.username,
        password: this.props.users.userinfo.password,
        remember: this.props.users.userinfo.remember
      });
    }
  }
  handleLogin() {
    const dbRef = ref(getDatabase());

    get(child(dbRef, 'accounts/' + this.state.username)).then((snapshot) => {
      if (snapshot.exists()) {
        const account = snapshot.val();
        if (account.password === this.state.password) {
          const userinfo = {
            username: this.state.username,
            password: this.state.password,
            remember: this.state.remember
          };
          this.props.loginUser(userinfo);
          this.props.navigation.navigate('GifScreen'); // Navigate to GifScreen
          setTimeout(() => {
            this.props.navigation.navigate('HomeScreen'); // Navigate to HomeScreen after 3 seconds
          }, 3000);
        } else {
          alert('Nhập sai tên tài khoản hoặc mật khẩu!');
        }
      }
    }).catch((error) => alert('Could not get data from firebase', error));
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);