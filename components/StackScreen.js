import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import { StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { baseUrl } from '../shared/baseUrl';

const GifStack = createStackNavigator();

class GifScreen extends Component {
    componentDidMount() {
        setTimeout(() => {
            this.props.navigation.dispatch(StackActions.replace('HomeScreen'));
        }, 3000);
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Avatar source={{ uri: baseUrl + './images/delivery.gif' }} style={{ width: '100%', height: '50%' }} size="xlarge" />
                <Text style={{ color: 'rgba(251, 146, 60, 1)', fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>You Have Successfully Logged In!</Text>
            </View>
        );
    }
}

function GifStackScreen() {
    return (
        <GifStack.Navigator headerMode="none">
            <GifStack.Screen name="GifScreen" component={GifScreen} />
        </GifStack.Navigator>
    );
}

export default GifStackScreen;
