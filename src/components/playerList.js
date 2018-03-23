import React from 'react';
import { connect } from 'react-redux';

import { fetchPlayers } from '../modules/fetchPlayers';

export class PlayerList extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchPlayers());
  }

  render() {
    if (this.props.loading) {
      return <div>Loading...</div>;
    } else if (this.props.error) {
      return <div>Error! {this.props.error}</div>;
    }

    const playerNames = this.props.playerNames.map((name, index) => (
      <li key={index}>{name}</li>
    ));
    return <ul>{playerNames}</ul>;
  }
}

export const mapStateToProps = (state, props) => ({
  playerNames: [],
  loading: state.loading,
  error: state.error
});

export default connect(mapStateToProps)(PlayerList);
