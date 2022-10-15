import {game, end, makeToast} from '../script.js';

//Create a board class
class Board {
    //constructor
    constructor(rows, columns, result=null) {
        //Initialize the board view
        this.rows = rows;
        this.columns = columns;
        this.board = [];
        this.initBoardView();
        this.start = false;
        this.end = false;
        this.scaledImgData = result;
        if (result == null) {
            this.initHtmlBoardView();
        }
        else {
            this.initHtmlBoardViewWithResult(result);
        }
        this.wallThreshold = 0;
    }
    //Initialize the board view
    initBoardView() {
        //Create a new instance of the board view
        for (let index = 0; index < this.rows; index++) {
           this.board.push(new Array(this.columns).fill(' '));
        }
    }

    //a function sets wall color
    
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
                    //console.log(e.buttons);
                    if(e.buttons == 2 || e.buttons == 3){
                        var r = parseInt(e.target.id.split('-')[0]);
                        var c = parseInt(e.target.id.split('-')[1]);
                        switch (game.currentMode) {
                            case 0:
                                game.board.board[r][c] = 'O';
                                e.target.style.backgroundColor = game.wallColor;
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
                    var start = document.getElementById('draw-start');
                    var end = document.getElementById('draw-end');
                    var wall = document.getElementById('draw-wall');
                        var r = parseInt(e.target.id.split('-')[0]);
                        var c = parseInt(e.target.id.split('-')[1]);
                        switch (game.currentMode) {
                            case 0:
                                break;
                            case 1:
                                if(!game.board.start){
                                    game.board.board[r][c] = 'S';
                                    e.target.style.backgroundColor = "green";
                                    game.board.start = true;

                                    if(!game.board.end){
                                        end.checked = true;
                                        game.currentMode = 2;
                                        makeToast("draw end point with left click");
                                    }else{
                                        wall.checked = true;
                                        game.currentMode = 0;
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
                                        game.currentMode = 2;
                                        makeToast("draw start point with left click");
                                    }else{
                                        wall.checked = true;
                                        game.currentMode = 0;
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

    //Initialize html board view with gray scaled image
    initHtmlBoardViewWithResult(result){
        //Create a new instance of the html board view
        var htmlBoard = document.getElementById("board");
        for (let rowNum = 0; rowNum < this.rows; rowNum++) {
            var row = document.createElement("tr");
            for (let colNum = 0; colNum < this.columns; colNum++) {
                var cell = document.createElement("td");
                cell.setAttribute("id", `${rowNum}-${colNum}`);
                cell.innerHTML = this.board[rowNum][colNum];
                cell.addEventListener("mouseover", function(e){
                    //console.log(e.buttons);
                    if(e.buttons == 2 || e.buttons == 3){
                        var r = parseInt(e.target.id.split('-')[0]);
                        var c = parseInt(e.target.id.split('-')[1]);
                        switch (game.currentMode) {
                            case 0:
                                game.board.board[r][c] = 'O';
                                e.target.style.backgroundColor = game.wallColor;
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
                        var start = document.getElementById('draw-start');
                        var end = document.getElementById('draw-end');
                        var wall = document.getElementById('draw-wall');
                        switch (game.currentMode) {
                            case 0:
                                break;
                            case 1:
                                if(!game.board.start){
                                    game.board.board[r][c] = 'S';
                                    e.target.style.backgroundColor = "green";
                                    game.board.start = true;

                                    if(!game.board.end){
                                        end.checked = true;
                                        game.currentMode = 2;
                                        makeToast("draw end point with left click");
                                    }else{
                                        wall.checked = true;
                                        game.currentMode = 0;
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
                                        game.currentMode = 2;
                                        makeToast("draw start point with left click");
                                    }else{
                                        wall.checked = true;
                                        game.currentMode = 0;
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

                //Set color of cell based on grayscale value
                var gray = result[rowNum][colNum];
                cell.style.backgroundColor = `rgb(${gray},${gray},${gray})`;
            }
            htmlBoard.appendChild(row);
        }
    }
    setWallThreshold(threshold){
        this.wallThreshold = threshold;
    }
    //Highlight the walls of the board based on gray scale image and slider value
    highlightWalls(){
        var htmlBoard = document.getElementById("board");
        for (let rowNum = 0; rowNum < this.rows; rowNum++) {
            for (let colNum = 0; colNum < this.columns; colNum++) {
                var cell = document.getElementById(`${rowNum}-${colNum}`);
                //get rgb value of corresponding scaledImgData
                var gray = this.scaledImgData[rowNum][colNum];
                if(gray < this.wallThreshold){
                    this.board[rowNum][colNum] = 'O';
                    cell.style.backgroundColor = game.wallColor;
                }else{
                    this.board[rowNum][colNum] = ' ';
                    var gray = this.scaledImgData[rowNum][colNum];
                    cell.style.backgroundColor = `rgb(${gray},${gray},${gray})`;
                }
            }
        }

    }

}


//export Board;

export default Board;