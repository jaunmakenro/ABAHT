Game.propsMap = function(width, height) {
    this.width = width;
    this.height = height;
    this.props = [];
    //Create map container
    var temptiles = [];
    for (var x = 0; x < this.width; x++) {
        // Create the nested array for the y values
        temptiles.push([]);
        // Add all the tiles
        for (var y = 0; y < this.height; y++) {
            temptiles[x].push("") //Game.Tile.nullTile);
        }
    }

    //create trees
    var treeGenerator = new ROT.Map.Cellular(this.width * 2, this.height * 2);
    treeGenerator.randomize(0.3);
    var totalIterations = 1;
    treeGenerator.create(function(x, y, v) {
        if (v === 1 && Game.map.getTile(x, y).walkable) {
            temptiles[x][y] = Game.Prop.tree
        }
    });
    this.props = temptiles
};

// Gets the prop for a given coordinate set
Game.propsMap.prototype.getPropAt = function(x, y) {
    //var nullProp = new Game.Props(x,y)//create rock

    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
        return null;
        //return nullProp;
    } else {
        var prop = this.props[x][y]
        if (prop == "") {
            return null
                //return nullProp;
        } else {
            return prop
        }
    }
};

// Gets the prop char for a given coordinate set, return "." si pas de prop
Game.propsMap.prototype.getPropCharAt = function(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
        return ".";
        //return nullProp;
    } else {
        var prop = this.props[x][y]
        if (prop == null || prop == "") {
            return "."
                //return nullProp;
        } else {
            return prop.glyph.char
        }
    }
};


//draw all visible props
Game.propsMap.prototype.draw = function(centerX, centerY) {
    //use map visibility boundary
    for (var x = Game.map.topLeftX; x < Game.map.topLeftX + Game.mainScreenWidth; x++) {
        for (var y = Game.map.topLeftY; y < Game.map.topLeftY + Game.mainScreenHeight; y++) {
            var prop = this.getPropAt(x, y)
            if (prop != null) {
                if (prop.glyph.char != " ") {
                    var terrainChar = Game.map.getTile(x, y).glyph.char
                    Game.display.draw(x - Game.map.topLeftX, y - Game.map.topLeftY, [terrainChar, prop.glyph.char], prop.glyph.fg, prop.glyph.bg);
                }
            }
        }
    }
};

//draw all visible props
Game.propsMap.prototype.drawOnMiniMap = function(centerX, centerY) {
    //use map visibility boundary
    for (var x = 0; x < Game.mapScreenWidth; x++) {
        for (var y = 0; y < Game.mapScreenHeight; y++) {
            var prop = this.getPropAt(x, y)
            if (prop != null) {
                Game.drawIfNeeded(Game.mapDisplay, x, y, " ", 'black', prop.glyph.fg)
            }
        }
    }
};

Game.propsMap.prototype.pushToDir = function(x, y, dx, dy) {
    if (Game.map.getTile(x + dx, y + dy).walkable) {
        var propToMove = this.getPropAt(x, y)
        var propAtDest = this.getPropAt(x + dx, y + dy)
            //move the prop
        if (propAtDest == null && propToMove.pushable) {
            this.props[x][y] = null
            this.props[x + dx][y + dy] = propToMove
            this.patternCheckAround(x + dx, y + dy);
        } else if (propToMove.destroyable) { //destroy the prop
            this.props[x][y] = propToMove.destroyProduct
            this.patternCheckAround(x, y);
        }
    }
};

//create new prop at given coords
Game.propsMap.prototype.create = function(x, y, prop) {
    if (this.getPropAt(x, y) == null) {
        this.props[x][y] = prop
        this.patternCheckAround(x, y);
    }
};

//remove prop at given coords
Game.propsMap.prototype.removePropAt = function(x, y) {
    if (this.getPropAt(x, y) != null) {
        this.props[x][y] = null
    }
};

//check if the last moved prop is part of a pattern
Game.propsMap.prototype.patternCheckAround = function(lastMovedPropX, lastMovedPropY) {
    for (var key in Game.recipes) {
        // console.log(key);
        // console.log(Game.recipes[key]);
        var patternToFind = Game.recipes[key].pattern
        var patternIndX = 0;
        var patternIndY = 0;
        var founded = false;
        var findedPropsCoord = [];
        var startY = 0
        var patternWidth = patternToFind[0].length //number of column in pattern
        var patternHeight = patternToFind.length //number of row in pattern
            //pour chaque ligne
        for (var y = lastMovedPropY - 2; y < lastMovedPropY + 2; y++) {
            //pour chaque case de la ligne
            for (var x = lastMovedPropX - 2; x < lastMovedPropX + 2; x++) {
                var findedChar = this.getPropCharAt(x, y)
                if (findedChar == patternToFind[0][0] || patternToFind[0][0] == ".") //first cell of the pattern has been found
                {
                    //list of finded props initialization 
                    findedPropsCoord = [];
                    if (findedChar != ".") {
                        findedPropsCoord.push({ x, y })
                    }

                    //on parcours le pattern
                    patternIndX = 1;
                    patternIndY = 0;
                    var findedChar = this.getPropCharAt(x + patternIndX, y + patternIndY)
                    while (findedChar == patternToFind[patternIndY][patternIndX] || patternToFind[patternIndY][patternIndX] == ".") {
                        //on compléte la liste des prop trouvées
                        if (patternToFind[patternIndY][patternIndX] != ".") {
                            findedPropsCoord.push({ x: x + patternIndX, y: y + patternIndY })
                        }
                        patternIndX += 1 //case suivante
                        if (patternIndX == patternWidth) { //ligne suivante
                            patternIndY += 1
                            patternIndX = 0
                            if (patternIndY == patternHeight) { //colone suivante
                                //pattern is fully finded starting at x:y
                                console.log("pattern " + key + " finded at " + x + " " + y)
                                    //destroy finded props
                                for (var i = 0; i < findedPropsCoord.length; i++) {
                                    this.removePropAt(findedPropsCoord[i].x, findedPropsCoord[i].y)
                                }
                                //replace lastmovedprops by result
                                console.log("create " + Game.recipes[key].result.glyph.char)
                                this.create(lastMovedPropX, lastMovedPropY, Game.recipes[key].result)
                                break
                            }
                        }
                        findedChar = this.getPropCharAt(x + patternIndX, y + patternIndY)
                    }
                }
            }
        }
    }
};