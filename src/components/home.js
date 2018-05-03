import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchSentiment } from '../modules/counter';

import Draggable from './draggable';

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
