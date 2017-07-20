"use strict";

//draw glyph only if diiferent 
Game.drawIfNeeded = function(display, x,y,chr,fg,bg) { 
    if(typeof display._data[x +"," +y] == 'undefined' ){
        display.draw(x,y,chr,fg,bg);
        return true
    } else {
        if (display._data[x +"," +y][2] != chr || display._data[x +"," +y][3] != fg || display._data[x +"," +y][4] != bg){
            display.draw(x,y,chr,fg,bg);
            return true
        }
    }
    return false
};