"use strict";

var Game = {
    display: null,
    mapDisplay: null,
    menuDisplay: null,
    mainScreenWidth: 10,
    mainScreenHeight: 10,
    mainFontSize: 64,
    asciiFontSize: 16,
    mapWidth: 9,
    mapHeight: 100,
    mapScreenWidth: 0,
    mapScreenHeight: 0,
    displayMode: "tile",
    activeScreen: "menu",
    menuIndex: 0,
    moves:0,

    test : false,

    //initialisation menu
    initMenu: function() {
        // create main dsplay
        Game.mainScreenWidth = Math.floor((window.innerWidth - 50) / Game.mainFontSize);
        Game.mainScreenHeight = Math.floor((window.innerHeight - 50) / Game.mainFontSize);
        
        this.menuDisplay = new ROT.Display({ width: this.mainScreenWidth, height: this.mainScreenHeight, fontSize: this.mainFontSize, forceSquareRatio: true });
        this.menuDisplay.setOptions({
            fontStyle: "bold",
            bg: 'white',
            fg: 'black'
        });
        //document.getElementById('up').innerHTML = "ho"

        // Add the container to our HTML page
        document.getElementById('main').appendChild(Game.menuDisplay.getContainer());
        this.redrawMenu()
        window.addEventListener("click", this.handleTouch);
        window.addEventListener("keydown", this.handleKeys);
    },

    redrawMenu: function() {
        var menus = ["Main", "Main ASCII", "test map", "000"]
        for (var i = 0; i < menus.length; i++) {
            var text = menus[i]
            if (i == Game.menuIndex) { text = "%c{red}" + text }

            this.menuDisplay.drawText(1, 1 + i, text)
        }
    },

    //initialisation principale
    init: function() {
        // create main dsplay
        this.display = new ROT.Display({ width: this.mainScreenWidth, height: this.mainScreenHeight, fontSize: this.mainFontSize, forceSquareRatio: true });
        this.updateMainDisplayOptions();
        document.getElementById('up').innerHTML = "Moves: " + Game.moves
        //create map and player
        this.map = new Game.Map(this.mapWidth, this.mapHeight);
        this.propsMap = new Game.propsMap(this.map.width, this.map.height)

        // this.map.setTestMap() //replace map with test map, fill propsMap in the same time

        //level initialization
        this.player = new Game.Player(2, this.mapHeight / 2 + 1);
        for (var x = 0; x < 9; x++) {
            for (var y = this.player.y - 3; y < this.player.y + 3; y++) {
                Game.map.tiles[x][y] = Game.Tile.floorTile // dig map
            }
        }
        this.propsMap.create(0, this.mapHeight / 2, Game.Prop.track)
        this.propsMap.create(1, this.mapHeight / 2, Game.Prop.track)
        this.propsMap.create(2, this.mapHeight / 2, Game.Prop.plank)
        this.propsMap.create(3, this.mapHeight / 2, Game.Prop.plank)
        this.propsMap.create(4, this.mapHeight / 2, Game.Prop.plank)
        this.propsMap.create(3, (this.mapHeight / 2) - 1, Game.Prop.bar)
        this.propsMap.create(3, (this.mapHeight / 2) + 2, Game.Prop.bar)

        //start game engine
        this.scheduler = new ROT.Scheduler.Simple();
        this.engine = new ROT.Engine(this.scheduler);
        this.scheduler.add(this.player, true);
        this.engine.start();
  
        // Add the container to our HTML page
        document.getElementById('main').appendChild(Game.display.getContainer());
        Game.updateDisplay();
    },

    /////// Input managment methods
    //gestion touch    
    handleTouch: function(event) {
        switch (Game.activeScreen) {
            case "menu":
                this.menuDisplay = null
                Game.mainFontSize = 64
                Game.activeScreen = "main"
                Game.init()
                break;

            case "main":
                Game.player.processEventTouch(event)
                break;

            default:
                break;
        }
    },

    //gestion clavier 
    handleKeys: function(event) {
        this.test = true
        switch (Game.activeScreen) {
            case "menu":
                if (event.key == "ArrowDown") {
                    Game.menuIndex += 1
                }
                if (event.key == "ArrowUp") {
                    Game.menuIndex -= 1
                }
                if (event.key == "Enter") {
                    switch (Game.menuIndex) {
                        case 0: //main
                            document.getElementById('main').innerHTML = '';
                            this.menuDisplay = null
                            Game.mainFontSize = 64
                            Game.activeScreen = "main"
                            Game.init()
                            break;
                        case 1: //Main Ascii
                            document.getElementById('main').innerHTML = '';
                            this.menuDisplay = null
                            Game.mainFontSize = 16
                            Game.activeScreen = "main"
                            Game.init()
                            break;
                        case 2: //test map
                            document.getElementById('main').innerHTML = '';
                            this.menuDisplay = null
                            Game.activeScreen = "main"
                            break;
                        default:
                            break;
                    }
                }
                Game.redrawMenu()
                break;

            case "main":
                if (event.key == ",") {
                    Game.showHelp();
                }else{
                    Game.player.processEventKey(event)
                }
                break;
            case "help":
                Game.activeScreen = "main"
                Game.updateDisplay();
                break

            default:
                break;
        }
    },

    showHelp: function(){
        if (Game.activeScreen = "main"){
            console.log("show help")
            Game.drawRecipes();
            Game.activeScreen = "help"
            document.getElementById('main').innerHTML = 'help screen';
        }else if(Game.activeScreen = "help"){
            Game.updateDisplay();
            Game.activeScreen = "help"
            document.getElementById('main').innerHTML = "Moves: " + Game.moves;
        }
    },

    //////// Display management methods
    updateDisplay: function() {
        //console.log("update diplay")
            //draw map and player
        this.map.drawMap(Game.player.x, Game.player.y);
        this.propsMap.draw();
        this.player.draw();
        Game.display.getContainer().style.display = 'none';
        Game.display.getContainer().style.display = 'block';
        document.getElementById('up').innerHTML = "Moves: " + Game.moves
    },

    updateMainDisplayOptions: function() {
        Game.mainScreenWidth = Math.floor((window.innerWidth - 10) / Game.mainFontSize);
        Game.mainScreenHeight = Math.floor((window.innerHeight - 10) / Game.mainFontSize);

        //tileset mode
        //define tilemap
        this.displayMode = "tile"
        var tilemap = Game.tilemap
            //get tileset
        var tileSet = document.createElement("img");
        switch (Game.mainFontSize) {
            case 16:
                tileSet.src = "assets/tilset16x16.png";
                break
            case 32:
                tileSet.src = "assets/tilset32x32.png";
                break
            case 64:
                tileSet.src = "assets/tileset64x64.png";
                break
        }

        //apply options
        Game.display.setOptions({
            layout: "tile",
            bg: "white",
            fg: "white",
            tileWidth: Game.mainFontSize,
            tileHeight: Game.mainFontSize,
            tileSet: tileSet,
            tileMap: tilemap,
            width: Game.mainScreenWidth,
            height: Game.mainScreenHeight,
            fontSize: Game.mainFontSize
        })
        Game.display.getContainer().style.display = 'none';
        Game.display.getContainer().style.display = 'block';
    },
}

window.onload = function() {
    // Check if rot.js can work on this browser
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {
        // Initialize the game
        Game.initMenu();
    }
}