import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
	return (
		<button
			style={props.highlighted ? { backgroundColor: "yellow" } : {}}
			className="square"
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i, winningArray) {
		let highlighted = false;

		if (
			i === winningArray[0] ||
			i === winningArray[1] ||
			i === winningArray[2]
		) {
			highlighted = true;
		}

		return (
			<Square
				value={this.props.squares[i]}
				highlighted={highlighted}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		const winnerFunction = calculateWinner(this.props.squares);
		const winningArray = winnerFunction ? winnerFunction.winningArray : [];
		let rows = [...Array(3).keys()];
		return (
			<div>
				{rows.map((row) => (
					<div key={row} className="board-row">
						{[0, 3, 6].map((x) => (
							<span key={x}>
								{this.renderSquare(row + x, winningArray)}
							</span>
						))}
					</div>
				))}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
				},
			],
			stepNumber: 0,
			xIsNext: true,
			ascending: true,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([
				{
					squares: squares,
					player: squares[i],
					i,
				},
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0,
		});
	}

	toggleClick() {
		this.setState({
			ascending: !this.state.ascending,
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		const moves = history.map((step, move) => {
			const player = step.player;
			const coordinates = calculateCoordinates(step.i || 0);
			const desc = move
				? `Player: ${player}, col: ${coordinates.col}, row: ${coordinates.row}`
				: "Go to game start";
			return (
				<div key={move}>
					<li>
						<button
							style={{
								fontWeight:
									this.state.stepNumber === move
										? "bold"
										: "normal",
							}}
							onClick={() => this.jumpTo(move)}
						>
							{desc}
						</button>
					</li>
				</div>
			);
		});

		let status;
		if (winner) {
			status = "Winner: " + winner.winner;
		} else if (moves.length === 10) {
			status = "No winner";
		} else {
			status = "Next player: " + (this.state.xIsNext ? "X" : "O");
		}

		let { ascending } = this.state;

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
					{ascending ? (
						<ol>{moves}</ol>
					) : (
						<ol reversed>{moves.reverse()}</ol>
					)}
				</div>
				<div>
					<button onClick={() => this.toggleClick()}>
						{ascending ? "sort descending" : "sort ascending"}
					</button>
				</div>
			</div>
		);
	}
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateCoordinates(square) {
	const col = Math.floor(square / 3) + 1;
	const row = (square % 3) + 1;
	return { col, row };
}

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
		if (
			squares[a] &&
			squares[a] === squares[b] &&
			squares[a] === squares[c]
		) {
			return { winner: squares[a], winningArray: lines[i] };
		}
	}
	return null;
}
