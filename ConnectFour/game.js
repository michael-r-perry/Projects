/*
NOTES TO SELF:
Connect Four Board is 7 holes wide x 6 holes tall
*/
let canvas;
let context;
let board;
let turn = "r";
let gameWon = false;
let winPos;

function isEmpty(r, c) { return board[r][c] == "."; }

function checkVerFour(r, c) {
    let t = board[r][c];
    return board[r+1][c] == t && board[r+2][c] == t && board[r+3][c] == t;
}

function saveVerFour(r, c) {
    winPos = [[r,c], [r+1,c], [r+2,c], [r+3,c]]; 
}

function checkHorFour(r, c) {
    let t = board[r][c];
    return board[r][c+1] == t && board[r][c+2] == t && board[r][c+3] == t;
}

function saveHorFour(r, c) {
    winPos = [[r,c], [r,c+1], [r,c+2], [r,c+3]]; 
}

function checkNegFour(r, c) {
    let t = board[r][c];
    return board[r+1][c+1] == t && board[r+2][c+2] == t && board[r+3][c+3] == t;
}

function saveNegFour(r, c) {
    winPos = [[r,c], [r+1,c+1], [r+2,c+2], [r+3,c+3]]; 
}

function checkPosFour(r, c) {
    let t = board[r][c];
    return board[r-1][c+1] == t && board[r-2][c+2] == t && board[r-3][c+3] == t;
}

function savePosFour(r, c) {
    winPos = [[r,c], [r-1,c+1], [r-2,c+2], [r-3,c+3]]; 
}

function isGameOver() {
    for (r=0; r<6; r++) {
        for (c=0; c<7; c++) {
            if (!isEmpty(r,c)) {
                if (r < 3) {
                    if (checkVerFour(r,c)) { console.log("Won off of VerFour"); saveVerFour(r,c); gameWon = true; break; }
                }
                if (c < 4) {
                    if (checkHorFour(r,c)) { console.log("Won off of HorFour"); saveHorFour(r,c); gameWon = true; break; }
                    if (r < 3) {
                        if (checkNegFour(r,c)) { console.log("Won off of NegFour"); saveNegFour(r,c); gameWon = true; break; }
                    }
                    else {
                        if (checkPosFour(r,c)) { console.log("Won off of PosFour"); savePosFour(r,c); gameWon = true; break; }
                    }
                }
            }
        }
        if (gameWon) { break; }
    }
    return gameWon;
}

// Only use if isGameOver returns false
function isGameTied() {
    full = true;
    for (c=0; c<7; c++) {
        if (board[0][c] == ".") { full = false; break; }
    }
    return full;
}

function switchTurn() {
    console.log("Turn before:", turn);
    if (turn == "r") { turn = "y"; }
    else { turn = "r"; }
    console.log("Turn after:", turn);
}

// Usage: isColFull should be used before to confirm that column is not full
function dropInCol(c) { 
    for (r=1; r<6; r++) {
        if (board[r][c] != ".") {
            board[r-1][c] = turn;
            switchTurn();
            break;
        }
        if (r == 5) {
            board[r][c] = turn;
            switchTurn();
            break;
        }
    }
}

function isColFull(c) { return board[0][c] != "."; }

function popBoard() {
    board = []
    for (r=0; r<6; r++) {
        board[r] = []
        for (c=0; c<7; c++) {
            board[r][c] = ".";
        }
    }
}

function drawBorder(x, y, w, h, thickness = 1) {
    context.fillStyle = '#000000'
    context.fillRect(x - thickness, y - thickness, w + (thickness * 2), h + (thickness * 2));
}

function splat(n) {
    context.clearRect(0,0,canvas.width,canvas.height);

    // Display Connect Four Board
    context.fillStyle = "#0000FF";
    context.fillRect(100,100,560,480);
    for (r=0; r<6; r++) {
        for (c=0; c<7; c++) {
            key = board[r][c];
            if (key == ".") {
                context.fillStyle = "#FFFFFF";
            } else if (key == "y") {
                context.fillStyle = "#FFFF00";
            } else if (key == "r") {
                context.fillStyle = "#FF0000";
            }
            context.beginPath();
            context.arc(140 + c * 80, 140 + r * 80, 35, 0, 2 * Math.PI);
            context.fill();
        }
    }

    // Write Messages to Screen and Display After Winning Elements
    context.font = "28pt Calibri";
    context.fillStyle = "#000000";
    if (gameWon) {
        if (turn == "r") { context.fillText("Yellow Team has Won!", 10, 30); }
        else if (turn == "y") { context.fillText("Red Team has Won!", 10, 30); }
        else { context.fillText("Tie!", 10, 30); }
        // New Game Button
        drawBorder(10, 40, 200, 50);
        context.fillStyle = "grey";
        context.fillRect(10, 40, 200, 50);
        context.fillStyle = "black";
        context.fillText("New Game", 25, 75);
        // Highlight the Winning Four Positions if not a tie
        if (turn != "x") {
            context.lineWidth = 5;
            for (i=0; i<4; i++) {
                context.beginPath();
                context.arc(140 + winPos[i][1] * 80, 140 + winPos[i][0] * 80, 35, 0, 2 * Math.PI);
                context.stroke();
            }
        }
    }
    else {
        if (turn == "r") { context.fillText("Red Team's Turn!", 10, 30); }
        else { context.fillText("Yellow Team's Turn!", 10, 30); }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.querySelector("#myCanvas");
    console.log("Got here");
    context = canvas.getContext("2d");
    console.log(context);
    popBoard();
    console.log(board);
    splat();
})

document.addEventListener("click", e => {
    const [x,y] = [e.x,e.y];
    console.log("X, Y:", x, y);
    if (!gameWon) {
        if ((x >= 110 && x <= 670) && (y >= 10 && y <= 690)) {
            for (c=0; c<7; c++) {
                if (x >= 110 + 80*c && x < 190 + 80*c) {
                    console.log("Clicked Column: ", c);
                    if (!isColFull(c)) {
                        console.log("Column is not full");
                        dropInCol(c);
                    }
                }
            }
        }

        // Check if game has been won
        if (isGameOver()) { console.log("GAME WON!!!"); }
        else { 
            console.log("Game is still going..."); 
            if (isGameTied()) {
                turn = "x";
                gameWon = true;
            }
        }
    }
    else { // Check if they wanted to start a New Game
        if ( (x >= 20 && x <= 220) && (y >= 50 && y <= 100) ) {
            turn = "r";
            gameWon = false;
            popBoard();
        }
    }

    // Reprint the board
    splat();
})