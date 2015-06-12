/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />

//Game framework variable

var canvas = document.getElementById("canvas");
var stage: createjs.Stage;
var stats: Stats;

var assets: createjs.LoadQueue;
var manifest = [
    { id: "pinkButton", src: "assets/images/pinkButton.png" },
    { id: "clicked", src: "assets/audio/Clicked.wav" }
];

//Game variables
var helloLabel: createjs.Text;  //create a refrence
var pinkButton: createjs.Bitmap;

//preloaded Function
function preload()
{
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    //assets.on is an event Listener, triggers when assets are cmpletely loaded
    assets.on("complete", init, this);  
    assets.loadManifest(manifest);     //Manifest is assets manager, an array of object

    //Setup statics object
    setupStats();
}


//Callback function that intializies game objects
function init(){
    stage = new createjs.Stage(canvas);  //refrence to the stage
    stage.enableMouseOver(20);
    //Ticker is a static class
    createjs.Ticker.setFPS(60); //framerate for the game
    //event listener triggers 60 ms times every second
    createjs.Ticker.on("tick", gameLoop);

    //Calling main Function
    main();
}

function setupStats()
{
    stats = new Stats();
    stats.setMode(2);

    // align bottom-right
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '330px';
    stats.domElement.style.top = '10px';

    document.body.appendChild(stats.domElement);
}

//Call back function that creates our main gameLoop- refresed 60 fps
function gameLoop()
{
    stats.begin(); //Begin measuring

    stage.update();

    stats.end(); //
}

//Call back function that allows me to respond to button clcik events
function pinkButtonClicked(event: createjs.MouseEvent)
{
    createjs.Sound.play("clicked");
}

//Call back function that changes the alpha transparency of the button
//Mouseover event
function pinkButtonOver()
{
    pinkButton.alpha = 0.8;
}

//Mouseout event
function pinkButtonOut()
{
    pinkButton.alpha = 1.0;
}


//Our main function
function main() {
    console.log("Game is Running");
    helloLabel = new createjs.Text("hello World!", "40px Consolas", "#00000");

    helloLabel.regX = helloLabel.getMeasuredWidth() * 0.5;
    helloLabel.regY = helloLabel.getMeasuredHeight() * 0.5;
    helloLabel.x = 160;
    helloLabel.y = 180;

    stage.addChild(helloLabel);

    pinkButton = new createjs.Bitmap(assets.getResult("pinkButton"));
    pinkButton.regX = pinkButton.getBounds().width * 0.5;
    pinkButton.regY = pinkButton.getBounds().height * 0.5;
    pinkButton.x = 160;
    pinkButton.y = 270;

    stage.addChild(pinkButton);
    pinkButton.on("click", pinkButtonClicked);
    pinkButton.on("mouseover", pinkButtonOver);
    pinkButton.on("mouseout", pinkButtonOut);
}