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

var FFNerd = require('fantasy-football-nerd');
var ff = new FFNerd({ api_key: 'd4dhbjjcn5rp' });

ff.teams(function(teams) {
  console.log('Got teams', teams);
});

export const fetchPlayers = () => {
  return dispatch => {
    let url =
      'https://www.fantasyfootballnerd.com/service/nfl-teams/json/test/';
    fetch(url, {
      method: 'GET'
    })
      .then(res => res.text())
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
