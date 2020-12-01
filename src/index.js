import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        row: 0,
        col: 0
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  unboldGameInfoButtons() {
    const gameInfoElement = document.getElementsByClassName('game-info')[0];
    if (gameInfoElement === undefined) {
      return;
    }

    const buttons = gameInfoElement.getElementsByTagName('button');
    console.log('buttons.length: ' + buttons.length);
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].style.removeProperty('font-weight');
    }
  }

  jumpTo(step, event) {
    console.log('jumpto');
    this.unboldGameInfoButtons();
    event.target.style.fontWeight = 'bold';
    this.setState(
      {
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      }
    );
  }

  handleClick(i) {
    console.log('handleclick');
    const squares = this.state.history[this.state.stepNumber].squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const row = Math.floor(i / 3);
    const col = i % 3;
    this.setState({ history: this.state.history.slice(0, this.state.stepNumber + 1).concat([{squares: squares, row: row, col: col}]), 
                    xIsNext: !this.state.xIsNext,
                    stepNumber: this.state.stepNumber + 1 });
  }

  render() {
    console.log('render');
    const history = this.state.history;
    console.log(history.length);
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)
    console.log(history);
    this.unboldGameInfoButtons();
    const moves = history.map((step, move) => {
      console.log('inside map');
      const desc = move ?
        'Go to move #' + move + ': (' + step.row + ', ' + step.col + ')' :
        'Go to game start';

      const buttonStyle = (move === history.length - 1) ? {style: {fontWeight: 'bold'}} : {};

      return (
        <li key={move}>
          <button {...buttonStyle} onClick={(e) => this.jumpTo(move, e)}>
            {desc}
          </button>
        </li>
      )
    });
    console.log(moves);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}