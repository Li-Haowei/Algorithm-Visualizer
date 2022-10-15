import {game, end, makeToast} from '../script.js';

var counter = 0;
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
            cell.style.backgroundColor = game.pathColor;
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
                cell.style.backgroundColor =  game.pathColor;
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

export default AI;