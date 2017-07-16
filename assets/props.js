Game.Prop = function(glyph, pushable,destroyable, destroyProduct) {
    this.glyph = glyph || new Game.Glyph();
    this.pushable = pushable || false;
    this.destroyable = destroyable || null;
    this.destroyProduct = destroyProduct || null;
};

Game.Prop.rock = new Game.Prop(new Game.Glyph('r', 'brown', 'white'), true,false,null);
Game.Prop.iron = new Game.Prop(new Game.Glyph('i', 'blue', 'white'), true,false,null);
Game.Prop.bar = new Game.Prop(new Game.Glyph('b', 'grey', 'white'), true,false,null);
Game.Prop.wood = new Game.Prop(new Game.Glyph('w', 'brown', 'white'), true,false,null);
Game.Prop.plank = new Game.Prop(new Game.Glyph('p', 'black', 'white'), true,false,null);
Game.Prop.tree = new Game.Prop(new Game.Glyph('t', 'green', 'white'), false,true,Game.Prop.wood);
Game.Prop.cactus = new Game.Prop(new Game.Glyph('c', 'green', 'white'), false,true, null);