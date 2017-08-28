"use strict";

Game.recipes = {
    iron: {
        kind: "ressource",
        pattern: [
            ["r","r",""],
            ["r","r",""],
            ["" ,"" ,""]
        ],
        result: Game.Prop.iron,
    },
    plankv: {
        kind: "ressource",
        pattern: [
            ["","w",""],
            ["","w",""],
            ["","w",""]
        ],
        result: Game.Prop.plank,
    },
    plankh: {
        kind: "ressource",
        pattern: [
            ["" ,"" , ""],
            ["w","w","w"],
            ["" ,"" , ""]
        ],
        result: Game.Prop.plank,
    },
    barh: {
        kind: "ressource",
        pattern: [
            ["","",""],
            ["i","i","i"],
            ["","",""]
        ],
        result: Game.Prop.bar,
    },
    barv: {
        kind: "ressource",
        pattern: [
            ["", "i", ""],
            ["", "i", ""],
            ["", "i", ""]
        ],
        result: Game.Prop.bar,
    },
    track: {
        kind: "building",
        pattern: [
            ["", "b", ""],
            ["p", "p", "p"],
            ["", "b", ""]
        ],
        result: [
            ["", "", ""],
            [Game.Prop.track, Game.Prop.track, Game.Prop.track],
            ["", "", ""]
        ],
    },
},

Game.drawRecipes =  function(){
    console.log ("draw recipes")
    // white background
    for (var x = 0; x < Game.mainScreenWidth; x++) {
        for (var y = 0; y < Game.mainScreenHeight; y++) {
            Game.display.draw(x , y , " ", 'white', 'white');
        }
    }
    
    var xOffset = 0
    var yOffset = 0
    //read each recipe
    for (var recipe in Game.recipes) {
        var recipeToDraw = Game.recipes[recipe]
        var patternToDraw = recipeToDraw.pattern
        var resultToDraw = recipeToDraw.result

        var patternWidth = patternToDraw[0].length //number of column in pattern
        var patternHeight = patternToDraw.length //number of row in pattern
        //draw pattern
        if (patternHeight == 1){ //only on line
            for (var x = 0; x < patternWidth ; x++) {
                Game.display.draw(x + xOffset , y + yOffset , patternToDraw[x], 'white', 'white');
            }
        } else { //several lines
            for (var x = 0; x < patternWidth ; x++) {
                for (var y = 0; y < patternHeight; y++) {
                    Game.display.draw(x + xOffset , y + yOffset , patternToDraw[y][x], 'white', 'white');
                }
            }
        }
        //display equal line
        Game.display.draw(xOffset + patternWidth , yOffset+ Math.floor(patternHeight/2), "=", 'white', 'white');
        //display result
        if(recipeToDraw.kind ==  "ressource" ){
            Game.display.draw(xOffset + patternWidth +1 , yOffset + Math.floor(patternHeight/2), resultToDraw.glyph.char, 'white', 'white');
        }else if (recipeToDraw.kind ==  "building"){
            var resultToDrawWidth = resultToDraw[0].length //number of column in pattern
            var resultToDrawHeight = resultToDraw.length //number of row in pattern
            for (var x = 0; x < resultToDrawWidth ; x++) {
                for (var y = 0; y < resultToDrawHeight; y++) {
                    if (resultToDraw[y][x] != ""){
                        Game.display.draw(x + xOffset + patternWidth +1, y + yOffset , resultToDraw[y][x].glyph.char, 'white', 'white');
                    }
                }
            }
        }
        
        yOffset += patternHeight +1
        if (yOffset > Game.mainScreenHeight){
            yOffset = 0
            xOffset = 7
        }
    }
}