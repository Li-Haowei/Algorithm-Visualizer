//global variable to hold the game instance
var game;
var currentMode = 0;
var start = document.getElementById('draw-start');
var end = document.getElementById('draw-end');
var wall = document.getElementById('draw-wall');
console.log(start, end, wall);
//Run functions when document is ready
document.addEventListener("DOMContentLoaded", function() {
    //Create a new instance of the game
    game = new Game();
    document.getElementById("reset").addEventListener("click", function() {
        document.getElementById("board").innerHTML = "";
        game = new Game();
    });
    start = document.getElementById('draw-start');
    end = document.getElementById('draw-end');
    wall = document.getElementById('draw-wall');

    start.addEventListener('click', function() {
        end.checked = false;
        wall.checked = false;
        currentMode = 1;
    });
    end.addEventListener('click', function(){
        start.checked = false;
        wall.checked = false;
        currentMode = 2;
    });
    wall.addEventListener('click', function(){
        start.checked = false;
        end.checked = false;
        currentMode = 0;
    });    
});

//Create a game class
function Game() {
    //Create a new instance of the board
    this.board = new Board(80, 100);
    //Create a new instance of the AI
    this.ai = new AI();
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
                    if(e.buttons == 2 || e.buttons == 3){
                        var r = parseInt(e.target.id.split('-')[0]);
                        var c = parseInt(e.target.id.split('-')[1]);
                        switch (currentMode) {
                            case 0:
                                game.board.board[r][c] = 'O';
                                e.target.style.backgroundColor = "green";
                                break;
                            case 1:
                                game.board.board[r][c] = 'S';
                                e.target.style.backgroundColor = "red";
                                break;
                            case 2:
                                game.board.board[r][c] = 'E';
                                e.target.style.backgroundColor = "blue";
                                break;
                            default:
                                break;
                        }
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




