import React from 'react';
import { spring } from 'react-motion';
import 'font-awesome/css/font-awesome.min.css';
import range from 'lodash.range';
import './draggable.css';
import './slider.css';
import './animation.css';
import { playersQB } from './playerLists/playerListQB';
import { playersRB } from './playerLists/playerListRB';
import { playersWR } from './playerLists/playerListWR';
import { playersTE } from './playerLists/playerListTE';
import { Button } from './styleComponents/button';
import { Rotate } from './styleComponents/loading';
import { Timer } from './styleComponents/timerStyle';
import { StyleMotion } from './styleComponents/styleMotion';

function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

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
      counter: null,
      loading: false,
      message: '',
      gameContainer: null,
      gameOver: false,
      resultGif: '',
      grade: '',
      difficulty: 'Easy',
      showStats: false
    };
  }

  //the following handles all of the click and drag elements of the list
  componentDidMount() {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
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
      originalPosOfLastPressed: pos
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
    let timer = setInterval(this.tick, 1000);
    this.setState(
      {
        gameContainer: gameContainer,
        gameName: gameName,
        timer
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
    let sortedPlayers = sortByKey(gameContainer[index].players);
    sortedPlayers.forEach((p, i) => {
      p['rank'] = i;
    });
    let shuffledPlayers = shuffle(gameContainer[index].players);
    this.setState({
      gameType: gameContainer[index].gameType,
      question: gameContainer[index].question,
      displayPlayers: sortedPlayers,
      loading: false,
      counter: 5,
      showStats: false
    });
  };

  //handles moving on to the next question once the timer runs out
  timeUp = () => {
    let gameIndex = Number(this.state.gameIndex);
    let timer = setInterval(this.tick, 1000);
    gameIndex++;
    let score = 0;
    for (let i = 0; i < this.state.displayPlayers.length; i++) {
      if (this.state.displayPlayers[this.state.order[i]].rank === i) {
        score += 10;
      }
    }
    if (gameIndex === this.state.gameContainer.length) {
      this.setState({
        gameOver: true,
        playerScore: (this.state.playerScore += score)
      });
      this.checkScore();
      window.clearInterval(this.state.timer);
      return;
    }
    this.setState(
      {
        loading: true,
        gameIndex: gameIndex,
        counter: null,
        playerScore: (this.state.playerScore += score),
        showStats: false
      },
      function() {
        setTimeout(() => {
          this.qbGame();
          this.setState({ timer });
        }, 1000);
      }
    );
  };

  revealStats = () => {
    window.clearInterval(this.state.timer);
    this.setState(
      {
        showStats: true,
        isPressed: false,
        counter: null
      },
      function() {
        setTimeout(() => {
          this.timeUp();
        }, 3000);
      }
    );
  };

  //handles the ticks of the timer. once it hits 0, run the timeUp function, otherwise
  //keep ticking the timer down one
  tick = () => {
    if (this.state.counter === 0) {
      return this.revealStats();
    }
    this.setState({
      counter: this.state.counter - 1
    });
  };

  setDifficulty = () => {
    if (this.state.difficulty === 'Hard') {
      this.setState({
        difficulty: 'Easy'
      });
    } else {
      this.setState({
        difficulty: 'Hard'
      });
    }
  };

  checkScore = () => {
    let score = this.state.playerScore;
    let container = this.state.gameContainer.length;
    let grade = score / container;
    if (grade <= 5) {
      this.setState({
        grade: 'F',
        message:
          "You probably came last in your league. Hope the punishment wasn't too bad.",
        resultGif:
          'https://uproxx.files.wordpress.com/2014/11/buttfumble-2.gif?w=650'
      });
    } else if (grade > 5 && grade <= 12) {
      this.setState({
        grade: 'C',
        message:
          "Really below average. Hope that doesn't translate to your personal life.",
        resultGif: 'https://i.gifer.com/1DMt.gif'
      });
    } else if (grade > 12 && grade <= 16) {
      this.setState({
        grade: 'C+',
        message: 'You really dropped the ball on this one. Get it together!!',
        resultGif: 'https://media.giphy.com/media/3o7WIPe6fIhuQ4UKyc/giphy.gif'
      });
    } else if (grade > 16 && grade <= 21) {
      this.setState({
        grade: 'B-',
        message:
          "This isn't the worst result I've ever seen. It's not very good either",
        resultGif: 'https://i.imgur.com/KueuxdZ.gif'
      });
    } else if (grade > 21 && grade <= 28) {
      this.setState({
        grade: 'B',
        message:
          "Not too shabby, my friend. Give it another shot, maybe it won't be so mediocre",
        resultGif:
          'https://uproxx.files.wordpress.com/2015/09/brownsfumble1.gif?w=650&h=366'
      });
    } else if (grade > 28 && grade <= 32) {
      this.setState({
        grade: 'B+',
        message:
          "You probably made the playoffs and got knocked out in the first round. There's always next year",
        resultGif:
          'https://s-media-cache-ak0.pinimg.com/originals/da/fb/37/dafb37eda8b99019fb2302c64488f703.gif'
      });
    } else if (grade > 32 && grade <= 38) {
      this.setState({
        grade: 'A',
        message:
          "You probably came in second place last year. But you know what they say, If you ain't first, you're last",
        resultGif:
          'https://thecrossoverreport.files.wordpress.com/2017/06/gronkdance2_original_original.gif'
      });
    } else if (grade > 38 && grade <= 50) {
      this.setState({
        grade: 'A+',
        message:
          'You definitely won it all last year, great job!! You are a deserving champion, my friend',
        resultGif: 'https://media.giphy.com/media/26xBsTS9WJ7THk4mI/giphy.gif'
      });
    }
  };

  render() {
    const { mouseY, isPressed, originalPosOfLastPressed, order } = this.state;

    const loading = (
      <div className="loading">
        <div>Current Score : {this.state.playerScore}</div>
        Loading{'...'.substr(0, this.state.counter % 3 + 1)}
        <Rotate>
          <img
            style={{ width: '100px' }}
            src="https://cdn.bleacherreport.net/images/team_logos/328x328/football.png"
            alt="spinning football"
          />
        </Rotate>
      </div>
    );

    if (this.state.gameOver) {
      return (
        <div className="resultsPage" id="slide">
          <h1 className="gradeHeader"> Your Grade </h1>
          <h3 className="resultMessage">
            You got {this.state.playerScore / 10} out of{' '}
            {this.state.gameContainer.length * 5} right
          </h3>
          <div className="finalGrade"> {this.state.grade} </div>
          <h3 className="resultMessage"> {this.state.message} </h3>
          <img
            className="resultGif"
            src={this.state.resultGif}
            alt="resultGif"
          />

          <Button reload onClick={() => window.location.reload()}>
            {' '}
            Try Again{' '}
          </Button>
        </div>
      );
    }

    return (
      <div id="test" className={this.state.showStats ? 'fade demo8' : 'demo8'}>
        <Timer
          className={
            this.state.gameName || !this.state.loading
              ? 'digitalClock'
              : 'inactive '
          }>
          {this.state.counter}
        </Timer>
        <div className={this.state.gameName == null ? 'active' : 'inactive'}>
          <h1 className="intro">Fantasy Ranks 2017</h1>
          <h3 className="gameDescription">
            {' '}
            Time to see how well you did in your league last year. To start the
            game, select the category you think you know best. Once the game
            starts, simply drag and drog the players and rearrange them in order
            of the question asked. Simple as that. Now get started!{' '}
          </h3>
          <Button
            qb
            className={
              this.state.gameName === 'playersQB' ? 'active' : 'inactive'
            }
            onClick={() => this.setGame(playersQB, 'playersQB')}>
            {' '}
            QBs
          </Button>

          <Button
            wr
            className={
              this.state.gameName === 'playersWR' ? 'active' : 'inactive'
            }
            onClick={() => this.setGame(playersWR, 'playersWR')}>
            {' '}
            WRs
          </Button>

          <Button
            rb
            className={
              this.state.gameName === 'playersRB' ? 'active' : 'inactive'
            }
            onClick={() => this.setGame(playersRB, 'playersRB')}>
            {' '}
            RBs
          </Button>

          <Button
            te
            className={
              this.state.gameName === 'playersTE' ? 'active' : 'inactive'
            }
            onClick={() => this.setGame(playersTE, 'playersTE')}>
            {' '}
            TEs
          </Button>

          <label className="switch">
            <div className="easyLeft"> Easy </div>
            <input
              type="checkbox"
              value="easy"
              onClick={() => this.setDifficulty()}
            />
            <span className="slider round" />
            <div className="hardRight"> Hard </div>
          </label>
        </div>

        <h1 className={this.state.loading ? 'inactive' : 'questionHeader'}>
          {this.state.question}{' '}
        </h1>

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
                        this.state.difficulty === 'Hard'
                          ? 'demo8-item listAnimation'
                          : order.indexOf(i) === player.rank
                            ? 'correct demo8-item listAnimation'
                            : 'incorrect demo8-item listAnimation'
                      }
                      style={{
                        background: `url(${player.img}) no-repeat `,
                        opacity: `1`,
                        margin: `0 0 auto auto`,
                        backgroundPosition: `10% 10%`,
                        boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 *
                          shadow}px 0px`,
                        transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                        WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                        zIndex: i === originalPosOfLastPressed ? 99 : i
                      }}>
                      <h2 className="playerNames">{player.displayName} </h2>
                      <h2
                        className={
                          order.indexOf(i) === player.rank
                            ? 'correctStat alignRight'
                            : 'wrongStat alignRight'
                        }>
                        {this.state.showStats === true
                          ? player.stat + ' ' + this.state.gameType
                          : ''}
                      </h2>
                      <h2
                        className={
                          !this.state.showStats
                            ? 'inactive'
                            : order.indexOf(i) === player.rank
                              ? 'scoreAnimate'
                              : 'wrong'
                        }>
                        {' '}
                        +
                        {order.indexOf(i) === player.rank ? 10 : 0}{' '}
                      </h2>
                    </div>
                  )}
                </StyleMotion>
              );
            })}
      </div>
    );
  }
}
