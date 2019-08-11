// Variables globals
let canvas, context, WIDTH, HEIGHT, fps, tileSize, playing;
let snake, playlabel;
let globalTouch = [], offset = [];

let keys = {
  left : 37,
  up : 38,
  right : 39,
  down : 40
}

window.addEventListener('resize', resizeWindow);
window.addEventListener('keydown', keyDown);

window.addEventListener('touchstart', touchStart);
window.addEventListener('touchmove', touchMove);
window.addEventListener('touchend', touchEnd);

function resizeWindow() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  tileSize = Math.max(Math.floor(WIDTH / 30), Math.floor(HEIGHT / 30));
}

// Keyboard
function keyDown(event) {
  if(!playing && (
    event.keyCode == keys.left || 
    event.keyCode == keys.up ||
    event.keyCode == keys.right ||
    event.keyCode == keys.down
    )) {
    playing = true;
  }
  switch (event.keyCode) {
    case keys.left:
      snake.direction = [-1,0];
      break;

    case keys.up:
      snake.direction = [0,-1];
      break;

    case keys.right:
      snake.direction = [1,0];
      break;

    case keys.down: 
      snake.direction = [0,1];
  }
}

// Screens
function touchStart(event) {
  event.preventDefault();
  let touch = event.touches[0];
  globalTouch = [touch.pageX, touch.pageY];
}
function touchMove(event) {
   let touch = event.touches[0];
   offset = [touch.pageX - globalTouch[0], touch.pageY - globalTouch[1]];
}
function touchEnd(event) {
  if (Math.abs(offset[0] > offset[1])) {
    snake.direction = [offset[0] / Math.abs(offset[0]), 0];
  } else {
    snake.direction = [0, offset[1] / Math.abs(offset[1])];
  }
}

// Regular Expressions
function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

function init() {
  canvas = document.createElement('canvas');
  resizeWindow();
  document.body.appendChild(canvas);
  context = canvas.getContext('2d');
  fps = 15;
  newGame();
  run();
}

// Restart
function newGame() {
  snake = new Snake(); //Class instance
  playlabel = new PlayLabel(); //Class instance
  playing = false;
}

// Análoga á uma Class
function PlayLabel() {
  this.text;
  this.color = 'pink';

  this.messages = {
    landscape: "Drag the screen to play",
    portrait: "Rotate your device so you can play",
    pc: "Press any directional key to play"
  };

  if(isMobileDevice()) {
    
  } else {
    this.text = this.messages.pc;
  }
  this.drawPlayLabel = function() {
    context.fillStyle = this.color;
    context.font = tileSize * 2 + "px Arial";
    context.fillText(this.text, WIDTH / 2 - context.measureText(this.text).width / 2, HEIGHT / 2);

  }
}

// Análoga á uma Class
function Snake() {
  // Atributes
  this.body = [[10,10], [10,11], [10,12]];
  this.color = "gray";
  this.direction = [0, -1];
  
  // Methods
  this.update = ()=> {
    let nextPosition = [
      this.body[0][0] + this.direction[0], 
      this.body[0][1] + this.direction[1]
    ];

    //S tandby
    if(!playing) {

      if (this.direction[1] == -1 && nextPosition[1] <= (HEIGHT * 0.1 / tileSize)) { 
        this.direction = [1, 0]; // right
      }
      else if (this.direction[0] == 1 && nextPosition[0] >= (WIDTH * 0.9 / tileSize)) { 
        this.direction = [0, 1]; // down
      }
      else if (this.direction[1] == 1 && nextPosition[1] >= (HEIGHT * 0.9 / tileSize)) { 
        this.direction = [-1, 0]; // lefth
      }
      else if (this.direction[0] == -1 && nextPosition[0] <= (WIDTH * 0.1 / tileSize)) { 
        this.direction = [0, -1]; // top
      }
    }
    // Resolver to Bug
    if (nextPosition[0] == this.body[1][0] && nextPosition[1] == this.body[1][1]){
      this.body.reverse();
      nextPosition = [
        this.body[0][0] + this.direction[0], 
        this.body[0][1] + this.direction[1]
      ];
    }
    this.body.pop();
    this.body.splice(0, 0, nextPosition);
  } 

  this.drawSnaker = ()=> {
    context.fillStyle = this.color;
    for ( let i = 0; i < this.body.length; i++) { 
      context.fillRect(
        this.body[i][0] * tileSize, 
        this.body[i][1] * tileSize, 
        tileSize -1, tileSize -1
        );
    }
  }
}

function update() {
  snake.update();  // update belongs to Class Snake
}

function draw() {
  context.clearRect(0, 0 , WIDTH, HEIGHT);
  snake.drawSnaker();  // draw belongs to Class Snake
  if(!playing) {
    playlabel.drawPlayLabel(); // draw belongs to Class PlayLabel
  }
}

// Game Loop
function run() {
  update();
  draw();
    setTimeout(run, 1000 / fps);
}

init();