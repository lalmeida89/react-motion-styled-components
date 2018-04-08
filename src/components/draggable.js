import React from 'react';
import { Motion, spring } from 'react-motion';
import 'font-awesome/css/font-awesome.min.css';
import range from 'lodash.range';
import './draggable.css';
import { playersQB } from './playerLists/playerListQB';
import { playersRB } from './playerLists/playerListRB';
import { playersWR } from './playerLists/playerListWR';
import { playersTE } from './playerLists/playerListTE';
import { PlayerImages } from './playerLists/playerImages';
import { Button } from './button';
import { Rotate } from './styleComponents/loading';
import { Timer } from './styleComponents/timerStyle';
import { QuestionHeader } from './styleComponents/questionHeader';
import { StyleMotion } from './styleComponents/styleMotion';

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
      gameType: '',
      question: '',
      timer: null,
      counter: 15,
      loading: false,
      message: '',
      gameContainer: null,
      backgroundImage: null
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
      originalPosOfLastPressed: pos,
      backgroundImage: PlayerImages[1].AaronRodgers
    });
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
    this.setState({
      isPressed: false,
      topDeltaY: 0,
      backgroundImage: 'white'
    });
  };

  //test to change the order of arrays
  random = () => {
    this.setState({
      order: [4, 3, 2, 1, 0]
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

  //handles the qb game. index moves from one question to the next, gameContainer is
  //the type of game (qb, wr, te, or rb). sortedPlayers ranks from highest to lowest
  //based on each players value. the setTimeout shuffles up the playerList the seconds
  //the players are loaded to give a little animation.
  qbGame = () => {
    let index = this.state.gameIndex;
    let gameContainer = this.state.gameContainer;
    console.log(typeof gameContainer, gameContainer);
    console.log(gameContainer[index].players[1].img);
    let sortedPlayers = sortByKey(gameContainer[index].players);
    sortedPlayers.forEach((p, i) => {
      p['rank'] = i;
    });
    let shuffledPlayers = shuffle(gameContainer[index].players);
    this.setState(
      {
        gameType: gameContainer[index].gameType,
        question: gameContainer[index].question,
        displayPlayers: sortedPlayers,
        loading: false,
        counter: 5
      },
      function() {
        setTimeout(() => {
          this.setState({
            order: shuffle(this.state.order)
          });
        }, 0);
      }
    );
  };

  //handles the ticks of the timer. once it hits 0, run the timeUp function, otherwise
  //keep ticking the timer down one
  tick = () => {
    if (this.state.counter == 0) {
      return this.timeUp();
    }
    this.setState({
      counter: this.state.counter - 1
    });
  };

  setBackgroundImage = backgroundImage => {
    this.setState({
      backgroundImage: this.state.backgroundImage
    });
  };

  /*checkScore = () => {
    if (order.indexOf(i) == player.rank) {
      this.state.playerScore ++;
      console.log(this.state.playerScore)
    }
  }*/

  //handles moving on to the next question once the timer runs out
  timeUp = () => {
    let gameIndex = Number(this.state.gameIndex);
    gameIndex++;
    this.setState(
      {
        loading: true,
        message: 'you lost',
        gameIndex: gameIndex,
        counter: 15,
        backgroundImage: 'white'
      },
      function() {
        setTimeout(() => {
          this.qbGame();
        }, 1000);
      }
    );
  };

  //checks user answers vs the correct answers
  isCorrect = newOrder => {
    for (let i = 0; i < newOrder.length; i++) {
      if (this.state.displayPlayers[newOrder[i]].rank !== i) {
        return;
      }
    }
    let gameIndex = Number(this.state.gameIndex);
    gameIndex++;
    this.setState(
      {
        gameIndex: gameIndex,
        loading: true,
        message: 'you are a winner',
        counter: 15,
        playerScore: this.state.playerScore
      },
      function() {
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
      <div className="loading">
        <div>{this.state.message}</div>
        Loading{'...'.substr(0, this.state.counter % 3 + 1)}
        <Rotate>
          <img
            style={{ width: '100px' }}
            src="https://cdn.bleacherreport.net/images/team_logos/328x328/football.png"
          />
        </Rotate>
      </div>
    );

    return (
      <div
        style={{ backgroundImage: `url(${this.state.backgroundImage})` }}
        id="test"
        className="demo8">
        <Timer>{this.state.counter}</Timer>
        <div className={this.state.gameName == null ? 'active' : 'inactive'}>
          <Button
            className={
              this.state.gameName == 'playersQB' ? 'active' : 'inactive'
            }
            onClick={() => this.setGame(playersQB, 'playersQB')}>
            {' '}
            playersQB
          </Button>
          <Button
            className={
              this.state.gameName == 'playersWR' ? 'active' : 'inactive'
            }
            onClick={() => this.setGame(playersWR, 'playersWR')}>
            {' '}
            playersWR
          </Button>
        </div>

        <QuestionHeader> {this.state.question} </QuestionHeader>

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
                <StyleMotion style={style} key={i}>
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
                        background: `url(${player.img}) no-repeat `,
                        margin: `0 0 auto auto`,
                        backgroundPosition: `10% 10%`,
                        boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 *
                          shadow}px 0px`,
                        transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                        WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                        zIndex: i === originalPosOfLastPressed ? 99 : i
                      }}>
                      {/*}{order.indexOf(i)}
                      {order.indexOf(i) == player.rank
                        ? 'correct'
                        : 'incorrect'}{' '}
                      :
                      {order.indexOf(i) == player.rank
                        ? null
                        : (complete = false)}*/}
                      {player.displayName}
                    </div>
                  )}
                </StyleMotion>
              );
            })}
      </div>
    );
  }
}
