import React, { Component } from 'react';
import { Text } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import * as MailComposer from 'expo-mail-composer';
import { getDatabase, ref, child, onValue } from 'firebase/database';

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: '',
      street: '',
      district: '',
      city: '',
      phone: '',
      fax: '',
      email: ''
    }
  }
  render() {
    return (
      <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
        <Card>
          <Card.Title>Contact Information</Card.Title>
          <Card.Divider />
          <Text style={{ margin: 10 }}>121, Clear Water Bay Road</Text>
          <Text style={{ margin: 10 }}>Clear Water Bay, Kowloon</Text>
          <Text style={{ margin: 10 }}>HONG KONG</Text>
          <Text style={{ margin: 10 }}>Tel: +852 1234 5678</Text>
          <Text style={{ margin: 10 }}>Fax: +852 8765 4321</Text>
          <Text style={{ margin: 10 }}>Email: lhcorp@food.net</Text>
          <Button title=' Compose Email' buttonStyle={{ backgroundColor: 'rgba(251, 146, 60, 1)' }}
            icon={<Icon name='envelope-o' type='font-awesome' color='white' />}
            onPress={this.composeMail} />
        </Card>
      </Animatable.View >
    );
  }
  componentDidMount() {
    const dbRef = ref(getDatabase());
    onValue(child(dbRef, 'contact/'), (snapshot) => {
      const value = snapshot.val();
      this.setState({
        number: value.address.number,
        street: value.address.street,
        district: value.address.district,
        city: value.address.city,
        phone: value.phone,
        fax: value.fax,
        email: value.email
      });
    });
  }
}
export default Contact;