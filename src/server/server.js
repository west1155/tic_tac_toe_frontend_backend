const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
];
let currentPlayer = 'X';

function checkWin(player) {
    // Check rows
    for (let row = 0; row < 3; row++) {
        if (
            board[row][0] === player &&
            board[row][1] === player &&
            board[row][2] === player
        ) {
            return true;
        }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
        if (
            board[0][col] === player &&
            board[1][col] === player &&
            board[2][col] === player
        ) {
            return true;
        }
    }

    // Check diagonals
    if (
        (board[0][0] === player &&
            board[1][1] === player &&
            board[2][2] === player) ||
        (board[0][2] === player &&
            board[1][1] === player &&
            board[2][0] === player)
    ) {
        return true;
    }

    return false;
}

app.get('/board', (req, res) => {
    res.json({ board });
});

app.post('/move', (req, res) => {
    const { row, col, player } = req.body;

    if (board[row][col] === ' ') {
        board[row][col] = player;

        if (checkWin(player)) {
            res.json({ win: true });
        } else if (
            board.flat().every(cell => cell !== ' ') // Check for draw
        ) {
            res.json({ draw: true });
        } else {
            currentPlayer = player === 'X' ? 'O' : 'X';
            res.json({ currentPlayer });
        }
    } else {
        res.status(400).json({ error: 'Invalid move' });
    }
});

app.post('/reset', (req, res) => {
    board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];
    currentPlayer = 'X';
    res.json({ board });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
