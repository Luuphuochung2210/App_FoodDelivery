import React, { Component } from 'react';
import { View, Text, FlatList, Modal, Button, PanResponder, Alert, Pressable, TouchableOpacity } from 'react-native';
import { Card, Image, Icon, Input, Rating, Avatar, CheckBox } from 'react-native-elements';
import { ScrollView } from 'react-native-virtualized-view';
import { baseUrl } from '../shared/baseUrl';
import * as Animatable from 'react-native-animatable';
import { SliderBox } from 'react-native-image-slider-box';
import { Ionicons } from '@expo/vector-icons';

class RenderSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 30,
      height: 0
    };
  }
  render() {
    const images = [
      baseUrl + this.props.dish.image,
    ];
    return (
      <View style={{ position: 'relative', height: 150 }}>
        <SliderBox images={images} parentWidth={this.state.width - 30} />
      </View>
    );
  }
  onLayout = (evt) => {
    this.setState({
      width: evt.nativeEvent.layout.width,
      height: evt.nativeEvent.layout.height,
    });
  };
}

class RenderDish extends Component {
  constructor(props) {
    super(props);
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
    this.state = {
      showModal: false,
      selectedSauces: [],
      count: 0,
    };
  }
  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };

  handleSauceSelection = (sauce) => {
    const { selectedSauces } = this.state;
    if (selectedSauces.includes(sauce)) {
      this.setState({
        selectedSauces: selectedSauces.filter(
          (selectedSauce) => selectedSauce !== sauce
        ),
      });
    } else {
      this.setState({
        selectedSauces: [...selectedSauces, sauce],
      });
    }
  };

  handleIncrement = () => {
    this.setState((prevState) => ({
      count: prevState.count + 1,
    }));
  };

  handleDecrement = () => {
    this.setState((prevState) => ({
      count: prevState.count > 0 ? prevState.count - 1 : 0,
    }));
  };

  handleAddToCart = () => {
    this.toggleModal();
  };
  render() {
    // gesture
    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
      if (dx < -200) return 1; // right to left
      return 0;
    };
    const recognizeComents = ({ moveX, moveY, dx, dy }) => {
      if (dx > 200) return 2; // left to right
      return 0;
    };
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => { return true; },
      onPanResponderEnd: (e, gestureState) => {
        if (recognizeDrag(gestureState) === 1) {
          Alert.alert(
            'Add Favorite',
            'Are you sure you wish to add ' + dish.name + ' to favorite?',
            [
              { text: 'Cancel', onPress: () => { /* nothing */ } },
              { text: 'OK', onPress: () => { this.props.favorite ? alert('Already favorite') : this.props.onPressFavorite() } },
            ]
          );
        }
        else if (recognizeComents(gestureState) === 2) {
          this.props.onPressComment();
        }
        return true;
      },
    });
    const dish = this.props.dish;
    const { selectedSauces } = this.state;
    const { count } = this.state;

    if (dish != null) {
      return (
        <View {...panResponder.panHandlers}>
          <ScrollView>
            <View style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor: 'white', marginTop: -20, paddingTop: 6, paddingBottom: 50 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', position: 'absolute', marginLeft: 230, marginTop: -30 }}>
                <Icon raised reverse name={this.props.favorite ? 'heart' : 'heart-o'} type='font-awesome' color='#f50'
                  onPress={() => this.props.favorite ? alert('Already favorite') : this.props.onPressFavorite()} />
                <Icon raised reverse name='pencil' type='font-awesome' color='#f50'
                  onPress={() => this.props.onPressComment()} />
              </View>
              <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginTop: 30 }}>
                  {dish.name}
                  <View>
                    {dish.label === 'spicy' && (
                      <Ionicons name="flame-outline" size={30} color="red" />
                    )}
                    {dish.label === 'non-spicy' && (
                      <Ionicons name="flame-outline" size={30} color="blue" />
                    )}
                  </View>
                </Text>
                <View style={{ flexDirection: "row", justifyContent: 'space-between', marginBottom: 15 }}>
                  <Text style={{ fontSize: 15, marginLeft: 15, textTransform: 'capitalize' }}> {dish.category}
                  </Text>
                  <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'right', marginTop: 20, fontWeight: 'bold' }}>
                    {dish.price}
                  </Text>
                </View>
                <Card.Divider />
                <Text style={{ fontSize: 16 }}>{dish.description}</Text>

                <View style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, backgroundColor: '#f50', marginTop: 30, paddingBottom: 30 }}>
                  <Pressable onPressOut={this.toggleModal}>
                    <Text style={{
                      color: 'white',
                      textAlign: 'center',
                      justifyContent: 'center',
                      paddingVertical: 8,
                      textAlignVertical: 'center',
                      marginTop: 20,
                      fontSize: 15,
                      fontWeight: 'bold'
                    }}>Add To Cart
                      <Ionicons name="cart-outline" style={{ fontSize: 15 }}>
                      </Ionicons>
                    </Text>
                  </Pressable>
                </View>

                <Modal visible={this.state.showModal} animationType="slide">
                  <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ padding: 10, marginRight: 320 }}>
                      <Pressable onPress={this.toggleModal}>
                        <Ionicons name="arrow-back" size={30} color="#f50" onPressOut={this.handleAddToCart} />
                      </Pressable>
                    </View>
                    <Avatar source={{ uri: baseUrl + this.props.dish.image }} style={{ width: 300, height: 200 }} />
                    <Card>
                      <Card.Title>Which Sauce would you prefer for this {dish.name} </Card.Title>
                      <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                        <TouchableOpacity onPress={this.handleDecrement} style={{
                          padding: 10,
                        }}>
                          <Ionicons name="remove-circle-outline" size={30} color="black" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black', textAlign: 'center' }}>{count}</Text>
                        <TouchableOpacity onPress={this.handleIncrement} style={{
                          padding: 10,
                        }}>
                          <Ionicons name="add-circle-outline" size={30} color="black" />
                        </TouchableOpacity>
                      </View>
                      <Card.Divider />
                      <CheckBox
                        title="Hot Sauce"
                        checked={selectedSauces.includes('hot sauce')}
                        onPress={() => this.handleSauceSelection('hot sauce')}
                      />
                      <CheckBox
                        title="Tomato Sauce"
                        checked={selectedSauces.includes('tomato sauce')}
                        onPress={() => this.handleSauceSelection('tomato sauce')}
                      />
                      <CheckBox
                        title="Sweet and Sour Sauce"
                        checked={selectedSauces.includes('sweet and sour sauce')}
                        onPress={() => this.handleSauceSelection('sweet and sour sauce')}
                      />
                    </Card>
                    {/* <Button title="Close" onPress={this.toggleModal} /> */}
                    <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0, borderTopLeftRadius: 40, borderTopRightRadius: 40, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, backgroundColor: '#f50', padding: 35 }}>
                      <Pressable onPress={this.props.onPressAdd} onPressOut={this.handleAddToCart}>
                        <Text style={{
                          color: 'white',
                          textAlign: 'center',
                          justifyContent: 'center',
                          textAlignVertical: 'center',
                          fontSize: 15,
                          fontWeight: 'bold'
                        }}>Checkout Order
                          <Ionicons name="cart-outline" style={{ fontSize: 15 }}>
                          </Ionicons>
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              </View>
            </View >
          </ScrollView>
        </View >
      );
    }
  }
}

