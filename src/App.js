import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [board, setBoard] = useState([
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ]);
    const [currentPlayer, setCurrentPlayer] = useState('X');

    useEffect(() => {
        fetch('http://localhost:3001/board')
            .then(response => response.json())
            .then(data => setBoard(data.board));
    }, []);

    const makeMove = (row, col) => {
        if (board[row][col] === ' ') {
            const updatedBoard = [...board];
            updatedBoard[row][col] = currentPlayer;
            setBoard(updatedBoard);

            fetch('http://localhost:3001/move', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    row,
                    col,
                    player: currentPlayer
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.win) {
                        alert(`Player ${currentPlayer} wins!`);
                        resetBoard();
                    } else if (data.draw) {
                        alert("It's a draw!");
                        resetBoard();
                    } else {
                        setCurrentPlayer(data.currentPlayer);
                    }
                })
                .catch(error => console.error(error));
        }
    };

    const resetBoard = () => {
        fetch('http://localhost:3001/reset', {
            method: 'POST'
        })
            .then(response => response.json())
            .then(data => setBoard(data.board))
            .catch(error => console.error(error));
    };

    return (
        <div className="App">
            <h1>Tic Tac Toe</h1>
            <div className="board">
                {board.map((row, rowIndex) => (
                    <div className="row" key={rowIndex}>
                        {row.map((cell, colIndex) => (
                            <div
                                className="cell"
                                key={colIndex}
                                onClick={() => makeMove(rowIndex, colIndex)}
                            >
                                {cell}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <button onClick={resetBoard}>Reset</button>
        </div>
    );
}

export default App;
