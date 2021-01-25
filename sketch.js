var cols = 50;
var rows = 50;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var w, h;
var path = [];

function removeFromArray(arr, elt){
  for(let i = arr.length-1; i>=0; i--){
    if(arr[i] === elt){
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b){
  //euclidean ditance
  var d = dist(a.i, a.j, b.i, b.j);
  //manhattan distance
  //var d = abs(a.i-b.i) + abs(a.j-b.j);
  return d;
} 

function Spot(i, j){
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  if(random(1) < 0.4){
    this.wall = true;
  }
  
  this.addNeighbors = function(grid){

    var i  = this.i;
    var j = this.j;

    //adding diagonal neighbors
    if(i > 0 && j > 0){
      this.neighbors.push(grid[i-1][j-1]);
    }
    if(i < cols-1 && j > 0){
      this.neighbors.push(grid[i+1][j-1]);
    }
    if(i > 0 && j < rows-1){
      this.neighbors.push(grid[i-1][j+1]);
    }
    if(i < cols-1 && j < rows-1){
      this.neighbors.push(grid[i+1][j+1]);
    }
    //immediate neighbors
    if(i < cols-1){
      this.neighbors.push(grid[i+1][j]);
    }
    if(i > 0){
      this.neighbors.push(grid[i-1][j]);
    }
    if(j < rows-1){
      this.neighbors.push(grid[i][j+1]);
    }
    if(j > 0){
      this.neighbors.push(grid[i][j-1]);
    }
  }
  this.show = function(col){
    fill(col); 
    if(this.wall){
      fill(0);
      noStroke();
      ellipse(this.i*w+w/2, this.j*h +h/2, w/2, h/2);
    }
    //rect(this.i*w, this.j*h, w-1, h-1);
  }
}

function setup() {
  
  createCanvas(600, 600);
  console.log('A*');
  
  w = width/cols;
  h = height/rows;
  
  for(let i = 0; i < cols; i++){
    grid[i] = new Array(rows);
  }
  
  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      grid[i][j] = new Spot(i, j);   
    }
  }
  
  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      grid[i][j].addNeighbors(grid);  
    }
  }
  
  start = grid[0][0];
  end = grid[cols-1][rows-1];
  start.wall = false;
  end.wall = false;

  openSet.push(start);
}

function draw() {
  if(openSet.length > 0){
    //we can keep going
    var lowestIndex = 0;
    for(let i = 0; i < openSet.length; i++){
      if(openSet[i].f < openSet[lowestIndex]){
        lowestIndex = i;
      }
    }
    
    var current = openSet[lowestIndex];
    
    if(openSet[lowestIndex] ===  end){
      //find the path
      noLoop();
      console.log("DONE!");
    }
    
    removeFromArray(openSet, current);
    
    closedSet.push(current);
    
    var neighbors = current.neighbors; 
    for(var i = 0; i < neighbors.length; i++){
      var neighbor = neighbors[i];
      
      if(!closedSet.includes(neighbor) && !neighbor.wall){
        var tempG = current.g + 1; 
        
        var newPath = false;
        if(openSet.includes(neighbor)){
          if(tempG < neighbor.g){
            neighbor.g = tempG;
            newPath = true; 
          }
        }
         
        else{
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }
        //heuristic function used is manhattan distance
        if(newPath){
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.h + neighbor.g;
          neighbor.previous = current;
        }
      }
    }
  }
  else{
    console.log('No solution');
    noLoop();
    return;
  }
  
  background(255);  

  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
        grid[i][j].show(color(255));
    }
  }
  
  for(let i = 0; i < closedSet.length; i++){
    //closedSet[i].show(color(255, 0, 0));
  }
  
  for(let i = 0; i < openSet.length; i++){
    //openSet[i].show(color(0, 255, 0));
  }
  
  path = [];
  var temp = current;
  path.push(temp); 
  while(temp.previous){
    path.push(temp.previous);
    temp = temp.previous;
  }

  noFill();
  stroke(255, 0, 200);
  strokeWeight(w/2);
  beginShape();
  for(var i = 0; i < path.length; i++){
     vertex(path[i].i*w+w/2, path[i].j*h+h/2);
  }
  endShape();
}