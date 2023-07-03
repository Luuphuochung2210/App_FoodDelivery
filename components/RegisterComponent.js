import React, { Component } from 'react';
import {
  NativeBaseProvider, Box, Center, Container, Heading, VStack, FormControl, Input, HStack,
  IconButton, Icon, MaterialCommunityIcons, Button, Link, Image
} from "native-base";
import * as ImagePicker from 'expo-image-picker';
import { baseUrl } from '../shared/baseUrl';
import { getDatabase, ref, child, set } from 'firebase/database';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: baseUrl + 'images/logo.png',
      username: '',
      password: '',
      confirmpass: '',
      inProcess: false
    }
  }
  render() {
    return <Center w="100%">
      <Box safeArea p="2" w="90%" maxW="290" py="8">
        <Heading size="lg" color="coolGray.800" _dark={{
          color: "warmGray.50"
        }} fontWeight="semibold" textAlign={'center'}>
          HL Kitchen
        </Heading>
        <Image source={{ uri: baseUrl + './images/LogoHL.png' }}
          style={{ width: 150, height: 135, alignSelf: 'center' }}></Image>
        <Heading mt="1" color="coolGray.600" _dark={{
          color: "warmGray.200"
        }} fontWeight="medium" size="xs" textAlign={'center'} textDecorationLine={'underline'}>
          Tạo tài khoản
        </Heading >
        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label >Họ và tên</FormControl.Label>
            <Input isDisabled={this.state.inProcess} onChangeText={(changed) => { this.setState({ fullName: changed }) }} />
          </FormControl>
          <FormControl>
            <FormControl.Label >Tài khoản</FormControl.Label>
            <Input isDisabled={this.state.inProcess} onChangeText={(changed) => { this.setState({ username: changed }) }} />
          </FormControl>
          <FormControl>
            <FormControl.Label>Mật khẩu</FormControl.Label>
            <Input type="password" isDisabled={this.state.inProcess} onChangeText={(changed) => { this.setState({ password: changed }) }} />
          </FormControl>
          <FormControl>
            <FormControl.Label>Xác nhận mật khẩu</FormControl.Label>
            <Input type="password" secureTextEntry={true} isDisabled={this.state.inProcess} onChangeText={(changed) => { this.setState({ confirmPassword: changed }) }} />
          </FormControl>
          <Button mt="2" isDisabled={this.state.inProcess} backgroundColor={'#bd6604'} onPress={() => this.handleRegister()} >
            Tạo tài khoản
          </Button>
        </VStack>
      </Box>
    </Center>
  }
  async getImageFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      const capturedImage = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3] });
      if (!capturedImage.canceled) {
        this.setState({ imageUrl: capturedImage.assets[0].uri });
      }
    }
  }
  handleRegister() {
    const { username, password, confirmPassword } = this.state;
    if (!username) {
      alert('Tên đăng nhập không được để trống');
      return;
    }
    // Check if password field is empty
    if (!password) {
      alert('Mật khẩu không được để trống');
      return;
    }
    if (password !== confirmPassword) {
      alert('Mật khẩu không trùng khớp!');
      return;
    } else {
      const dbRef = ref(getDatabase());
      set(child(dbRef, 'accounts/' + this.state.username), {
        username: this.state.username,
        password: this.state.password
      }).then(() => { alert('Tạo tài khoản thành công!'); })
        .catch((error) => alert('Could not set data from firebase', error));
      this.props.navigation.navigate('Login');
    }
  }
}
export default Register;