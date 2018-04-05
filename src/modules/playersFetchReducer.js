/*import {
  FETCH_PLAYERS_SUCCESS,
  FETCH_PLAYERS_REQUEST,
  FETCH_PLAYERS_ERROR
} from './fetchPlayers';

const initialState = {
  players: [],
  loading: false,
  error: null
};

export default (state = initialState, action) => {
  console.log(action);
  if (action.type === FETCH_PLAYERS_REQUEST) {
    return Object.assign({}, state, {
      loading: true,
      error: null
    });
  }
  if (action.type === FETCH_PLAYERS_SUCCESS) {
    console.log(state, action);
    return Object.assign({}, state, {
      players: action.players,
      loading: false
    });
  }
  if (action.type === FETCH_PLAYERS_ERROR) {
    console.log(state, action);
    return Object.assign({}, state, {
      loading: false,
      error: action.error
    });
  }
  return state;
};
*/
