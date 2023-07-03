import React, { Component } from 'react';
import Main from './components/MainComponent';
// redux
import { Provider } from 'react-redux';
import { NativeBaseProvider } from 'native-base';
import { ConfigureStore } from './redux/ConfigureStore';
// redux-persist
import { PersistGate } from 'redux-persist/es/integration/react';
const { persistor, store } = ConfigureStore();

// firebase
import { initializeApp } from 'firebase/app';
const firebaseConfig = { databaseURL: 'https://mobile-project-9d98e-default-rtdb.asia-southeast1.firebasedatabase.app' };
initializeApp(firebaseConfig);
class App extends Component {
  render() {
    return (
      <NativeBaseProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <Main />
          </PersistGate>
        </Provider>
      </NativeBaseProvider>
    );
  }
}
export default App;