"use strict";

Game.Map = function(width, height) {
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.topLeftX = null;
    this.topLeftY = null;
    //Create map container
    var temptiles = [];
    for (var x = 0; x < this.width; x++) {
        // Create the nested array for the y values
        temptiles.push([]);
        // Add all the tiles
        for (var y = 0; y < this.height; y++) {
            temptiles[x].push(Game.Tile.nullTile) //Game.Tile.nullTile);
        }
    }

    //generate map
    var generator = new ROT.Map.Cellular(this.width * 2, this.height * 2);
    generator.randomize(0.45);
    var totalIterations = 3;
    // Iteratively smoothen the map
    for (var i = 0; i < totalIterations - 1; i++) {
        generator.create();
    }

    // Smoothen it one last time and then update our map
    generator.connect(function(x, y, v) {
        if (x < width && y < height) {
            if (v === 0) {
                temptiles[x][y] = Game.Tile.floorTile;
            } else {
                temptiles[x][y] = Game.Tile.wallTile;
            }
        }
    });
    this.tiles = temptiles
};

// Gets the tile for a given coordinate set
Game.Map.prototype.getTile = function(x, y) {
    // Make sure we are inside the bounds. If we aren't, return
    // null tile.
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
        return Game.Tile.nullTile;
    } else {
        return this.tiles[x][y] || Game.Tile.nullTile;
    }
};

//return true if the given coordinates are walkables
Game.Map.prototype.isWalkable = function(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
        return false;
    } else {
        if (Game.map.getTile(x, y).glyph.char === '.') {
            return true;
        } else {
            return false
        }
    }
};

//draw map on main display 
Game.Map.prototype.drawMap = function(centerX, centerY) {
    // Make sure the x-axis doesn't go to the left of the left bound
    this.topLeftX = Math.max(0, centerX - Math.ceil(Game.mainScreenWidth / 2));
    // Make sure we still have enough space to fit an entire game screen
    this.topLeftX = Math.min(this.topLeftX, this.width - Math.ceil(Game.mainScreenWidth / 2));
    // Make sure the y-axis doesn't above the top bound
    this.topLeftY = Math.max(0, centerY - Math.ceil(Game.mainScreenHeight / 2));
    // Make sure we still have enough space to fit an entire game screen
    this.topLeftY = Math.min(this.topLeftY, this.height - Math.ceil(Game.mainScreenHeight) / 2);

    // Iterate through all visible map cells
    for (var x = this.topLeftX; x < this.topLeftX + Game.mainScreenWidth; x++) {
        for (var y = this.topLeftY; y < this.topLeftY + Game.mainScreenHeight; y++) {
            // Fetch the glyph for the tile and render it to the screen at the offset position.
            var glyph = this.getTile(x, y).glyph;

            //rocher
            if (glyph.char.toString() == ['.', '#'].toString()) {
                if (Game.displayMode == "tile") {
                    //bitmasking score calculation : https://gamedevelopment.tutsplus.com/tutorials/how-to-use-tile-bitmasking-to-auto-tile-your-level-layouts--cms-25673
                    var score = 0
                    var wall = ['.', '#'].toString()
                    var nw = this.getTile(x - 1, y - 1).glyph.char.toString() //north west
                    var n = this.getTile(x, y - 1).glyph.char.toString() //north
                    var ne = this.getTile(x + 1, y - 1).glyph.char.toString() //north east
                    var w = this.getTile(x - 1, y).glyph.char.toString() //west
                    var e = this.getTile(x + 1, y).glyph.char.toString() //east
                    var sw = this.getTile(x - 1, y + 1).glyph.char.toString() //south west
                    var s = this.getTile(x, y + 1).glyph.char.toString() //south
                    var se = this.getTile(x + 1, y + 1).glyph.char.toString() //south east

                    if (nw == wall && (n == wall && w == wall)) { score += 1 } //north west
                    if (n == wall) { score += 2 } //north
                    if (ne == wall && (n == wall && e == wall)) { score += 4 } //north east
                    if (w == wall) { score += 8 } //west
                    if (e == wall) { score += 16 } //east
                    if (sw == wall && (s == wall && w == wall)) { score += 32 } //south west
                    if (s == wall) { score += 64 } //south
                    if (se == wall && (s == wall && e == wall)) { score += 128 } //south east

                    //on récupére la bonne tile n fonction du score et on l'affiche
                    var tile = ""
                    var coresp = { 2: 1, 8: 2, 10: 3, 11: 4, 16: 5, 18: 6, 22: 7, 24: 8, 26: 9, 27: 10, 30: 11, 31: 12, 64: 13, 66: 14, 72: 15, 74: 16, 75: 17, 80: 18, 82: 19, 86: 20, 88: 21, 90: 22, 91: 23, 94: 24, 95: 25, 104: 26, 106: 27, 107: 28, 120: 29, 122: 30, 123: 31, 126: 32, 127: 33, 208: 34, 210: 35, 214: 36, 216: 37, 218: 38, 219: 39, 222: 40, 223: 41, 248: 42, 250: 43, 251: 44, 254: 45, 255: 46, 0: 47 }
                    tile = "t" + coresp[score]
                    Game.display.draw(x - this.topLeftX, y - this.topLeftY, ['.', tile], glyph.fg, glyph.bg);
                } else {
                    Game.display.draw(x - this.topLeftX, y - this.topLeftY, "#", glyph.fg, glyph.bg);
                }
            } else { //si autre que rocher, on affiche
                Game.display.draw(x - this.topLeftX, y - this.topLeftY, glyph.char, glyph.fg, glyph.bg);
            }
        }

    }
};

