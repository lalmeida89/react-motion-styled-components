import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import counter from './counter';
import playersFetchReducer from './playersFetchReducer';

export default combineReducers({
  router: routerReducer,
  counter
});
