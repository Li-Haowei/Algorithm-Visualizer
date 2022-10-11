//global variable to hold the game instance
var game;

var currentMode = 0; //use to indicate the mouse click event mode
var start = document.getElementById('draw-start');
var end = document.getElementById('draw-end');
var wall = document.getElementById('draw-wall');
var counter = 0; // to keep track of current count of total steps
//Run functions when document is ready
document.addEventListener("DOMContentLoaded", function() {
    //Create a new instance of the game
    game = new Game();
    document.getElementById("reset").addEventListener("click", function() {
        document.getElementById("board").innerHTML = "";
        game = new Game();
        start.disabled = false;
        end.disabled = false;
        counter = 0;
        makeToast("Reset");
    });
    start = document.getElementById('draw-start');
    end = document.getElementById('draw-end');
    wall = document.getElementById('draw-wall');

    start.addEventListener('click', function() {
        end.checked = false;
        wall.checked = false;
        currentMode = 1;
        makeToast("draw start point with left click");
    });
    end.addEventListener('click', function(){
        start.checked = false;
        wall.checked = false;
        currentMode = 2;
        makeToast("draw end point with left click");
    });
    wall.addEventListener('click', function(){
        start.checked = false;
        end.checked = false;
        currentMode = 0;
        makeToast("draw wall with dragging right click");
    });    
    document.getElementById("greedy-algorithm").addEventListener("click", function() {
        this.ai = new AI(game.board, "greedy");
    });
    document.getElementById("super-greedy-algorithm").addEventListener("click", function() {
        this.ai = new AI(game.board, "super-greedy");
    });
    document.getElementById("dijkstra").addEventListener("click", function() {
        this.ai = new AI(game.board, "dijkstra");
    });

    //get image uploaded from html
    function handleFileSelect(evt) {
        //remove all the previous elements
        document.getElementById('image-container').innerHTML = "";
        document.getElementById('grayscaled-image-container').innerHTML = "";
        document.getElementById('scaled-image-container').innerHTML = "";
        //get image uploaded from html and display in image-container
        var files = evt.target.files; // FileList object
        var f = files[0];
        var reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                var span = document.createElement('span');
                span.innerHTML = ['<img class="thumb" src="', e.target.result,
                    '" title="', escape(theFile.name), '"/>'
                ].join('');
                document.getElementById('image-container').insertBefore(span, null);
            };
        }
        )(f);
        reader.readAsDataURL(f);
        //get image data and turn into 3d array
        var img = new Image();
        img.src = URL.createObjectURL(f);
        img.onload = function() {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            var width = canvas.width;
            var height = canvas.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);
            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var data = imgData.data;
            
            
            var arr = [];
            for (var i = 0; i < data.length; i += 4) {
                arr.push([data[i], data[i + 1], data[i + 2]]);
            }
            var width = canvas.width;
            var height = canvas.height;
            var result = [];
            for (var i = 0; i < height; i++) {
                var start = i * width;
                var end = start + width;
                result.push(arr.slice(start, end));
            }
            //get image dimensions
            var imageWidth = result[0].length;
            var imageHeight = result.length;
            imageWidth = imageWidth/100;
            imageHeight = imageHeight/80;
            //scale down the image to 80*100 by its height and width
            var scaledResult = [];
            for (var i = 0; i < 80; i++) {
                scaledResult.push([]);
                for (var j = 0; j < 100; j++) {
                    scaledResult[i].push(result[Math.floor(i * imageHeight)][Math.floor(j * imageWidth)]);
                }
            }
            
            //gray scale the image
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < result[i].length; j++) {
                    var gray = Math.round((result[i][j][0] + result[i][j][1] + result[i][j][2]) / 3);
                    result[i][j] = gray;
                }
            }
            //turn 3d array image back to image
            var imgData = ctx.createImageData(width, height);
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < result[i].length; j++) {
                    var index = (i * width + j) * 4;
                    imgData.data[index + 0] = result[i][j];
                    imgData.data[index + 1] = result[i][j];
                    imgData.data[index + 2] = result[i][j];
                    imgData.data[index + 3] = 255;
                }
            }
            ctx.putImageData(imgData, 0, 0);
            //display the image in html
            var img = new Image();
            img.src = canvas.toDataURL();
            document.getElementById('grayscaled-image-container').appendChild(img);
            
            //clear ctx
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //gray scale the image
            for (var i = 0; i < scaledResult.length; i++) {
                for (var j = 0; j < scaledResult[i].length; j++) {
                    var gray = Math.round((scaledResult[i][j][0] + scaledResult[i][j][1] + scaledResult[i][j][2]) / 3);
                    scaledResult[i][j] = gray;
                }
            }
            //turn scaled 3d array image back to image
            var scaledImgData = ctx.createImageData(100, 80);
            for (var i = 0; i < scaledResult.length; i++) {
                for (var j = 0; j < scaledResult[i].length; j++) {
                    var index = (i * 100 + j) * 4;
                    scaledImgData.data[index + 0] = scaledResult[i][j];
                    scaledImgData.data[index + 1] = scaledResult[i][j];
                    scaledImgData.data[index + 2] = scaledResult[i][j];
                    scaledImgData.data[index + 3] = 255;
                }
            }
            ctx.putImageData(scaledImgData, 0, 0);
            //display the image in html
            var img = new Image();
            img.src = canvas.toDataURL();
            document.getElementById('scaled-image-container').appendChild(img);

            //remove current board
            document.getElementById('board').innerHTML = "";
            //create a new board with the image
            game.board = new Board(80, 100, scaledResult);

        }

    }
    document.getElementById('file').addEventListener('change', handleFileSelect, false); 


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
    constructor(rows, columns, result=null) {
        //Initialize the board view
        this.rows = rows;
        this.columns = columns;
        this.board = [];
        this.initBoardView();
        this.start = false;
        this.end = false;
        if (result == null) {
            this.initHtmlBoardView();
        }
        else {
            this.initHtmlBoardViewWithResult(result);
        }
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
                    //console.log(e.buttons);
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
                                        makeToast("draw end point with left click");
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
                                        makeToast("draw start point with left click");
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
                                        makeToast("draw end point with left click");
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
                                        makeToast("draw start point with left click");
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

                //Set color of cell based on grayscale value
                var gray = result[rowNum][colNum];
                cell.style.backgroundColor = `rgb(${gray},${gray},${gray})`;
            }
            htmlBoard.appendChild(row);
        }
    }

}

