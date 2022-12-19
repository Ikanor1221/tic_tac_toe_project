// Factory function for player creation
const Player = sign => {
    const returnSign = () => {
        return sign;
    }
    return {returnSign};
}

// Game bord object 
const GameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""]

    const addSign = (index, sign) => {
        if (board[index] === "") board[index] = sign;
    }

    const returnBoard = () => {
        return board;
    }

    const clearBoard = () => {
        for (const i in board) {
            board[i] = "";
        }
    }

    return {addSign, returnBoard, clearBoard};
})()

//Object for controlling the screen elements
const ScreenController = (() => {
    const cells = document.querySelectorAll(".cell");   //Cells of the board
    const display = document.querySelector("#display"); //Display for announcements
    const restartButton = document.querySelector("#restart");
    let latestIndex = null;

    const updateDisplayNext = (sign) => {
        display.innerHTML = `Player ${sign}'s turn`
    }

    const updateDisplayWictory = (sign) => {
        display.innerHTML = `Player ${sign} won!`
    }
    const updateDisplayDraw = () => {
        display.innerHTML = `It's a draw!`
    }

    const listenForClick = () => {  //Start listening for the clicks on the board cells and start the round on each click
        cells.forEach(cell => {
            cell.addEventListener("click", e => {
                latestIndex = cell.getAttribute("data-index");
                if (!cell.innerHTML & !GameController.returnWictory() & !GameController.checkForDraw()) {
                    cell.innerHTML = GameController.returnCurrentPlayer().returnSign();
                    GameController.PlayRound(latestIndex);
                }
            })
        })
    }

    const listenForRestart = () => {    //Start listening to reset button
        restartButton.addEventListener("click", e => {
            GameController.restart();
        })
    }

    const clearCells = () => {
        for (const i in cells) {
            cells[i].innerHTML = "";
        }
    }

    return {updateDisplayNext, listenForClick, updateDisplayWictory, updateDisplayDraw, listenForRestart, clearCells};
})()

//Object for controlling the game flow
const GameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let currentPlayer = playerX;    //Reference for the current player

    ScreenController.listenForClick();  //Start listening for the screen
    ScreenController.listenForRestart();

    let wictory = false;    //Status of the wictory of any of the players

    const PlayRound = (index) => {  //Play a round by first checking for wictory, draw and then adding the sign to selected empty cell
        GameBoard.addSign(index, currentPlayer.returnSign())
        if (checkForWin(currentPlayer.returnSign())) {
            ScreenController.updateDisplayWictory(currentPlayer.returnSign());
            wictory = true;
            return;
        } 
        else if (GameController.checkForDraw()) {
            ScreenController.updateDisplayDraw();
            return;
        }
        else {
            if (currentPlayer == playerX) currentPlayer = playerO;
            else currentPlayer = playerX;
            ScreenController.updateDisplayNext(currentPlayer.returnSign());
            return
        }
    }

    const returnCurrentPlayer = () => {
        return currentPlayer;
    }

    const returnWictory = () => {
        return wictory;
    }


    const checkForWin = (sign) => { //Check for certain patters which guarantee the wictory, manually written instead of an iteration due to small size
        let condition = false;
        const board = GameBoard.returnBoard();
        if (board[0]===sign & board[1]===sign & board[2]===sign) condition = true;
        if (board[3]===sign & board[4]===sign & board[5]===sign) condition = true;
        if (board[6]===sign & board[7]===sign & board[8]===sign) condition = true;
        
        if (board[0]===sign & board[3]===sign & board[6]===sign) condition = true;
        if (board[1]===sign & board[4]===sign & board[7]===sign) condition = true;
        if (board[2]===sign & board[5]===sign & board[8]===sign) condition = true;
        
        if (board[0]===sign & board[4]===sign & board[8]===sign) condition = true;
        if (board[2]===sign & board[4]===sign & board[6]===sign) condition = true;

        return condition;
    }

    const checkForDraw = () => {    //Check for draw- if all the cells are filled
        const board = GameBoard.returnBoard();
        for (const i in board) {
            if (!board[i]) return false;
        }
        return true
    }

    const restart = () => { //Restart the game by resetting all the parameters to defauls
        GameBoard.clearBoard();
        ScreenController.clearCells();
        currentPlayer = playerX;
        ScreenController.updateDisplayNext(currentPlayer.returnSign());
        wictory = false;
    }
 
    return {returnCurrentPlayer, PlayRound, checkForWin, checkForDraw, returnWictory, restart};
})()