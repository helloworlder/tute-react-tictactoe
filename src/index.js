import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Exercises:
// (x) Display the location for each move in the format (col, row) in the move history list.
// (x) Bold the currently selected item in the move list.
// (x) Rewrite Board to use two loops to make the squares instead of hardcoding them (2 loops eh?)
// (x) Add a toggle button that lets you sort the moves in either ascending or descending order.
// (x) When someone wins, highlight the three squares that caused the win.
// (x) When no one wins, display a message about the result being a draw.

function Square(props) {

    let myStyle = 'square';
    if(props.highlight) {
        myStyle = 'square-highlight';
    }

    return (
        <button className={myStyle} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i, highlightSquare) {
        return (
            <Square
                highlight={highlightSquare}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {

        const itemsInRows = [];
        let ctr = 0;
        for (let i = 0; i < 3; i++) {
            const items = [];
            for (let j = 0; j < 3; j++) {

                let highlightSquare = false;
                if(this.props.winningSquares) {
                    this.props.winningSquares.forEach((ele, idx) => {
                        if(ele == ctr) {
                            items.push(this.renderSquare(ctr, true));
                            highlightSquare = true;
                        }
                    });
                }

                if(!highlightSquare) {
                    items.push(this.renderSquare(ctr, false));
                }

                ctr++;
            }
            itemsInRows.push(<div className="board-row">{items}</div>);
        }

        return (
            <div>
                {itemsInRows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            isAsc: true,
            stepNumber: 0,
            xIsNext: true
        };
    }

    toggleSort() {
        this.setState({
            isAsc: !this.state.isAsc
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        const mapping = ['0,0', '1,0', '2,0', '0,1', '1,1', '2,1', '0,3', '1,3', '2,3'];
        const location = mapping[i];
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: location
            }]),
            moves: [],
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let moves = history.map((step, move) => {
            const bold = (this.state.stepNumber === move) ? true : false;
            const classStyle = bold ? 'bold' : '';
            const location = step.location;
            const desc = move ?
                'Go to move #' + move + `(${location})` :
                'Go to game start';
            return (
                <li key={move}>
                    <button className={classStyle} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        if (!this.state.isAsc) {
            moves.reverse();
        }

        let status;
        if (winner) {
            status = 'Winner: ' + winner.player;
        } else if(this.state.stepNumber !== 9) {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        } else {
            status = 'Draw';
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winningSquares={winner ? winner.squares : false}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    <button onClick={() => this.toggleSort()}>
                        Toggle Sort
                    </button>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
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
            return {
                player: squares[a],
                squares: [a, b, c]
            }
        }
    }
    return null;
}