import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StackView, createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image, Linking } from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import Home from './HomeComponents';
import About from './AboutComponents';
import Contact from './ContactComponents';
import { baseUrl } from '../shared/baseUrl';
import Reservation from './ReservationComponent';
import Login from './LoginComponent';
import Register from './RegisterComponent';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function TabNavigatorScreen() {
  const TabNavigator = createBottomTabNavigator();
  return (
    <TabNavigator.Navigator initialRouteName='Login'>
      <TabNavigator.Screen name='Login' component={Login}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (<Icon name='sign-in' type='font-awesome' size={size} color={color} />)
        }} />
      <TabNavigator.Screen name='Register' component={Register}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (<Icon name='user-plus' type='font-awesome' size={size} color={color} />)
        }} />
    </TabNavigator.Navigator>
  );
}

function LoginNavigatorScreen() {
  const LoginNavigator = createStackNavigator();
  return (
    <LoginNavigator.Navigator initialRouteName='LoginRegister'
      screenOptions={{
        headerStyle: { backgroundColor: '#rgba(251, 146, 60, 1)' },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff' },
      }}>
      <LoginNavigator.Screen name='LoginRegister' component={TabNavigatorScreen}
        options={({ navigation }) => ({
          headerTitle: 'Sign In / Register',
        })} />
    </LoginNavigator.Navigator>
  );
}



function ReservationNavigatorScreen() {
  const ReservationNavigator = createStackNavigator();
  return (
    <ReservationNavigator.Navigator initialRouteName='Reservation'
      screenOptions={{
        headerStyle: { backgroundColor: '#rgba(251, 146, 60, 1)' },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff' }
      }}>
      <ReservationNavigator.Screen name='Reservation' component={Reservation}
        options={({ navigation }) => ({
          headerTitle: 'Reserve Table',
          headerLeft: () => (<Icon name='menu' size={36} color='#fff' onPress={() => navigation.toggleDrawer()} />)
        })} />
    </ReservationNavigator.Navigator>
  );
}


function HomeNavigatorScreen() {
  const HomeNavigator = createStackNavigator();
  return (
    <HomeNavigator.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerStyle: { backgroundColor: '#rgba(251, 146, 60, 1)' },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff' }
      }}>
      <HomeNavigator.Screen name='Home' component={Home}
        options={({ navigation }) => ({
          headerTitle: 'Home',
          headerLeft: () => (<Icon name='menu' size={36} color='#fff' onPress={() => navigation.toggleDrawer()} />)
        })} />
    </HomeNavigator.Navigator>
  );
}

function MenuNavigatorScreen() {
  const MenuNavigator = createStackNavigator();
  return (
    <MenuNavigator.Navigator
      initialRouteName='Menu'
      screenOptions={{
        headerStyle: { backgroundColor: '#rgba(251, 146, 60, 1)' },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff' }
      }}>
      <MenuNavigator.Screen name='Menu' component={Menu}
        options={({ navigation }) => ({
          headerTitle: 'Menu',
          headerLeft: () => (<Icon name='menu' size={36} color='#fff' onPress={() => navigation.toggleDrawer()} />)
        })} />
      <MenuNavigator.Screen name='Dishdetail' component={Dishdetail}
        options={{
          headerTitle: 'Dish Detail'
        }} />
    </MenuNavigator.Navigator>
  );
}

function AboutNavigatorScreen() {
  const AboutNavigator = createStackNavigator();
  return (
    <AboutNavigator.Navigator initialRouteName='About'
      screenOptions={{
        headerStyle: { backgroundColor: '#rgba(251, 146, 60, 1)' },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff' }
      }}>
      <AboutNavigator.Screen name='About' component={About}
        options={({ navigation }) => ({
          headerTitle: 'About',
          headerLeft: () => (<Icon name='menu' size={36} color='#fff' onPress={() => navigation.toggleDrawer()} />)
        })} />
    </AboutNavigator.Navigator>
  );
}

