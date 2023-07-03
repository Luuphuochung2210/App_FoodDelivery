import React, { Component } from 'react';
import { FlatList, View, ScrollView, Text } from 'react-native';
import { ListItem, Avatar, Icon } from 'react-native-elements';
import {
  NativeBaseProvider, Box, Center, Container, Heading, VStack, FormControl, Input, HStack,
  IconButton, MaterialCommunityIcons, Button, Link, AspectRatio, Stack, Divider, Badge
  , Spinner
} from "native-base";
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';
import * as Animatable from 'react-native-animatable';

import { connect } from 'react-redux';
import { searchDishes } from '../redux/ActionCreators'; // Assuming the file path is correct

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes.filteredDishes // Use filteredDishes instead of dishes
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchDishes: (dishName) => dispatch(searchDishes(dishName))
  }
};

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: ''
    };
  }

  handleSearchTextChange = (text) => {
    this.setState({ searchText: text }, () => {
      this.props.searchDishes(this.state.searchText);
    });
  }

  render() {
    return (
      <NativeBaseProvider>
        <View style={{ marginTop: '2%', marginBottom: '2%' }}>
          <VStack space={5} alignItems='center'>
            <FormControl>
              <Input
                onChangeText={this.handleSearchTextChange}
                placeholder="Tìm kiếm sản phẩm"
                value={this.state.searchText}
                width="100%"
                backgroundColor='white'
                borderRadius={4}
                py={3}
                px={1}
                fontSize={15}
                InputRightElement={<Icon
                  reverse
                  color='#f50'
                  name='search-outline'
                  type='ionicon'
                  size={18} />}
              />
            </FormControl>
          </VStack>
        </View>
        <FlatList
          data={this.props.dishes} // Use filteredDishes instead of dishes
          renderItem={({ item, index }) => this.renderMenuItem(item, index)} // Pass item as a prop
          keyExtractor={(item) => item.id.toString()}
        />
      </NativeBaseProvider>
    );
  }

  renderMenuItem(item, index) {
    const { navigate } = this.props.navigation;
    return (
      <ListItem key={index} onPress={() => navigate('Dishdetail', { dishId: item.id })}>
        <Avatar source={{ uri: baseUrl + item.image }} style={{ width: 100, height: 75 }} />
        <ListItem.Content>
          <ListItem.Title style={{ marginBottom: 10, fontStyle: 'italic' }}>{item.name}</ListItem.Title>
          <ListItem.Subtitle>{item.price}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);