//Create a AI class
class AI{
    //constructor
    constructor(board, algorithm){
        //Initialize the AI
        this.approach = 0;
        this.board = board;
        this.visited = new Set([]);
        this.path = [];
        this.found = false;
        this.previousPoint = 10000000000;
        this.algorithm = algorithm;
        this.findPath(algorithm);
    }
    async findPath(algorithm){
        if(this.board.start && this.board.end){
            var rowOfStart = this.board.board.findIndex(row => row.includes('S'));
            var colOfStart = this.board.board[rowOfStart].findIndex(col => col == 'S');
            this.visited.add(`${rowOfStart}-${colOfStart}`);
            this.path.push(`${rowOfStart}-${colOfStart}`);
            var rowOfEnd = this.board.board.findIndex(row => row.includes('E'));
            var colOfEnd = this.board.board[rowOfEnd].findIndex(col => col == 'E');    
            //Greedy algorithm
            if(algorithm == "greedy"){
                this.greedy_algorithm(rowOfStart, colOfStart, rowOfEnd, colOfEnd);
            }else if (algorithm == "super-greedy"){
                for (let index = 0; index < 4; index++) {
                    this.greedy_algorithm(rowOfStart, colOfStart, rowOfEnd, colOfEnd);
                }
            }
            if(algorithm == "dijkstra"){
                await this.dijkstra(rowOfStart, colOfStart, rowOfEnd, colOfEnd);
            }
        }
    
    }
    updateNeighbors(row, col){
        var neighbors = [];
        if(row<this.board.rows-1){
            //If haven't visited
            if(!this.visited.has(`${row+1}-${col}`)){
                neighbors.push([row+1, col]);
                //Mark as visited
                //this.visited.add(`${row+1}-${col}`);
            }
        }
        if(row>1){
            //If haven't visited
            if(!this.visited.has(`${row-1}-${col}`)){
                neighbors.push([row-1, col]);
                //Mark as visited
                //this.visited.add(`${row-1}-${col}`);
            }
        }
        if (col<this.board.columns-1) {
            //If haven't visited
            if(!this.visited.has(`${row}-${col+1}`)){
                neighbors.push([row, col+1]);
                //Mark as visited
                //this.visited.add(`${row}-${col+1}`);
            }
        }
        if (col>1) {
            //If haven't visited
            if(!this.visited.has(`${row}-${col-1}`)){
                neighbors.push([row, col-1]);
                //Mark as visited
                //this.visited.add(`${row}-${col-1}`);
            }
        }
        //console.log(neighbors);
        return neighbors;
    }