function ContactNavigatorScreen() {
  const ContactNavigator = createStackNavigator();
  return (
    <ContactNavigator.Navigator initialRouteName='Contact'
      screenOptions={{
        headerStyle: { backgroundColor: '#rgba(251, 146, 60, 1)' },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff' }
      }}>
      <ContactNavigator.Screen name='Contact' component={Contact}
        options={({ navigation }) => ({
          headerTitle: 'Contact',
          headerLeft: () => (<Icon name='menu' size={36} color='#fff' onPress={() => navigation.toggleDrawer()} />)
        })} />
    </ContactNavigator.Navigator>
  );
}

function CustomDrawerContent(props) {
  const users = props.users;
  const logoutUser = props.logoutUser;
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ backgroundColor: '#rgba(251, 146, 60, .9)', height: 80, alignItems: 'center', flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Image alt='' source={{ uri: baseUrl + './images/LogoHL.png' }} style={{ margin: 10, width: 80, height: 60 }} />
        </View>
        <View style={{ flex: 2 }}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>HL Kitchen</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
      {
        users.logged === false
          ? (<DrawerItem label='Help' icon={({ focused, color, size }) => <Icon name='help' size={size} color={focused ? '#rgba(251, 146, 60, 1)' : '#ccc'} />} onPress={() => Linking.openURL('https://reactnavigation.org/docs/getting-started')} />)
          : (<DrawerItem label={'[' + users.userinfo.username + '] Logout'} icon={({ focused, color, size }) => <Icon name='sign-out' type='font-awesome' size={size} color={focused ? '#rgba(251, 146, 60, 1)' : '#ccc'} />} onPress={() => { logoutUser(); props.navigation.navigate('HomeScreen'); }} />)
      }
    </DrawerContentScrollView>
  );
}

function MainNavigatorScreen(props) {
  const users = props.users;
  const logoutUser = props.logoutUser;
  const MainNavigator = createDrawerNavigator();

  return (
    <MainNavigator.Navigator initialRouteName='LoginScreen' drawerContent={(props) => <CustomDrawerContent {...props} users={users} logoutUser={logoutUser} />}>
      <MainNavigator.Screen disabled name='GifScreen' component={GifScreen} options={{ headerShown: false, drawerLabel: () => null, unmountOnBlur: true }} />
      {
        users.logged === false
          ? (<MainNavigator.Screen name='LoginScreen' component={LoginNavigatorScreen} options={{ title: 'Login', headerShown: false, drawerIcon: ({ focused, size }) => (<Icon name='sign-in' type='font-awesome' size={size} color={focused ? '#rgba(251, 146, 60, 1)' : '#ccc'} />) }} />)
          : null
      }
      <MainNavigator.Screen name='HomeScreen' component={HomeNavigatorScreen}
        options={{
          title: 'Home', headerShown: false,
          drawerIcon: ({ focused, size }) => (<Icon name='fastfood' size={size} color={focused ? '#rgba(251, 146, 60, 1)' : '#ccc'} />)
        }} />
      <MainNavigator.Screen name='MenuScreen' component={MenuNavigatorScreen}
        options={{
          title: 'Menu', headerShown: false,
          drawerIcon: ({ focused, size }) => (<Icon name='restaurant-menu' size={size} color={focused ? '#rgba(251, 146, 60, 1)' : '#ccc'} />)
        }} />
      <MainNavigator.Screen name='FavoritesScreen' component={FavoritesNavigatorScreen}
        options={{
          title: 'My Favorites', headerShown: false,
          drawerIcon: ({ focused, size }) => (<Icon name='heart' type='font-awesome' size={size} color={focused ? '#rgba(251, 146, 60, 1)' : '#ccc'} />)
        }} />
      {
        users.logged === true
          ? (<MainNavigator.Screen name='ReservationScreen' component={ReservationNavigatorScreen} options={{ title: 'Reservation', headerShown: false, drawerIcon: ({ focused, size }) => (<Icon name='celebration' size={size} color={focused ? '#rgba(251, 146, 60, 1)' : '#ccc'} />) }} />)
          : null
      }
      <MainNavigator.Screen name='AddToCartScreen' component={AddToCartScreen}
        options={{
          title: 'My Cart', headerShown: false,
          drawerIcon: ({ focused, size }) => (<Icon name='coffee' type='font-awesome' size={size} color={focused ? '#rgba(251, 146, 60, 1)' : '#ccc'} />)
        }} />
      <MainNavigator.Screen name='ContactScreen' component={ContactNavigatorScreen}
        options={{
          title: 'Contact Us', headerShown: false,
          drawerIcon: ({ focused, size }) => (<Icon name='mail-outline' size={size} color={focused ? '#rgba(251, 146, 60, 1)' : '#ccc'} />)
        }} />
      <MainNavigator.Screen name='AboutScreen' component={AboutNavigatorScreen}
        options={{
          title: 'About Us', headerShown: false,
          drawerIcon: ({ focused, size }) => (<Icon name='supervised-user-circle' size={size} color={focused ? '#rgba(251, 146, 60, 1)' : '#ccc'} />)
        }} />
    </MainNavigator.Navigator>
  );
}
class GifScreen extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.navigate('HomeScreen');
    }, 4000);
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={{ uri: baseUrl + './images/delivery.gif' }} style={{ width: '100%', height: '50%' }} size="xlarge" />
        <Text style={{ color: 'rgba(251, 146, 60, 1)', fontWeight: 'bold', fontSize: 18, marginTop: 10 }}> You Have Successfully Login!</Text>
      </View>
    );
  }
}

