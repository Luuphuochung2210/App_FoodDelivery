import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { leaders } from '../redux/leaders';
import { dishes } from '../redux/dishes';
import { comments } from '../redux/comments';
import { promotions } from '../redux/promotions';
import { favorites } from '../redux/favorites';
import { users } from './users';
import { carts } from './Cart';

// redux-persist
import { persistStore, persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = { key: 'root', storage: AsyncStorage, debug: true };
export const ConfigureStore = () => {
  ``
  const store = createStore(
    persistCombineReducers(config, { leaders, dishes, comments, promotions, favorites, users, carts }),
    applyMiddleware(thunk, logger)
  );
  const persistor = persistStore(store);
  return { persistor, store };
};