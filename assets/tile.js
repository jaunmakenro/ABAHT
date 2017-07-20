"use strict";

Game.Tile = function(glyph,digable,walkable) {
    this.glyph = glyph || new Game.Glyph();
    this.digable = digable || false;
    this.walkable = walkable || false;
};

Game.Tile.nullTile = new Game.Tile(new Game.Glyph());
Game.Tile.floorTile = new Game.Tile(new Game.Glyph('.', 'black','white'),false, true);
Game.Tile.wallTile = new Game.Tile(new Game.Glyph(['.','#'], 'black','white'),true,false);

