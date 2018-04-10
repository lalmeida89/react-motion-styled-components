import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchSentiment } from '../modules/counter';
import Autosugg from './autosuggest.js';
import Draggable from './draggable';
import { MainHeader } from './styleComponents/mainHeader';
//import PlayerList from './playerList';

import sentiment from 'sentiment';

const DynamicRender = props => {
  if (props.sentimentValue > 0) {
    return <p>Good to hear!</p>;
  } else {
    return <p>Sorry, I hope it gets better!</p>;
  }
};

const Home = props => (
  <div>
    <Draggable />
  </div>
);

const mapStateToProps = state => ({
  count: state.counter.count,
  isIncrementing: state.counter.isIncrementing,
  isDecrementing: state.counter.isDecrementing,
  sentimentValue: state.counter.sentimentValue
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ fetchSentiment }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
