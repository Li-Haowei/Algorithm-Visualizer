// import Board module from modules folder
import Board from './modules/board.js';
// import AI module from modules folder
import AI from './modules/ai.js';


//global variable to hold the game instance
var game;
var start = document.getElementById('draw-start');
var end = document.getElementById('draw-end');
var wall = document.getElementById('draw-wall');
var counter = 0; // to keep track of current count of total steps
var boardHeight = 160;
var boardWidth = 200;
//Run functions when document is ready
document.addEventListener("DOMContentLoaded", function() {
    //Create a new instance of the game
    game = new Game();
    document.getElementById("reset").addEventListener("click", function() {
       //when reset is pressed, reload the whole page
        location.reload();
        makeToast("Reset");
    });

    //add event listener to color options: wall-color, path-color, 1 to 3
    document.getElementById("wall-color-1").addEventListener("click", function() {
        makeToast("Wall Color: Blue");
        game.wallColor = 'blue';
    });
    document.getElementById("wall-color-2").addEventListener("click", function() {
        makeToast("Wall Color: Yellow");
        game.wallColor = 'yellow';
    });
    document.getElementById("wall-color-3").addEventListener("click", function() {
        makeToast("Wall Color: Purple");
        game.wallColor = 'purple';
    });
    document.getElementById("path-color-1").addEventListener("click", function() {
        makeToast("Path Color: Black");
        game.pathColor = 'black';
    });
    document.getElementById("path-color-2").addEventListener("click", function() {
        makeToast("Path Color: Orange");
        game.pathColor = 'orange';
    });
    document.getElementById("path-color-3").addEventListener("click", function() {
        makeToast("Path Color: Pink");
        game.pathColor = 'pink';
    });

    start = document.getElementById('draw-start');
    end = document.getElementById('draw-end');
    wall = document.getElementById('draw-wall');

    start.addEventListener('click', function() {
        end.checked = false;
        wall.checked = false;
        game.currentMode = 1;
        makeToast("draw start point with left click");
    });
    end.addEventListener('click', function(){
        start.checked = false;
        wall.checked = false;
        game.currentMode = 2;
        makeToast("draw end point with left click");
    });
    wall.addEventListener('click', function(){
        start.checked = false;
        end.checked = false;
        game.currentMode = 0;
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
            imageWidth = imageWidth/boardWidth;
            imageHeight = imageHeight/boardHeight;
            //scale down the image to 80*100 by its height and width
            var scaledResult = [];
            for (var i = 0; i < boardHeight; i++) {
                scaledResult.push([]);
                for (var j = 0; j < boardWidth; j++) {
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
            var scaledImgData = ctx.createImageData(boardWidth, boardHeight);
            for (var i = 0; i < scaledResult.length; i++) {
                for (var j = 0; j < scaledResult[i].length; j++) {
                    var index = (i * boardWidth + j) * 4;
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
            game.board = new Board(boardHeight, boardWidth, scaledResult);

        }

    }
    document.getElementById('file').addEventListener('change', handleFileSelect, false); 

    //get html slide bar and every time it changes, hightlight the walls of board
    document.getElementById("myRange").addEventListener("input", function() {
        game.board.setWallThreshold(this.value);
        game.board.highlightWalls();
    }
    );

});

//Create a game class
function Game() {
    //Create a new instance of the board
    this.board = new Board(boardHeight, boardWidth);
    //Create a new instance of the AI
    this.ai = new AI(this.board);
    this.currentMode = 0;
    this.wallColor = 'blue'
    this.pathColor = 'black'
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


export {game, end, makeToast}