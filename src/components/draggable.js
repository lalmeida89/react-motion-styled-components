import React from 'react';
import { Motion, spring } from 'react-motion';
import range from 'lodash.range';
import './draggable.css';
import { playersQB } from './playerLists/playerListQB';
import { playersRB } from './playerLists/playerListRB';
import { playersWR } from './playerLists/playerListWR';
import { playersTE } from './playerLists/playerListTE';
import { Button } from './button';

function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

const divStyle = {
  fontSize: '10px'
};

//sorts order of key values from highest to lowest
function sortByKey(array, key) {
  return array.sort(function(a, b) {
    var x = a[key];
    var y = b[key];
    return x > y ? -1 : x < y ? 1 : 0;
  });
}

//shuffles order of player names
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const springConfig = { stiffness: 300, damping: 50 };
const itemsCount = 5;

export default class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topDeltaY: 0,
      mouseY: 0,
      isPressed: false,
      originalPosOfLastPressed: 0,
      order: range(itemsCount),
      displayPlayers: [],
      playerScore: 0,
      gameIndex: 0,
      gameType: 'start game',
      question: '',
      timer: null,
      counter: 15,
      loading: false,
      message: '',
      gameContainer: null
    };
  }

  //the following handles all of the click and drag elements of the list
  componentDidMount() {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    let timer = setInterval(this.tick, 1000);
    this.setState({ timer });
  }

  componentWillUnmount() {
    this.clearInterval(this.state.timer);
  }

  tick = () => {
    if (this.state.counter == 0) {
      //console.log('something else as well')
      return this.timeUp();
    }
    this.setState({
      counter: this.state.counter - 1
    });
  };

  handleTouchStart = (key, pressLocation, e) => {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  };

  handleTouchMove = e => {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  };

  handleMouseDown = (pos, pressY, { pageY }) => {
    this.setState({
      topDeltaY: pageY - pressY,
      mouseY: pressY,
      isPressed: true,
      originalPosOfLastPressed: pos
    });
  };

  //test to change the order of arrays
  random = () => {
    //console.log('apple', this);
    //let shuffledPlayers = shuffle(playersQBYPC);
    this.setState({
      order: [4, 3, 2, 1, 0]
      //displayPlayers: shuffledPlayers
    });
  };

  setGame = (gameContainer, gameName) => {
    this.setState(
      {
        gameContainer: gameContainer,
        gameName: gameName
      },
      function() {
        this.qbGame();
      }
    );
  };

  qbGame = () => {
    let index = this.state.gameIndex;
    let gameContainer = this.state.gameContainer;
    //console.log(index);
    //console.log(playersQB[index].players);
    //console.log(playersQB[index].gameType);
    console.log(typeof gameContainer, gameContainer);
    let sortedPlayers = sortByKey(gameContainer[index].players);
    sortedPlayers.forEach((p, i) => {
      p['rank'] = i;
    });
    let shuffledPlayers = shuffle(gameContainer[index].players);
    ////console.log(sortedPlayers);
    this.setState(
      {
        gameType: gameContainer[index].gameType,
        question: gameContainer[index].question,
        displayPlayers: sortedPlayers,
        loading: false,
        counter: 15
      },
      function() {
        //console.log(this.state);
        setTimeout(() => {
          this.setState({
            order: shuffle(this.state.order)
          });
        }, 0);
      }
    );
  };

  //handles clicking and dragging of the list elements
  handleMouseMove = ({ pageY }) => {
    const {
      isPressed,
      topDeltaY,
      order,
      originalPosOfLastPressed
    } = this.state;

    if (isPressed) {
      const mouseY = pageY - topDeltaY;
      const currentRow = clamp(Math.round(mouseY / 100), 0, itemsCount - 1);
      let newOrder = order;

      if (currentRow !== order.indexOf(originalPosOfLastPressed)) {
        newOrder = reinsert(
          order,
          order.indexOf(originalPosOfLastPressed),
          currentRow
        );
        this.isCorrect(newOrder);
      }
      this.setState({ mouseY: mouseY, order: newOrder });
    }
  };

  //handle release of the mouse click
  handleMouseUp = () => {
    this.setState({ isPressed: false, topDeltaY: 0 });
  };

  timeUp = () => {
    let gameIndex = Number(this.state.gameIndex);
    gameIndex++;
    //console.log(this.state.counter);
    this.setState(
      {
        loading: true,
        message: 'you lost',
        gameIndex: gameIndex,
        counter: 15
      },
      function() {
        //console.log(this.state);
        setTimeout(() => {
          this.qbGame();
        }, 1000);
      }
    );
  };

  //checks user answers vs the correct answers
  isCorrect = newOrder => {
    //console.log(this.state.displayPlayers, newOrder);
    for (let i = 0; i < newOrder.length; i++) {
      if (this.state.displayPlayers[newOrder[i]].rank !== i) {
        //console.log('loser');
        return;
      }
    }
    //console.log('winner');
    let gameIndex = Number(this.state.gameIndex);
    gameIndex++;
    //console.log(typeof this.state.gameIndex);
    //console.log(gameIndex);
    this.setState(
      {
        gameIndex: gameIndex,
        loading: true,
        message: 'you are a winner',
        counter: 15
      },
      function() {
        //console.log(this.state);
        setTimeout(() => {
          this.qbGame();
        }, 1000);
      }
    );
  };

  render() {
    const { mouseY, isPressed, originalPosOfLastPressed, order } = this.state;
    let complete = true;

    /*const test = document.getElementById('test');
    const ypcGameStyle = document.getElementById('ypcGameStyle');

    ypcGameStyle.addEventListener("mouseover", function() {
      test.classList.add("gold");
    });

    ypcGameStyle.addEventListener("mouseout", function() {
      test.classList.remove("gold");
    });*/

    const loading = (
      <div>
        <div>{this.state.message}</div>Loading{'...'.substr(
          0,
          this.state.counter % 3 + 1
        )}
      </div>
    );

    return (
      <div id="test" className="demo8">
        {this.state.counter}
        <Button onClick={this.random}> click </Button>
        <Button
          className={this.state.gameName == 'playersQB' ? 'active' : 'inactive'}
          onClick={() => this.setGame(playersQB, 'playersQB')}>
          {' '}
          playersQB
        </Button>
        <Button onClick={() => this.setGame(playersWR, 'playersWR')}>
          {' '}
          playersWR
        </Button>
        {this.state.gameType}
        {this.state.question}
        {this.state.loading
          ? loading
          : this.state.displayPlayers.map((player, i) => {
              const style =
                originalPosOfLastPressed === i && isPressed
                  ? {
                      scale: spring(1.1, springConfig),
                      shadow: spring(16, springConfig),
                      y: mouseY
                    }
                  : {
                      scale: spring(1, springConfig),
                      shadow: spring(1, springConfig),
                      y: spring(order.indexOf(i) * 100, springConfig)
                    };
              return (
                <Motion style={style} key={i}>
                  {({ scale, shadow, y }) => (
                    <div
                      onMouseDown={this.handleMouseDown.bind(null, i, y)}
                      onTouchStart={this.handleTouchStart.bind(null, i, y)}
                      className={
                        order.indexOf(i) == player.rank
                          ? 'correct demo8-item '
                          : 'incorrect demo8-item'
                      }
                      style={{
                        boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 *
                          shadow}px 0px`,
                        transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                        WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                        zIndex: i === originalPosOfLastPressed ? 99 : i
                      }}>
                      {order.indexOf(i)}
                      {order.indexOf(i) == player.rank
                        ? 'correct'
                        : 'incorrect'}{' '}
                      :
                      {order.indexOf(i) == player.rank
                        ? null
                        : (complete = false)}
                      {player.displayName}
                    </div>
                  )}
                </Motion>
              );
            })}
      </div>
    );
  }
}
