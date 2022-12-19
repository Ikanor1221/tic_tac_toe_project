const Player = sign => {
    const returnSign = () => {
        return sign;
    }
    return {returnSign};
}

const GameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""]

    const addSign = (index, sign) => {
        if (board[index] === "") board[index] = sign;
    }

    const returnBoard = () => {
        return board;
    }

    return {addSign, returnBoard};
})()

const ScreenController = (() => {
    const cells = document.querySelectorAll(".cell");
    const display = document.querySelector("#display");
    const restartButton = document.querySelectorAll("#restart");

    let latestIndex = null;

    const updateDisplay = (sign) => {
        display.innerHTML = `Player ${sign}'s turn`
    }

    const updateDisplayWictory = (sign) => {
        display.innerHTML = `Player ${sign} won!<br />
        Press Restart to start again!`
    }
    const updateDisplayDraw = () => {
        display.innerHTML = `It's a draw!`
    }

    const listenForClick = () => {
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

    const returnLatestIndex = (sign) => {
        return latestIndex;
    }

    return {updateDisplay, listenForClick, returnLatestIndex, updateDisplayWictory, updateDisplayDraw};
})()

const GameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let currentPlayer = playerX;
    ScreenController.listenForClick();
    let wictory = false;

    const PlayRound = (index) => {
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
            ScreenController.updateDisplay(currentPlayer.returnSign());
            return
        }
    }

    const returnCurrentPlayer = () => {
        return currentPlayer;
    }

    const returnWictory = () => {
        return wictory;
    }


    const checkForWin = (sign) => {
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
        // console.log(condition)
        return condition;
    }

    const checkForDraw = () => {
        const board = GameBoard.returnBoard();
        for (const i in board) {
            if (!board[i]) return false;
        }
        return true
    }
 
    return {returnCurrentPlayer, PlayRound, checkForWin, checkForDraw, returnWictory};
})()