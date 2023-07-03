import React, { Component } from 'react';
import { FlatList, Text, View, TouchableOpacity, Alert, Image, Modal } from 'react-native';
import { ListItem, Avatar, Card } from 'react-native-elements';
import Loading from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { SwipeListView } from 'react-native-swipe-list-view';
import * as Animatable from 'react-native-animatable';

// redux 
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    carts: state.carts,
  }
};

import { deleteCart } from '../redux/ActionCreators';
const mapDispatchToProps = (dispatch) => ({
  deleteCart: (dishId) => dispatch(deleteCart(dishId))
});

class AddCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showGif: false,
    };
  }
  calculateBasketTotal = () => {
    const { dishes, carts } = this.props;
    const total = carts.reduce((prev, cartItemId) => {
      const dish = dishes.dishes.find((dish) => dish.id === cartItemId);
      if (dish) {
        const price = Number(dish.price.replace("$", ""));
        return prev + price;
      }
      return prev;
    }, 0);

    const totalUSD = total.toLocaleString("en", {
      style: "currency",
      currency: "USD",
    });

    return totalUSD;
  };
  handlePlaceOrder = () => {
    const { carts, deleteCart } = this.props;
    this.setState({ showGif: true });
    setTimeout(() => {
      carts.forEach((cartItemId) => {
        deleteCart(cartItemId); // Delete each item from the cart
      });
      this.setState({ showGif: false });
    }, 4000);;
  };
  render() {
    if (this.props.dishes.isLoading) {
      return (<Loading />);
    } else if (this.props.dishes.errMess) {
      return (<Text>{this.props.dishes.errMess}</Text>);
    } else {
      const dishes = this.props.dishes.dishes.filter((dish) => this.props.carts.some((el) => el === dish.id));
      const basketTotal = this.calculateBasketTotal();
      const deliveryFee = this.props.carts.length > 0 ? 10 : 0;
      const { showGif } = this.state;

      return (
        <View>
          <Animatable.View animation='fadeInRightBig' duration={2000} style={{ borderRadius: 40 }}>
            <View style={{ backgroundColor: 'rgba(251, 146, 60, 0.2)', flexDirection: 'row', paddingLeft: 16, paddingRight: 16, alignItems: 'center' }}>
              <Avatar source={require('../assets/bikeGuy.png')} containerStyle={{ flex: 1, width: 120, height: 120 }} />
              <Text style={{ paddingLeft: 16, flex: 1 }}>Deliver in 20-30 minutes</Text>
            </View>
            <SwipeListView data={dishes}
              renderItem={({ item, index }) => this.renderMenuItem(item, index)}
              renderHiddenItem={({ item, index }) => this.renderHiddenItem(item, index)}
              keyExtractor={(item) => item.id.toString()}
              rightOpenValue={-100} />
          </Animatable.View>
          <View style={{ backgroundColor: 'rgba(251, 146, 60, 0.2)', padding: 28, borderTopLeftRadius: 48, borderTopRightRadius: 48, marginBottom: 24, position: 'absolute', top: 520, left: 0, right: 0, paddingBottom: 50 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
              <Text style={{ color: '#4B5563' }}>Subtotal</Text>
              <Text style={{ color: '#4B5563' }}>{`${basketTotal}$`}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
              <Text style={{ color: '#4B5563' }}>Delivery Fee</Text>
              <Text style={{ color: '#4B5563' }}>{`${deliveryFee}$`}</Text>
            </View>
            <Card.Divider />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Order Total</Text>
              <Text style={{ fontWeight: 'bold' }}>
                {`${(Number(basketTotal.replace(/[^0-9.-]+/g, '')) + Number(deliveryFee)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}
              </Text>
            </View>
            <View>
              {!this.state.showGif ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(251, 146, 60, 1)',
                    padding: 25,
                    borderRadius: 9999,
                  }}
                  onPress={this.handlePlaceOrder}
                >
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}
                  >
                    Place Order
                  </Text>
                </TouchableOpacity>
              ) : (
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={showGif}
                >
                  <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={{ uri: baseUrl + './images/bikeGuy2.gif' }} style={{ width: '100%', height: '50%' }} size="xlarge" />
                    <Text style={{ color: 'rgba(251, 146, 60, 1)', fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>Order Have been Placed!</Text>
                  </View>
                </Modal>
              )}
            </View>
          </View>
        </View>
      );
    }
  }
  renderMenuItem(item, index) {
    const { navigate } = this.props.navigation;

    return (
      <ListItem key={index} onPress={() => navigate('Dishdetail', { dishId: item.id })}>
        <Avatar source={{ uri: baseUrl + item.image }} />
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
          <ListItem.Subtitle>{item.price}</ListItem.Subtitle>
        </ListItem.Content>
        <Text> x 1 </Text>
      </ListItem>
    );
  }
  renderHiddenItem(item, index) {
    return (
      <View style={{ alignItems: 'center', backgroundColor: '#DDD', flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 15 }}>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, bottom: 0, right: 0, width: 100, backgroundColor: 'red' }}
          onPress={() => {
            Alert.alert(
              'Delete this' + item.name + 'from cart?',
              'Are you sure you wish to delete this : ' + item.name + '?',
              [
                { text: 'Cancel', onPress: () => { /* nothing */ } },
                { text: 'OK', onPress: () => this.props.deleteCart(item.id) }
              ]
            );
          }}>
          <Text style={{ color: '#FFF' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddCart);
