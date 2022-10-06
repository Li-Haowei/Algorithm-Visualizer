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
    document.getElementById("start").addEventListener("click", function() {
        this.ai = new AI(game.board);
    });
});

//Create a game class
function Game() {
    //Create a new instance of the board
    this.board = new Board(80, 100);
    //Create a new instance of the AI
    this.ai = new AI(this.board);
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
        this.start = false;
        this.end = false;
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
                                e.target.style.backgroundColor = "blue";
                                break;
                            case 1:
                                break;
                            case 2:
                                break;
                            default:
                                break;
                        }
                    }
                    return false;
                });
                cell.addEventListener("click", function(e){
                        var r = parseInt(e.target.id.split('-')[0]);
                        var c = parseInt(e.target.id.split('-')[1]);
                        switch (currentMode) {
                            case 0:
                                break;
                            case 1:
                                if(!game.board.start){
                                    game.board.board[r][c] = 'S';
                                    e.target.style.backgroundColor = "green";
                                    game.board.start = true;

                                    if(!game.board.end){
                                        end.checked = true;
                                        currentMode = 2;
                                    }else{
                                        wall.checked = true;
                                        currentMode = 0;
                                    }
                                    start.checked = false;
                                    start.disabled = true;
                                }
                                break;
                            case 2:
                                if(!game.board.end){
                                    game.board.board[r][c] = 'E';
                                    e.target.style.backgroundColor = "red";
                                    game.board.end = true;
                                    if(!game.board.start){
                                        start.checked = true;
                                        currentMode = 2;
                                    }else{
                                        wall.checked = true;
                                        currentMode = 0;
                                    }
                                    end.checked = false;
                                    end.disabled = true;
                                }
                                break;
                            default:
                                break;
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
class AI{
    //constructor
    constructor(board){
        //Initialize the AI
        this.approach = 0;
        this.board = board;
        this.brutalForce();
    }
    brutalForce(){
        //Brutal force approach
        if(this.board.start && this.board.end){
            var rowOfStart = this.board.board.findIndex(row => row.includes('S'));
            var colOfStart = this.board.board[rowOfStart].findIndex(col => col == 'S');
            this.brutalForceHelper(rowOfStart, colOfStart);
            //var rowOfEnd = this.board.board.findIndex(row => row.includes('E'));
            //var colOfEnd = this.board.board[rowOfEnd].findIndex(col => col == 'E');    
        }
    
    }
    brutalForceHelper(row, col){
        if(row == this.board.rows || col == this.board.columns || row < 0 || col < 0){
            return;
        }
        if(this.board.board[row][col] == 'S'){
            
        }
        else if(this.board.board[row][col] == 'E'){
            console.log('found');
            return;
        }
        else if(this.board.board[row][col] == 'O'){
            return;
        }
        else {
            this.board.board[row][col] = 'X';
            document.getElementById(`${row}-${col}`).style.backgroundColor = "yellow";
        }
        if (row-1 >= 0 && col-1 >= 0) {
            this.brutalForceHelper(row-1, col-1);
        }
        if (row + 1  <= this.board.rows - 1 && col + 1 <= this.board.columns - 1) {
            this.brutalForceHelper(row+1, col+1);
        }
        if (row - 1 >= 0 && col + 1 <= this.board.columns - 1) {
            this.brutalForceHelper(row-1, col+1);
        }
        if (row + 1 <= this.board.rows - 1 && col - 1 >= 0) {
            this.brutalForceHelper(row+1, col-1);
        }
        if (row - 1 >= 0) {
            this.brutalForceHelper(row-1, col);
        }
        if (row + 1 <= this.board.rows - 1) {
            this.brutalForceHelper(row+1, col);
        }
        if (col - 1 >= 0) {
            this.brutalForceHelper(row, col-1);
        }
        if (col + 1 <= this.board.columns - 1) {
            console.log('right');
            this.brutalForceHelper(row, col+1);
        }
        return;
    }
    
}



