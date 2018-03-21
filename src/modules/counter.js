//This is the reducer and the action put together. 'counter/INCREMENT_REQUESTED' seems to refer to this file and the action case.
import sentiment from 'sentiment';

export const INCREMENT_REQUESTED = 'counter/INCREMENT_REQUESTED';
export const INCREMENT = 'counter/INCREMENT';
export const DECREMENT_REQUESTED = 'counter/DECREMENT_REQUESTED';
export const DECREMENT = 'counter/DECREMENT';

const initialState = {
  count: 0,
  isIncrementing: false,
  isDecrementing: false,
  sentimentValue: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT_REQUESTED:
      return {
        ...state,
        isIncrementing: true
      };

    case INCREMENT:
      return {
        ...state,
        count: state.count + 1,
        isIncrementing: !state.isIncrementing
      };

    case DECREMENT_REQUESTED:
      return {
        ...state,
        isDecrementing: true
      };

    case DECREMENT:
      return {
        ...state,
        count: state.count - 1,
        isDecrementing: !state.isDecrementing
      };

    case 'SEND_SENTIMENT':
    console.log(action);
      return{
        ...state,
        sentimentValue: action.sent.score
      }

    default:
      return state;
  }
};

//The bellow are actions being called in asynch.

// export const fetchSentiment = (userInput) => {
export const fetchSentiment = (userInput) => {
  let sent = sentiment(userInput)
  console.log(sent);
  return dispatch => {
    dispatch({
      type: 'SEND_SENTIMENT',
      sent: sent
    });
  console.log(sent);
  };
};

export const incrementAsync = () => {
  return dispatch => {
    dispatch({
      type: INCREMENT_REQUESTED
    });

    return setTimeout(() => {
      dispatch({
        type: INCREMENT
      });
    }, 3000);
  };
};

export const decrement = () => {
  return dispatch => {
    dispatch({
      type: DECREMENT_REQUESTED
    });

    dispatch({
      type: DECREMENT
    });
  };
};

export const decrementAsync = () => {
  return dispatch => {
    dispatch({
      type: DECREMENT_REQUESTED
    });

    return setTimeout(() => {
      dispatch({
        type: DECREMENT
      });
    }, 3000);
  };
};