//draw mini map 
Game.Map.prototype.drawMini = function() {
    // Iterate through all visible map cells
    for (var x = 0; x < Game.mapScreenWidth; x++) {
        for (var y = 0; y < Game.mapScreenHeight; y++) {
            var glyph = this.getTile(x, y).glyph;
            //if cell is visible, draw tinted on mini map
            if (x >= this.topLeftX && x <= this.topLeftX + Game.mainScreenWidth && y >= this.topLeftY && y <= this.topLeftY + Game.mainScreenHeight) {
                if (glyph.char === ".") {
                    Game.drawIfNeeded(Game.mapDisplay, x, y, " ", 'black', 'white')
                } else {
                    Game.drawIfNeeded(Game.mapDisplay, x, y, " ", 'black', 'black')
                }
            } else //if cell not visible, draw blac&white on minimap
            {
                if (glyph.char === ".") {
                    Game.drawIfNeeded(Game.mapDisplay, x, y, " ", 'black', 'grey')
                } else {
                    Game.drawIfNeeded(Game.mapDisplay, x, y, " ", 'black', 'black')
                }
            }
        }
    }
};

// recreate map with a test map
Game.Map.prototype.setTestMap = function() {
    this.tiles = [];
    var testmap = [".......................#....##.##....",
        "..t.w.i.b.p.r.c..##...###..###.###...",
        "......#..#.#.###.###.#####..#...#....",
        ".###.###.###..#.......###............",
        ".###.....#.#...........#.......#...#.",
        ".###...........#.#........##..###.###",
        "..............##.##.......###.##...##",
        "..#..###...#...#.#.........##........",
        ".###.#.#...#.........##.........###..",
        "..#..###...#...#....####...##..#####.",
        "...........#...#..........###..#####.",
        "..#............#....####..##....###..",
        "#############........##.............."
    ]
    var testmap = ["....#######..........................",
        ".....#######.........................",
        "......#####..........................",
        ".....#####...........................",
        ".....................................",
        "..........ii.........................",
        "....rrr..iii.........................",
        ".....r...............................",
        ".....................................",
        ".....................................",
        ".....................................",
        ".....................................",
        "....................................."
    ]
    this.width = testmap[0].length;
    this.height = testmap.length;

    //Create map container
    var temptiles = [];
    for (var x = 0; x < this.width; x++) {
        // Create the nested array for the y values
        temptiles.push([]);
        // Add all the tiles
        for (var y = 0; y < this.height; y++) {
            temptiles[x].push(Game.Tile.nullTile) //Game.Tile.nullTile);
        }
    }
    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            var c = testmap[y][x]
                //fill the map with needed tiles
            if (c != "#") {
                temptiles[x][y] = Game.Tile.floorTile;
            } else if (c == "#") {
                temptiles[x][y] = Game.Tile.wallTile;
            }

            switch (c) {
                case "r":
                    Game.propsMap.create(x, y, Game.Prop.rock) //create rock;    
                    break;
                case "i":
                    Game.propsMap.create(x, y, Game.Prop.iron) //create rock;
                    break;
                case "b":
                    Game.propsMap.create(x, y, Game.Prop.bar) //create rock;
                    break;
                case "w":
                    Game.propsMap.create(x, y, Game.Prop.wood) //create rock;
                    break;
                case "p":
                    Game.propsMap.create(x, y, Game.Prop.plank) //create rock;
                    break;
                case "t":
                    Game.propsMap.create(x, y, Game.Prop.tree) //create rock;
                    break;
                case "c":
                    Game.propsMap.create(x, y, Game.Prop.cactus) //create rock;
                    break;
                default:
                    break;
            }
            //fill the propsmap
            if (c == "r") {

            } else if (c == "i") {

            }
        }
    }
    this.tiles = temptiles
};