// redux
const mapStateToProps = (state) => {
  return {
    users: state.users
  }
};
import { connect } from 'react-redux';
import { fetchLeaders, fetchDishes, fetchComments, fetchPromos, logoutUser } from '../redux/ActionCreators';
const mapDispatchToProps = (dispatch) => ({
  fetchLeaders: () => dispatch(fetchLeaders()),
  fetchDishes: () => dispatch(fetchDishes()),
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos()),
  logoutUser: () => dispatch(logoutUser())
});

import Favorites from './FavoriteComponent';
function FavoritesNavigatorScreen() {
  const FavoritesNavigator = createStackNavigator();
  return (
    <FavoritesNavigator.Navigator initialRouteName='Favorites'
      screenOptions={{
        headerStyle: { backgroundColor: '#rgba(251, 146, 60, 1)' },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff' }
      }}>
      <FavoritesNavigator.Screen name='Favorites' component={Favorites}
        options={({ navigation }) => ({
          headerTitle: 'My Favorites',
          headerLeft: () => (<Icon name='menu' size={36} color='#fff' onPress={() => navigation.toggleDrawer()} />)
        })} />
      <FavoritesNavigator.Screen name='Dishdetail' component={Dishdetail}
        options={{ headerTitle: 'Dish Detail' }} />
    </FavoritesNavigator.Navigator>
  );
}

import AddCart from './CartComponent';
function AddToCartScreen() {
  const AddCartNavigator = createStackNavigator();
  return (
    <AddCartNavigator.Navigator initialRouteName='AddCart'
      screenOptions={{
        headerStyle: { backgroundColor: 'rgba(251, 146, 60, 1)' },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff' }
      }}>
      <AddCartNavigator.Screen name='AddCart' component={AddCart}
        options={({ navigation }) => ({
          headerTitle: 'My Cart',
          headerLeft: () => (<Icon name='menu' size={36} color='#fff' onPress={() => navigation.toggleDrawer()} />)
        })} />
      <AddCartNavigator.Screen name='Dishdetail' component={Dishdetail}
        options={{ headerTitle: 'Dish Detail' }} />
    </AddCartNavigator.Navigator>
  );
}

class Main extends Component {
  render() {
    return (
      <NavigationContainer>
        <MainNavigatorScreen users={this.props.users} logoutUser={this.props.logoutUser} />
      </NavigationContainer>
    );
  }
  componentDidMount() {
    // redux
    this.props.fetchLeaders();
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
