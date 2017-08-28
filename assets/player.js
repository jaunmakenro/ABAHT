"use strict";

Game.Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.glyph = new Game.Glyph('@', 'red', 'white');
}

Game.Player.prototype.act = function() {
    console.log("player act")

    var thisPlayer = this; //usefull in callbacks
    //define asynchronous callback
    //function unlock() {
    //    Game.engine.unlock()
    //}

    /* wait for user input; do stuff when user hits a key */
    Game.engine.lock();
}

//method called with player input (direction)
Game.Player.prototype.processEventKey = function(event) {
    console.log("process event key")
    
    var code = event.code;
    console.log(event)
    var newX = this.x;
    var newY = this.y;
    //todo pareil en utilisant event.key pour les vieux browser
    if (code == "Numpad7" || code == "KeyQ") {
        newX = this.x - 1;
        newY = this.y - 1;
    } else if (code == "Numpad8" || code == "KeyW" || code == "ArrowUp") {
        newX = this.x;
        newY = this.y - 1;
    } else if (code == "Numpad9" || code == "KeyE") {
        newX = this.x + 1;
        newY = this.y - 1;
    } else if (code == "Numpad4" || code == "KeyA"|| code == "ArrowLeft") {
        newX = this.x - 1;
        newY = this.y;
    } else if (code == "Numpad6" || code == "KeyD" || code == "ArrowRight") {
        newX = this.x + 1;
        newY = this.y;
    } else if (code == "Numpad1" || code == "KeyZ") {
        newX = this.x - 1;
        newY = this.y + 1;
    } else if (code == "Numpad2" || code == "KeyX"|| code == "ArrowDown") {
        newX = this.x;
        newY = this.y + 1;
    } else if (code == "Numpad3" || code == "KeyC") {
        newX = this.x + 1;
        newY = this.y + 1;
    } else if (code == "Numpad5" || code == "KeyS") {
        newX = this.x;
        newY = this.y;
    }

    this.moveToCell(newX, newY)
    this.digCell(newX, newY)
    Game.engine.unlock();
}

//method called with player input (direction)
Game.Player.prototype.processEventTouch = function(event) {
    //document.getElementById('up').innerHTML = "x: " + event.changedTouches[0].x + " y: " + event.changedTouches[0].y
    //document.getElementById('up').innerHTML = "touch" + event

    if (event.x < window.innerWidth / 3) { //coté gauche
        var newX = this.x - 1;
    } else if (event.x < (window.innerWidth / 3) * 2) { //milieu
        var newX = this.x;
    } else if (event.x > (window.innerWidth / 3) * 2) { //coté droit
        var newX = this.x + 1;
    }

    if (event.y < window.innerHeight / 3) { //en haut a gauche
        var newY = this.y - 1;
    } else if (event.y < (window.innerHeight / 3) * 2) { //gauche
        var newY = this.y;
    } else if (event.y > (window.innerHeight / 3) * 2) { //bas gauche
        var newY = this.y + 1;
    }

    this.moveToCell(newX, newY)
    this.digCell(newX, newY)
    Game.engine.unlock();
}


//check if destination cell is walkable then move
Game.Player.prototype.moveToCell = function(newX, newY) {
    if (Game.map.getTile(newX, newY).walkable) {
        //check for prop
        var prop = Game.propsMap.getPropAt(newX, newY)
        if (prop == null || prop.walkable) {
            this.x = newX;
            this.y = newY;
            Game.moves += 1
        } else {
            console.log(prop)
            Game.propsMap.pushToDir(newX, newY, newX - this.x, newY - this.y)
        }
        Game.updateDisplay();
    }
}

//check if destination cell is digable then dig
Game.Player.prototype.digCell = function(x, y) {
    if (Game.map.getTile(x, y).digable) {
        Game.map.tiles[x][y] = Game.Tile.floorTile // dig map
        Game.propsMap.create(x, y, Game.Prop.rock) //create rock
        Game.moves += 1
        Game.updateDisplay();
    }
}

Game.Player.prototype.draw = function() {
    var terrainChar = Game.map.getTile(this.x, this.y).glyph.char
    var propchar = Game.propsMap.getPropCharAt(this.x, this.y)

    Game.display.draw(this.x - Game.map.topLeftX, this.y - Game.map.topLeftY, [terrainChar, propchar, this.glyph.char], this.glyph.fg, this.glyph.bg);
}