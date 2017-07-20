"use strict";

Game.Glyph = function(chr, foreground, background) {
    // Instantiate properties to default if they weren't passed
    this.char = chr || ' ';
    this.fg = foreground || 'white';
    this.bg = background || 'black';
};
