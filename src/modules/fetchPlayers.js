export const FETCH_PLAYERS_REQUEST = 'FETCH_Players_REQUEST';
export const fetchPlayersRequest = () => ({
  type: FETCH_PLAYERS_REQUEST
});

export const FETCH_PLAYERS_SUCCESS = 'FETCH_Players_SUCCESS';
export const fetchPlayersSuccess = Players => ({
  type: FETCH_PLAYERS_SUCCESS,
  Players
});

export const FETCH_PLAYERS_ERROR = 'FETCH_Players_ERROR';
export const fetchPlayersError = error => ({
  type: FETCH_PLAYERS_ERROR,
  error
});

export const fetchPlayers = () => {
  return dispatch => {
    let url =
      'https://www.fantasyfootballnerd.com/service/players/json/d4dhbjjcn5rp/QB/';
    fetch(url, {
      method: 'GET'
    })
      .then(res => res.json())
      .catch(error => {
        console.log('error', error);
        dispatch(fetchPlayersError(error));
      })
      .then(response => {
        console.log('Success', response);
        dispatch(fetchPlayersSuccess(response));
      });
  };
};
