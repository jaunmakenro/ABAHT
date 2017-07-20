"use strict";

Game.Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.glyph = new Game.Glyph('@', 'red','white');
    this.path = [];
}

Game.Player.prototype.act = function() {
    console.log("player act")
    
    var thisPlayer = this;//usefull in callbacks
    //define asynchronous callback
    function unlock() {
        Game.engine.unlock()    
    }
     
    if (thisPlayer.path.length ==0){
        /* wait for user input; do stuff when user hits a key */
        Game.engine.lock();
    }
    else{//process pending movement
        Game.engine.lock();
        //console.log(thisPlayer.path)
        var dest = thisPlayer.path.shift()
        thisPlayer.moveToCell(dest.x,dest.y)
        
        setTimeout(function() {
                requestAnimationFrame(unlock);
        }, 250);
    }
    //window.addEventListener("keydown", this);
}

//method called with player input (direction)
Game.Player.prototype.moveToDir = function(event) {
    /* process user input */
	var keyMap = {};
    keyMap[38] = 0;
    keyMap[33] = 1;
    keyMap[39] = 2;
    keyMap[34] = 3;
    keyMap[40] = 4;
    keyMap[35] = 5;
    keyMap[37] = 6;
    keyMap[36] = 7;
 
    var code = event.keyCode;
	//console.log(code);
    if (!(code in keyMap)) { return; }
 
    var diff = ROT.DIRS[8][keyMap[code]];
    var newX = this.x + diff[0];
    var newY = this.y + diff[1];

    this.moveToCell(newX,newY)
    this.digCell(newX,newY)    
    Game.engine.unlock();
}

//check if destination cell is walkable then move
Game.Player.prototype.moveToCell = function(newX,newY) {
    if (Game.map.getTile(newX, newY).walkable) { 
	    //check for prop
        var prop =  Game.propsMap.getPropAt(newX,newY)    
        if (prop == null){
            this.x = newX;
            this.y = newY;
        } else {
            console.log(prop)
            Game.propsMap.pushToDir(newX,newY,newX-this.x,newY-this.y)
        }
        Game.updateDisplay();
    }
}

//check if destination cell is digable then dig
Game.Player.prototype.digCell = function(x,y) {
    if (Game.map.getTile(x, y).digable) { 
	    Game.map.tiles[x][y] = Game.Tile.floorTile// dig map
        Game.propsMap.create(x,y,Game.Prop.rock)//create rock
        Game.updateDisplay();
    }
}


//move to coordinates using pathfinding
Game.Player.prototype.moveTo = function(coords) {
    /* prepare path to given coords */
    var dijkstra = new ROT.Path.Dijkstra(coords[0], coords[1], Game.map.isWalkable);
    var thisPlayer = this;//usefull in callbacks
    this.path = [];
    /* compute from given coords #1 */
    dijkstra.compute(this.x, this.y, function(x, y) {
        thisPlayer.path.push({x:x,y:y})
    });
    console.log("lets follow" +this.path)
    
    Game.engine.unlock()
    
    /* //define asynchronous callback
    function followPath() {
        var dest = thisPlayer.path.shift()
        thisPlayer.moveToCell(dest.x,dest.y)
        if (thisPlayer.path.length >0){
            setTimeout(function() {
                requestAnimationFrame(followPath);
            }, 250);
        }
    }
    followPath() */
}

Game.Player.prototype.draw = function() {
    var terrainChar = Game.map.getTile(this.x, this.y).glyph.char
    Game.display.draw(this.x - Game.map.topLeftX, this.y - Game.map.topLeftY, [terrainChar,this.glyph.char], this.glyph.fg,this.glyph.bg);
    Game.mapDisplay.draw(this.x, this.y, ' ', 'red','red');
}