class RenderComments extends Component {
  render() {
    const comments = this.props.comments;
    return (
      <ScrollView style={{ backgroundColor: 'white', marginTop: -20, paddingTop: 6, paddingBottom: 50 }}>
        <Card>
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
            Comments
            <Ionicons style={{ fontSize: 20, marginLeft: 5 }} name="pencil-outline"></Ionicons>
          </Text>
        </Card>
        <Card.Divider />
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <FlatList data={comments}
            renderItem={({ item, index }) => this.renderCommentItem(item, index)}
            keyExtractor={(item) => item.id.toString()} />
        </View>
      </ScrollView>
    );
  }
  renderCommentItem(item, index) {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Rating startingValue={item.rating} imageSize={16} readonly style={{ flexDirection: 'row' }} />
        <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
      </View>
    );
  };
}

// redux
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites,
    carts: state.carts,
    count: state.count,
  }
};
import { postFavorite, postComment, postCart } from '../redux/ActionCreators';
import { style } from 'deprecated-react-native-prop-types/DeprecatedViewPropTypes';
const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
  postCart: (dishId) => dispatch(postCart(dishId)),
});

class ModalContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 3,
      author: '',
      comment: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onPressCancel = this.onPressCancel.bind(this);
  }
  render() {
    return (
      <View style={{ justifyContent: 'center', marginTop: 70, padding: 20 }}>
        <Avatar source={require('../assets/LogoHL.png')} style={{ width: 150, height: 135, alignSelf: 'center' }} />
        <Rating startingValue={this.state.rating} showRating={true}
          onFinishRating={(value) => this.setState({ rating: value })} />
        <View style={{ height: 20 }} />
        <Input value={this.state.author} placeholder='Your Name' leftIcon={{ name: 'user-o', type: 'font-awesome' }}
          onChangeText={(text) => this.setState({ author: text })} />
        <Input value={this.state.comment} placeholder='Comment' leftIcon={{ name: 'comment-o', type: 'font-awesome' }}
          onChangeText={(text) => this.setState({ comment: text })} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity
            style={{ backgroundColor: '#f50', padding: 15, borderRadius: 5 }}
            onPress={this.handleSubmit}
          >
            <Text style={{ color: '#FFFFFF' }}>SUBMIT</Text>
          </TouchableOpacity>
          <View style={{ width: 10 }} />
          <TouchableOpacity
            style={{ backgroundColor: '#7CC', padding: 15, borderRadius: 5 }}
            onPress={this.onPressCancel}
          >
            <Text style={{ color: '#FFFFFF' }}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  handleSubmit() {
    this.props.postComment(this.props.dishId, this.state.rating, this.state.author, this.state.comment);
    this.props.onPressCancel();
  }
  onPressCancel() {
    this.props.onPressCancel();
  }
}

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }
  render() {
    const dishId = parseInt(this.props.route.params.dishId);
    const dish = this.props.dishes.dishes[dishId];
    const comments = this.props.comments.comments.filter((cmt) => cmt.dishId === dishId);
    const favorite = this.props.favorites.some((el) => el === dishId);
    const cart = this.props.carts.some((el) => el === dishId);
    return (
      <ScrollView>
        <Animatable.View>
          <RenderSlider dish={dish} />
        </Animatable.View>
        <Animatable.View>
          <RenderDish
            dish={this.props.dishes.dishes[dishId]}
            favorite={this.props.favorites.some((el) => el === dishId)}
            cart={this.props.carts.some((el) => el === dishId)}

            onPressFavorite={() => this.markFavorite(dishId)}
            onPressComment={() => this.setState({ showModal: true })}
            onPressAdd={() => this.markToCard(dishId)}
          />
        </Animatable.View>
        <Animatable.View>
          <RenderComments
            comments={this.props.comments.comments.filter(
              (comment) => comment.dishId === dishId
            )}
          />
        </Animatable.View>
        <Modal animationType={'slide'} visible={this.state.showModal} onRequestClose={() => this.setState({ showModal: false })}>
          <ModalContent dishId={dishId} onPressCancel={() => this.setState({ showModal: false })} postComment={this.props.postComment} />
        </Modal>
      </ScrollView>
    );
  }
  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }
  markToCard(dishId) {
    this.props.postCart(dishId);
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);