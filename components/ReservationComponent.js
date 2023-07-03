import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Switch, Modal, Alert } from 'react-native';
import { Icon, Button, Image, Card } from 'react-native-elements';
// import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import * as Animatable from 'react-native-animatable';
import * as Notifications from 'expo-notifications';
import * as Calendar from 'expo-calendar';
import { baseUrl } from '../shared/baseUrl';
import RNPickerSelect from "react-native-picker-select";


class ModalContent extends Component {
  render() {
    return (
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>Your Reservation</Text>
        <Text style={styles.modalText}>Number of Guests: {this.props.guests}</Text>
        <Text style={styles.modalText}>Smoking?: {this.props.smoking ? 'Yes' : 'No'}</Text>
        <Text style={styles.modalText}>Date and Time: {format(this.props.date, 'dd/MM/yyyy - HH:mm')}</Text>
        <Button title='Close' color='#7cc' onPress={() => this.props.onPressClose()} />
      </View>
    );
  }
}

class Reservation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guests: 1,
      smoking: false,
      date: new Date(),
      location: "",
      showDatePicker: false,
      showModal: false
    }
  }
  render() {
    return (
      <Animatable.View animation="slideInLeft" duration={1000}>
        <Image source={{ uri: baseUrl + './images/hostparty.jpg' }}
          style={{ width: '100%', height: 160 }}>
        </Image>
        <Card.Title style={{ fontSize: 20, textAlign: 'center', fontWeight: '500', margin: 10, fontStyle: 'italic' }}> Book A Table Now for some Party
          <Icon name='celebration'></Icon>
        </Card.Title>
        <Card.Divider />
        <ScrollView>
          <Card>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Number of Guests : </Text>
              <RNPickerSelect
                style={styles.formItem}
                value={this.state.guests}
                onValueChange={(value) => this.setState({ guests: value })}
                placeholder={{
                  label: 'Number of guest...',
                  value: null,
                }}
                items={[
                  { label: '1', value: '1' },
                  { label: '2', value: '2' },
                  { label: '3', value: '3' },
                  { label: '4', value: '4' },
                  { label: '5', value: '5' },
                  { label: '6', value: '6' },
                ]}
              />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Location : </Text>
              <RNPickerSelect
                style={styles.formItem}
                value={this.state.location}
                onValueChange={(value) => this.setState({ location: value })}
                placeholder={{
                  label: 'Choose Location...',
                  value: null,
                }}
                items={[
                  { value: 'District 1', label: 'District 1' },
                  { value: 'District 5', label: 'District 5' },
                  { value: 'District 8', label: 'District 8' },
                  { value: 'District 12', label: 'District 12' },
                ]}
              />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Smoking / No-Smoking</Text>
              <Switch style={styles.formItem} value={this.state.smoking} onValueChange={(value) => this.setState({ smoking: value })} />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Date and Time :</Text>
              <Icon name='schedule' size={36} onPress={() => this.setState({ showDatePicker: true })} />
              <Text style={{ marginLeft: 10 }}>{format(this.state.date, 'dd/MM/yyyy - HH:mm')}</Text>
              <DateTimePickerModal mode='datetime' isVisible={this.state.showDatePicker}
                onConfirm={(date) => this.setState({ date: date, showDatePicker: false })}
                onCancel={() => this.setState({ showDatePicker: false })} />
            </View>
            <View style={styles.formRow}>
              <Button title='Reserve' mt="2" onPress={() => this.handleReservation()} color="rgba(251, 146, 60, 1)" buttonStyle={{ backgroundColor: 'rgba(251, 146, 60, 1)' }}
              >Reservation</Button>
            </View>
          </Card>
        </ScrollView>
      </Animatable.View >
    );
  }
  handleReservation() {
    Alert.alert(
      'Confirm Your reservation',
      'Number of guests: ' + this.state.guests + '\n' +
      'Location: ' + this.state.location + '\n' +
      'Smoking: ' + this.state.smoking + '\n' +
      'Date and time: ' + this.state.date,
      [
        { text: 'Cancel', onPress: () => this.resetFromReservation() },
        {
          text: 'OK', onPress: () => {
            this.addReservationToCalendar(this.state.date);
            this.presentLocalNotification(this.state.date);
            this.resetFromReservation();
          }
        },
      ],
    )
  }
  async presentLocalNotification(date) {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true })
      });
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Your Reservation',
          body: 'Reservation for ' + date + ' requested',
          sound: true,
          vibrate: true
        },
        trigger: null
      });
    }
  }

  async addReservationToCalendar(date) {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      const defaultCalendarSource = { isLocalAccount: true, name: 'Expo Calendar' };
      const newCalendarID = await Calendar.createCalendarAsync({
        title: 'Expo Calendar',
        color: 'blue',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: 'internalCalendarName',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
      const eventId = await Calendar.createEventAsync(newCalendarID, {
        title: 'Confusion Table Reservation',
        startDate: date,
        endDate: new Date(date.getTime() + 2 * 60 * 60 * 1000),
        timeZone: 'Asia/Hong_Kong',
      });
      alert('Your new event ID is: ' + eventId);
    }
  }

  resetFromReservation() {
    this.setState({
      guests: 1,
      smoking: false,
      date: new Date(),
      location: ''
    })
  }
}
export default Reservation;

const styles = StyleSheet.create({
  formRow: { alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'row', margin: 25 },
  formLabel: { fontSize: 18, flex: 3 },
  formItem: { flex: 1 },
  modal: { justifyContent: 'center', margin: 20 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', backgroundColor: '#7cc', textAlign: 'center', color: 'white', marginBottom: 20 },
  modalText: { fontSize: 18, margin: 10 }
});