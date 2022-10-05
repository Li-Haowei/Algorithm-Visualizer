//Run functions when document is ready
document.addEventListener("DOMContentLoaded", function() {
    //Create a new instance of the game
    var game = new Game();
});

//Create a game class
function Game() {
    //Create a new instance of the board
    this.board = new Board(80, 100);
    //Create a new instance of the AI
    this.ai = new AI();
    //Create a new instance of the game controller
    this.gameController = new GameController();
}

//Create a board class
class Board {
    //constructor
    constructor(rows, columns){
        //Initialize the board view
        this.rows = rows;
        this.columns = columns;
        this.board = [];
        this.initBoardView();
        this.initHtmlBoardView();
    }
    //Initialize the board view
    initBoardView() {
        //Create a new instance of the board view
        for (let index = 0; index < this.rows; index++) {
           this.board.push(new Array(this.columns).fill(' '));
        }
    }
    //Initialize html board view
    initHtmlBoardView(){
        //Create a new instance of the html board view
        var htmlBoard = document.getElementById("board");
        for (let rowNum = 0; rowNum < this.rows; rowNum++) {
            var row = document.createElement("tr");
            for (let colNum = 0; colNum < this.columns; colNum++) {
                var cell = document.createElement("td");
                cell.setAttribute("id", `${rowNum}-${colNum}`);
                cell.innerHTML = this.board[rowNum][colNum];
                cell.addEventListener("mouseover", function(e){
                    if(e.buttons == 1 || e.buttons == 3){
                        e.target.style.backgroundColor = "green";
                    }
                    return false;
                });
                row.appendChild(cell);
            }
            htmlBoard.appendChild(row);
        }
    }
}

//Create a AI class
function AI() {
    
}

//Create a game controller class
class GameController {
    constructor(){
        this.currentMode = this.whichMode();
    }
    whichMode() {
        if(document.getElementById('draw-wall').checked) {
            return 0;
        }else if(document.getElementById('draw-start').checked) {
            return 1;
        }else if(document.getElementById('draw-end').checked) {
            return 2;
        }
    }

}


