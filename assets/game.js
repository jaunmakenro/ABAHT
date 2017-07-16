var Game = {
    display: null,
    mapDisplay: null,
    mainScreenWidth: 10,
    mainScreenHeight: 10,
    mainFontSize: 64,
    asciiFontSize: 16,
    mapWidth: 50,
    mapHeight: 100,
    mapScreenWidth: 0,
    mapScreenHeight: 0,
    displayMode: "tile",
    cursormode: "default",

    init: function() {
        // create main dsplay
        this.display = new ROT.Display({ width: this.mainScreenWidth, height: this.mainScreenHeight, fontSize: this.mainFontSize, forceSquareRatio: true });
        this.updateMainDisplayOptions();
        //create mini map display
        var miniMapFontSize = 160 / this.mapWidth
        this.mapScreenWidth = this.mapWidth,
            this.mapScreenHeight = this.mapHeight,
            this.mapDisplay = new ROT.Display({ width: this.mapScreenWidth, height: this.mapScreenHeight, fontSize: 3, forceSquareRatio: true });
        //create map and player
        this.map = new Game.Map(this.mapWidth, this.mapHeight);
        this.propsMap = new Game.propsMap(this.map.width, this.map.height)

        // this.map.setTestMap() //replace map with test map, fill propsMap in the same time

        this.player = new Game.Player(2, this.mapHeight / 2);



        //start game engine
        this.scheduler = new ROT.Scheduler.Simple();
        this.engine = new ROT.Engine(this.scheduler);
        this.scheduler.add(this.player, true);
        this.engine.start();

        window.addEventListener("keydown", this.handleKeys);
        window.addEventListener('click', this.handleClick);
        window.addEventListener('onmousedown', this.handleClic);
        window.addEventListener('mousewheel', this.handleWheel);
        document.getElementById("main").addEventListener('mousemove', this.overing);


        // Add the container to our HTML page
        document.getElementById('main').appendChild(Game.display.getContainer());
        document.getElementById('main').focus();
        document.getElementById('map').appendChild(Game.mapDisplay.getContainer());
        //Game.updateDisplay();
        setTimeout(Game.updateDisplay, 3000)
    },

    /////// Input managment methods
    overing: function(event) {
        //manage cursor look, while overing main display 
        var target = Game.display.eventToPosition(event)
        target[0] += Game.map.topLeftX
        target[1] += Game.map.topLeftY

        if (Game.map.getTile(target[0], target[1]).walkable) {
            document.getElementById("main").style.cursor = "url(assets/walkCursor.png), pointer"; //
        } else if (Game.map.getTile(target[0], target[1]).digable) {
            document.getElementById("main").style.cursor = "url(assets/digCursor.png), pointer";
        } else {
            document.getElementById("main").style.cursor = "pointer";
        }
    },

    handleKeys: function(event) {
        //handle movment key
        Game.player.moveToDir(event)
            //console.log(event)
            //other key
        if (event.key === "<") { Game.zoom(2) }
        if (event.key === ">") { Game.zoom(0.5) }
    },

    //handle click
    handleClick: function(event) {
        //position du clic sur le display principale
        var target = Game.display.eventToPosition(event)
            //si on est sur le display principal, on recupere la position sur la carte
        if (target[0] != -1) {
            target[0] += Game.map.topLeftX
            target[1] += Game.map.topLeftY
            if (Game.map.getTile(target[0], target[1]).walkable) {
                Game.player.moveTo(target) //run pathfinding method
            }
            return
        }
        //position du clic sur le display de la map
        var target = Game.mapDisplay.eventToPosition(event)
            //si on est sur le display principal, on recupere la position sur la carte
        if (target[0] != -1) {
            //target[0] += Game.map.topLeftX
            //target[1] += Game.map.topLeftY        
            Game.player.moveTo(target) //run pathfinding method
            return
        }
    },

    handleWheel: function(event) {
        if (event.deltaY > 0) {
            Game.zoom(2)
        }
        if (event.deltaY < 0) {
            Game.zoom(0.5)
        }
    },

    //////// Display management methods
    updateDisplay: function() {
        console.log("update diplay")
            //draw map and player
        this.map.drawMap(Game.player.x, Game.player.y);
        this.map.drawMini();
        this.player.draw();
        this.propsMap.draw();
        this.propsMap.drawOnMiniMap();
    },

    zoom: function(factor) {
        console.log("zoom " + factor);
        console.log("font size " + Game.mainFontSize);
        Game.mainFontSize = Game.mainFontSize / factor;
        if (Game.mainFontSize <= 64 && Game.mainFontSize >= 8) {
            Game.mainScreenWidth = Game.mainScreenWidth * factor;
            Game.mainScreenHeight = Game.mainScreenHeight * factor;
            console.log("new font size : " + Game.mainFontSize);
            Game.updateMainDisplayOptions();
            Game.updateDisplay();
        } else { //out of zoom bound, back to initial state
            Game.mainFontSize = Game.mainFontSize * factor;
        }
    },

    updateMainDisplayOptions: function() {
        Game.mainScreenWidth = Math.floor((window.innerWidth * 0.75) / Game.mainFontSize);
        Game.mainScreenHeight = Math.floor((window.innerHeight - 30) / Game.mainFontSize);

        //ASCII mode
        if (Game.mainFontSize <= Game.asciiFontSize) {
            this.displayMode = "ascii"
            Game.display.setOptions({
                layout: "rect",
                width: Game.mainScreenWidth,
                height: Game.mainScreenHeight,
                fontSize: Game.mainFontSize
            });
            return
        } else {
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
                    tileSet.src = "assets/tileset64x64complex.png";
                    break
            }
            //apply options
            Game.display.setOptions({
                layout: "tile",
                bg: "transparent",
                tileWidth: Game.mainFontSize,
                tileHeight: Game.mainFontSize,
                tileSet: tileSet,
                tileMap: tilemap,
                width: Game.mainScreenWidth,
                height: Game.mainScreenHeight,
                fontSize: Game.mainFontSize
            })
        }
    },
}

window.onload = function() {
    // Check if rot.js can work on this browser
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {
        // Initialize the game
        Game.init();
        // Add the container to our HTML page
        //document.getElementById('main').appendChild(Game.display.getContainer());
        //document.getElementById('main').focus();
        //document.getElementById('map').appendChild(Game.mapDisplay.getContainer());

        //setTimeout(Game.updateDisplay, 10000)
    }
}