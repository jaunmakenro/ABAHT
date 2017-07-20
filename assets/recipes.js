"use strict";

Game.recipes = {
    iron: {
        kind: "ressource",
        pattern: [
            ["r", "r", "."],
            ["r", "r", "."],
            [".", ".", "."]
        ],
        result: Game.Prop.iron,
    },
    plank: {
        kind: "ressource",
        pattern: [
            [".", "w", "."],
            [".", "w", "."],
            [".", "w", "."]
        ],
        result: Game.Prop.plank,
    },
    bar: {
        kind: "ressource",
        pattern: [
            ["i", "i", "i"]
        ],
        result: Game.Prop.bar,
    },
    track: {
        kind: "building",
        pattern: [
            [".", "b", "."],
            ["p", "p", "p"],
            [".", "b", "."]
        ],
        result: [
            [".", ".", "."],
            [Game.Prop.track, Game.Prop.track, Game.Prop.track],
            [".", ".", "."]
        ],
    },
}