    async greedy_algorithm(rowOfStart, colOfStart, rowOfEnd, colOfEnd){
        var possiblePaths = this.updateNeighbors(rowOfStart, colOfStart);
        /*Calculate the distance between the start point and the end point*/
        var distance1 = Math.sqrt(Math.pow(rowOfStart-rowOfEnd, 2) + Math.pow(colOfStart-colOfEnd, 2));
        var optimalPath = 10000000000;
        for (let i = 0; i < possiblePaths.length; i++) {
            const move = possiblePaths[i];
            /*Calculate the distance between the current move and the end point*/
            var distance2 = Math.sqrt(Math.pow(move[0]-rowOfEnd, 2) + Math.pow(move[1]-colOfEnd, 2));
            if(distance2 < optimalPath && this.board.board[move[0]][move[1]] != 'O' && this.board.board[move[0]][move[1]] != 'S' && this.board.board[move[0]][move[1]] != 'E' && this.board.board[move[0]][move[1]] != 'X'){
                //find better path
                if(distance2 < optimalPath){
                    optimalPath = distance2;
                    rowOfStart = move[0];
                    colOfStart = move[1];
                }
            }
            if(this.board.board[move[0]][move[1]] == 'O'){
                console.log("hit wall");
                this.visited.add(`${rowOfStart}-${colOfStart}`);
            }
            if (this.board.board[move[0]][move[1]] == 'E') {
                console.log("Found the end");
                this.found = true;
                return;
            }
                
        }
        /*If previous distance between point to end is shorter, means the algorithm has been going back*/
        if(optimalPath != 10000000000){
            this.previousPoint = optimalPath;
            this.board.board[rowOfStart][colOfStart] = 'X';
            /*Update the board view*/
            var cell = document.getElementById(`${rowOfStart}-${colOfStart}`);
            /*Mark as visited*/
            this.path.push(`${rowOfStart}-${colOfStart}`);
            //this.visited.add(`${rowOfStart}-${colOfStart}`);
            cell.style.backgroundColor = "black";
            incrementCounter();
            await sleep(100);
            this.greedy_algorithm(rowOfStart, colOfStart, rowOfEnd, colOfEnd);
            return
        }
        if(!this.found && this.path.length > 0){
            var lastMove = this.path.pop();
            //console.log(lastMove);
            decrementCounter();
            this.visited.add(`${rowOfStart}-${colOfStart}`);
            var row = parseInt(lastMove.split('-')[0]);
            var col = parseInt(lastMove.split('-')[1]);
            this.greedy_algorithm(row, col, rowOfEnd, colOfEnd);
        }

    }
    async dijkstra(rowOfStart, colOfStart, rowOfEnd, colOfEnd){
        if(this.found){
            return true;
        }
        var possiblePaths = this.updateNeighbors(rowOfStart, colOfStart);
        for (let i = 0; i < possiblePaths.length; i++) {
            const move = possiblePaths[i];
            if(this.board.board[move[0]][move[1]] == 'O'){
                console.log("hit wall");
                this.visited.add(`${move[0]}-${move[1]}`);
            }
            if (this.board.board[move[0]][move[1]] == 'E') {
                console.log("Found the end");
                this.found = true;
                return true;
            }
            if(!this.visited.has(`${move[0]}-${move[1]}`)){
                this.board.board[move[0]][move[1]] = 'X';
                /*Update the board view*/
                var cell = document.getElementById(`${move[0]}-${move[1]}`);
                /*Mark as visited*/
                this.path.push(`${move[0]}-${move[1]}`);
                this.visited.add(`${move[0]}-${move[1]}`);
                cell.style.backgroundColor = "black";
                incrementCounter();
                await sleep(100);
                this.dijkstra(move[0], move[1], rowOfEnd, colOfEnd);
            }
        }
        if(!this.found && this.path.length > 0){
            var lastMove = this.path.pop();
            this.visited.add(`${rowOfStart}-${colOfStart}`);
            var row = parseInt(lastMove.split('-')[0]);
            var col = parseInt(lastMove.split('-')[1]);
            await sleep(100);
            this.dijkstra(row, col, rowOfEnd, colOfEnd);
        }
    }
    drawPath(path){
        //draw path
        console.log('called ', path.length);
        console.log(path)
        for (let i = 0; i < path.length; i++) {
            const move = path[i];
            console.log(i);
            var cell = document.getElementById(`${move}`);
            cell.style.backgroundColor = "red";
        }
    }
    
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function incrementCounter(){
    counter++;
    document.getElementById("counter").innerHTML = counter;
}
function decrementCounter(){
    counter--;
    document.getElementById("counter").innerHTML = counter;
}

function makeToast(text){
    const toast = document.getElementById('toast');
    toast.innerText = text;
    toast.className = "show";
    toast.style.visibility = 'visible';

    setTimeout(()=>{
        toast.className = toast.className.replace('show','')
        toast.style.visibility = 'hidden';
    }, 3000);
}


