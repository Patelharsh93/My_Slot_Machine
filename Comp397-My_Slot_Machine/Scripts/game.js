/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />
//Game framework variable
var canvas = document.getElementById("canvas");
var stage;
var stats;
var assets;
var manifest = [
    { id: "background", src: "assets/images/slotMachine.png" },
    { id: "clicked", src: "assets/audio/Clicked.wav" }
];
//Game variables
var background;
//preloaded Function
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    //assets.on is an event Listener, triggers when assets are cmpletely loaded
    assets.on("complete", init, this);
    assets.loadManifest(manifest); //Manifest is assets manager, an array of object
    //Setup statics object
    setupStats();
}
//Callback function that intializies game objects
function init() {
    stage = new createjs.Stage(canvas); //refrence to the stage
    stage.enableMouseOver(20);
    //Ticker is a static class
    createjs.Ticker.setFPS(60); //framerate for the game
    //event listener triggers 60 ms times every second
    createjs.Ticker.on("tick", gameLoop);
    //Calling main Function
    main();
}
function setupStats() {
    stats = new Stats();
    stats.setMode(2);
    // align bottom-right
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '330px';
    stats.domElement.style.top = '10px';
    document.body.appendChild(stats.domElement);
}
//Call back function that creates our main gameLoop- refresed 60 fps
function gameLoop() {
    stats.begin(); //Begin measuring
    stage.update();
    stats.end(); //
}
//Call back function that allows me to respond to button clcik events
function pinkButtonClicked(event) {
    createjs.Sound.play("clicked");
}
//Call back function that changes the alpha transparency of the button
//Our main function
function main() {
    //add in slot machine graphics
    background = new createjs.Bitmap(assets.getResult("background"));
    stage.addChild(background);
}
//# sourceMappingURL=game.js.map