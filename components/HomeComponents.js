import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { Card, Image, Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import {
  NativeBaseProvider, Box, Center, Container, Heading, VStack, FormControl, Input, HStack,
  IconButton, MaterialCommunityIcons, Button, Link, AspectRatio, Stack, Divider, Badge
  , Spinner
} from "native-base";
import Loading from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { searchItems } from '../redux/ActionCreators';

class RenderItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.item,
      item: [], // Add your item data here
      isLoading: false, // Add your loading state here
      errMess: '', // Add your error message state here
    };
  }

  render() {
    const { title, isLoading, errMess } = this.props;
    if (this.props.isLoading) {
      return <Loading />;
    } else if (this.props.errMess) {
      return <Text>{this.props.errMess}</Text>;
    } else {
      const item = this.state.items;
      if (item != null) {
        return (
          <Card>
            <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>{title}</Text>
            <Card.Divider></Card.Divider>
            <Image
              source={{ uri: baseUrl + item.image }}
              style={{ width: '100%', height: 250, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <Card.FeaturedTitle>{item.name}</Card.FeaturedTitle>
              <Card.FeaturedSubtitle>{item.designation}</Card.FeaturedSubtitle>
            </Image>
            <Text style={{ margin: 10 }}>{item.description}</Text>
          </Card>
        );
      }
      return <View />;
    }
  }
}

// redux
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    promotions: state.promotions,
    leaders: state.leaders
  }
};

class Home extends Component {
  constructor(props) {
    super(props);
  }
  handleSearchTextChange = (text) => {
    this.props.searchItems(text); // Dispatch the search action
  }
  render() {
    const dish = this.props.dishes.dishes.filter((dish) => dish.featured === true)[0];
    const promo = this.props.promotions.promotions.filter((promo) => promo.featured === true)[0];
    const leader = this.props.leaders.leaders.filter((leader) => leader.featured === true)[0];
    return (
      <ScrollView>
        <Animatable.View ref="renderItem" animation='fadeInRight' duration={2000}>
          <RenderItem item={dish}
            isLoading={this.props.dishes.isLoading}
            errMess={this.props.dishes.errMess}
            title="BEST SELLER" />
        </Animatable.View>
        <Animatable.View ref="renderItem" animation='fadeInRight' duration={2000}>
          <RenderItem item={promo}
            isLoading={this.props.promotions.isLoading}
            errMess={this.props.promotions.errMess}
            title="PROMOTIONS" />
        </Animatable.View>
        <Animatable.View ref="renderItem" animation='fadeInRight' duration={2000}>
          <RenderItem item={leader}
            isLoading={this.props.leaders.isLoading}
            errMess={this.props.leaders.errMess}
            title="CEO" />
        </Animatable.View>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, { searchItems })(Home);
