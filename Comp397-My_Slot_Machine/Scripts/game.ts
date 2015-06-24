/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />


/// <reference path="../config/constants.ts" />
/// <reference path="../objects/label.ts" />
/// <reference path="../objects/button.ts" />



//Game framework variable

var canvas = document.getElementById("canvas");
var stage: createjs.Stage;
var stats: Stats;

var assets: createjs.LoadQueue;
var manifest = [
    { id: "background", src: "assets/images/slotMachine.png" },
    { id: "blank", src: "assets/images/blankSymbol.png" },
    { id: "banana", src: "assets/images/bananaSymbol.png" },
    { id: "bar", src: "assets/images/barSymbol.png" },
    { id: "bell", src: "assets/images/bellSymbol.png" },
    { id: "cherry", src: "assets/images/cherrySymbol.png" },
    { id: "grapes", src: "assets/images/grapesSymbol.png" },
    { id: "Orange", src: "assets/images/OrangeSymbol.png" },
    { id: "seven", src: "assets/images/sevenSymbol.png" },
    { id: "clicked", src: "assets/audio/Clicked.wav" }
];

var atlas = {
    "images": ["assets/images/atlas.png"],
    "frames": [

        [2, 2, 64, 64],
        [2, 68, 64, 64],
        [2, 134, 64, 64],
        [200, 2, 49, 49],
        [200, 53, 49, 49],
        [200, 104, 49, 49],
        [68, 2, 64, 64],
        [134, 2, 64, 64],
        [68, 68, 64, 64],
        [134, 68, 64, 64],
        [134, 134, 49, 49],
        [68, 134, 64, 64],
        [185, 155, 49, 49]
    ],
    "animations": {

        "bananaSymbol": [0],
        "barSymbol": [1],
        "bellSymbol": [2],
        "betMaxButton": [3],
        "betOneButton": [4],
        "betTenButton": [5],
        "blankSymbol": [6],
        "cherrySymbol": [7],
        "grapesSymbol": [8],
        "orangeSymbol": [9],
        "resetButton": [10],
        "sevenSymbol": [11],
        "spinButton": [12]
    }
}

//Game variables
var background: createjs.Bitmap
var blank: createjs.Bitmap

var jackpotAmt: createjs.Text
var playerBetAmt: createjs.Text
var playerCreditAmt:createjs.Text

var textureALtlas: createjs.SpriteSheet
var spinButton: objects.Button
var resetButton: objects.Button
var betOneButton: objects.Button
var betTenButton: objects.Button
var betMaxButton:objects.Button



/*Tally variables */
var grapes = 0;
var bananas = 0;
var oranges = 0;
var cherries = 0;
var bars = 0;
var bells = 0;
var sevens = 0;
var blanks = 0;

var playerMoney = 1000;
var playerMoneySet;
var win = 0;
var jackpot = 5000;
var turn = 0;
var playerBet = 0;
var spinResult;
var fruits = "";
var result;
var bet;
var credit;
var reel0;
var reel1;
var reel2;

//preloaded Function
function preload()
{
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    //assets.on is an event Listener, triggers when assets are cmpletely loaded
    assets.on("complete", init, this);  
    assets.loadManifest(manifest);     //Manifest is assets manager, an array of object

    //load texture atlas
    textureALtlas = new createjs.SpriteSheet(atlas);

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

/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    }
    else {
        return !value;
    }
}

/* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
function Reels() {
    var betLine = ["","",""];
    var outCome = [0, 0, 0];

    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                
                betLine[spin] = "blank";
                blanks++;
                break;
            case checkRange(outCome[spin], 28, 37): // 15.4% probability
                betLine[spin] = "grapes";
                grapes++;
                break;
            case checkRange(outCome[spin], 38, 46): // 13.8% probability
                betLine[spin] = "banana";
                bananas++;
                break;
            case checkRange(outCome[spin], 47, 54): // 12.3% probability
                betLine[spin] ="orange";
                oranges++;
                break;
            case checkRange(outCome[spin], 55, 59): //  7.7% probability
                betLine[spin] = "cherry";
                cherries++;
                break;
            case checkRange(outCome[spin], 60, 62): //  4.6% probability
                betLine[spin] = "bar";
                bars++;
                break;
            case checkRange(outCome[spin], 63, 64): //  3.1% probability
                betLine[spin] = "bell";
                bells++;
                break;
            case checkRange(outCome[spin], 65, 65): //  1.5% probability
                betLine[spin] = "seven";
                sevens++;
                break;
        }
    }
    return betLine;
}

//Spin Button click events
function spinButtonClicked(event: createjs.MouseEvent)
{
    if (playerMoney == 0) {
        if (confirm("NO Money! \nPlay again?")) {
            resetAll();
        }
    }
    else if (playerBet > playerMoney) {
        alert("Not enought to play the bet");
    }
    else if (playerBet == 0)
        alert("Please select how much you want to bet");
    else if (playerBet <= playerMoney) {
        playerMoney = playerMoney - playerBet;
        playerMoneySet = playerMoney;
        spinResult = Reels();
        switch (spinResult[0]) {
            case "blank":
                reel0 = new createjs.Bitmap(assets.getResult("blank"));
                reel0.x = 53;
                reel0.y = 180;
                stage.addChild(reel0);
                break;
            case "grapes":
                reel0 = new createjs.Bitmap(assets.getResult("grapes"));
                reel0.x = 53;
                reel0.y = 180;
                stage.addChild(reel0);
                break;
            case "banana":
                reel0 = new createjs.Bitmap(assets.getResult("banana"));
                reel0.x = 53;
                reel0.y = 180;
                stage.addChild(reel0);
                break;
            case "orange":
                reel0 = new createjs.Bitmap(assets.getResult("orange"));
                reel0.x = 53;
                reel0.y = 180;
                stage.addChild(reel0);
                break;
            case "cherry":
                reel0 = new createjs.Bitmap(assets.getResult("cherry"));
                reel0.x = 53;
                reel0.y = 180;
                stage.addChild(reel0);
                break;
            case "bar":
                reel0 = new createjs.Bitmap(assets.getResult("bar"));
                reel0.x = 53;
                reel0.y = 180;
                stage.addChild(reel0);
                break;
            case "bell":
                reel0 = new createjs.Bitmap(assets.getResult("bell"));
                reel0.x = 53;
                reel0.y = 180;
                stage.addChild(reel0);
                break;
            case "seven":
                reel0 = new createjs.Bitmap(assets.getResult("seven"));
                reel0.x = 53;
                reel0.y = 180;
                stage.addChild(reel0);
                break;
            
        }
        switch (spinResult[1]) {
            case "blank":
                reel1 = new createjs.Bitmap(assets.getResult("blank"));
                reel1.x = 129;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "grapes":
                reel1 = new createjs.Bitmap(assets.getResult("grapes"));
                reel1.x = 129;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "banana":
                reel1 = new createjs.Bitmap(assets.getResult("banana"));
                reel1.x = 129;
                reel1.y = 180;
                stage.addChild(reel1);
                break;          
            case "orange":
                reel1 = new createjs.Bitmap(assets.getResult("orange"));
                reel1.x = 129;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "cherry":
                reel1 = new createjs.Bitmap(assets.getResult("cherry"));
                reel1.x = 129;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "bar":
                reel1 = new createjs.Bitmap(assets.getResult("bar"));
                reel1.x = 129;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "bell":
                reel1 = new createjs.Bitmap(assets.getResult("bell"));
                reel1.x = 129;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "seven":
                reel1 = new createjs.Bitmap(assets.getResult("seven"));
                reel1.x = 129;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
           
        }
        switch (spinResult[2]) {
            case "blank":
                reel2 = new createjs.Bitmap(assets.getResult("blank"));
                reel2.x = 204;
                reel2.y = 180;
                stage.addChild(reel2);
                break;
            case "grapes":
                reel2 = new createjs.Bitmap(assets.getResult("grapes"));
                reel2.x = 204;
                reel2.y = 180;
                stage.addChild(reel2);
                break;
            case "banana":
                reel2 = new createjs.Bitmap(assets.getResult("banana"));
                reel2.x = 204;
                reel2.y = 180;
                stage.addChild(reel2);
                break;          
            case "orange":
                reel2 = new createjs.Bitmap(assets.getResult("orange"));
                reel2.x = 204;
                reel2.y = 180;
                stage.addChild(reel2);
                break;
            case "cherry":
                reel2 = new createjs.Bitmap(assets.getResult("cherry"));
                reel2.x = 204;
                reel2.y = 180;
                stage.addChild(reel2);
                break;
            case "bar":
                reel2 = new createjs.Bitmap(assets.getResult("bar"));
                reel2.x = 204;
                reel2.y = 180;
                stage.addChild(reel2);
                break;
            case "bell":
                reel2 = new createjs.Bitmap(assets.getResult("bell"));
                reel2.x = 204;
                reel2.y = 180;
                stage.addChild(reel2);
                break;
            case "seven":
                reel2 = new createjs.Bitmap(assets.getResult("seven"));
                reel2.x = 204;
                reel2.y = 180;
                stage.addChild(reel2);
                break;       
        }
       // determineWinnings();
        UpdatePlayerMoney();
    }
}

//reset button click events
function resetAll() {
    playerMoney = 1000;
    win = 0;
    jackpot = 5000;
    turn = 0;
    playerBet = 0;
    stage.removeChild(playerBetAmt);
    stage.removeChild(playerCreditAmt);
    playerCreditAmt = new createjs.Text("" + playerMoney, "20px Consolas", "#D31515");
    playerCreditAmt.x = 43;
    playerCreditAmt.y = 303;
    stage.addChild(playerCreditAmt);

}


function resetFruit() {
    grapes = 0;
    bananas = 0;
    oranges = 0;
    cherries = 0;
    bars = 0;
    bells = 0;
    sevens = 0;
    blanks = 0;
}

function betOne()
{
    stage.removeChild(playerBetAmt);  
    playerBet = 1;
    //added playerbetAmt  
    playerBetAmt = new createjs.Text(""+playerBet, "20px Consolas", "#D31515");
    playerBetAmt.x = 149;
    playerBetAmt.y = 302;
    stage.addChild(playerBetAmt);
    if (playerMoney >= 1) {
        playerBet = 1;
        playerMoneySet = playerMoney - 1;
    }
    else {
        alert("No money to play");
    }
    UpdatePlayerMoney();
    
}


function betTen() {
    stage.removeChild(playerBetAmt);  
    playerBet = 10; 
    playerBetAmt = new createjs.Text(""+playerBet, "20px Consolas", "#D31515");
    playerBetAmt.x = 149;
    playerBetAmt.y = 302;
    stage.addChild(playerBetAmt);
    if (playerMoney >= 10) {
        playerBet = 10;
        playerMoneySet = playerMoney - 10;
    }
    else {
        alert("No money to play");
    }
    UpdatePlayerMoney();
    
}

function betMax() {
    stage.removeChild(playerBetAmt);  

    //added playerbetAmt++++++++++++++++++++++++++++  
    playerBetAmt = new createjs.Text(" " +playerMoney, "20px Consolas", "#D31515");
    playerBetAmt.x = 138;
    playerBetAmt.y = 302;
    stage.addChild(playerBetAmt);
    if (playerMoney != 0) {
        playerBet = playerMoney;
        playerMoneySet = 0;
    }
    else {
        if (confirm("You balance is nill! \nPlay Again?")) {
            resetAll();
        }
    }
    UpdatePlayerMoney();
}



function determineWinnings() {
    if (blanks == 0) {
        if (grapes == 3) {
            win = playerBet * 10;
        }
        else if (bananas == 3) {
            win = playerBet * 20;
        }
        else if (oranges == 3) {
            win = playerBet * 30;
        }
        else if (cherries == 3) {
            win = playerBet * 40;
        }
        else if (bars == 3) {
            win = playerBet * 50;
        }
        else if (bells == 3) {
            win = playerBet * 75;
        }
        else if (sevens == 3) {
            win = playerBet * 100;
        }
        else if (grapes == 2) {
            win = playerBet * 2;
        }
        else if (bananas == 2) {
            win = playerBet * 2;
        }
        else if (oranges == 2) {
            win = playerBet * 3;
        }
        else if (cherries == 2) {
            win = playerBet * 4;
        }
        else if (bars == 2) {
            win = playerBet * 5;
        }
        else if (bells == 2) {
            win = playerBet * 10;
        }
        else if (sevens == 2) {
            win = playerBet * 20;
        }
        else if (sevens == 1) {
            win = playerBet * 5;
        }
        else {
            win = playerBet * 1;
        }
        WinMessage();
    }
    else {
        LostMessage();
    }
}

//Lost result+++++++++++++++++++++++++++++++++++++++
function LostMessage() {
    stage.removeChild(result);
    result = new objects.Label("Lost", 243, 303, false);
    stage.addChild(result);
    UpdatePlayerMoney();
    resetFruit();
}

//win result+++++++++++++++++++++++++++++++++++++
function WinMessage() {
    stage.removeChild(result);
    playerMoney += win;
    playerMoneySet = playerMoney;
    result = new objects.Label("$ " +win, 247, 303, false);
    stage.addChild(result);
    resetFruit();
    UpdatePlayerMoney();
}

function UpdatePlayerMoney() {   
    stage.removeChild(playerCreditAmt); 
    playerCreditAmt = new objects.Label("" + playerMoneySet, 43, 303, false);
    stage.addChild(playerCreditAmt);
}

//Our main function
function main() {
   //add in slot machine graphics
    background = new createjs.Bitmap(assets.getResult("background"));
    stage.addChild(background);

    //add jackpotLabel 
    jackpotAmt = new createjs.Text("5000", "20px Consolas", "#D31515");
    jackpotAmt.x = 140;
    jackpotAmt.y = 93; 
    stage.addChild(jackpotAmt);

    //add playerCreditAmtLabel 
    playerCreditAmt = new createjs.Text(""+(playerMoney-playerBet), "20px Consolas", "#D31515");
    playerCreditAmt.x = 43;
    playerCreditAmt.y = 303;
    stage.addChild(playerCreditAmt);

    //add in blankSymbol Graphics
    blank = new createjs.Bitmap(assets.getResult("blank"));
    stage.addChild(blank);

    //add spinButton Sprite
    spinButton = new objects.Button("spinButton", 252, 334, false);
    stage.addChild(spinButton);
    spinButton.on("click", spinButtonClicked, this);

    //add resetButton Sprite
    resetButton = new objects.Button("resetButton", 16, 334, false);
    stage.addChild(resetButton);
    resetButton.on("click", resetAll, this);

    //add betOneButton Sprite
    betOneButton = new objects.Button("betOneButton", 75, 334, false);
    stage.addChild(betOneButton);
    betOneButton.on("click", betOne, this);

    //add bettenButton Sprite
    betTenButton = new objects.Button("betTenButton", 135, 334, false);
    stage.addChild(betTenButton);
    betTenButton.on("click", betTen, this);

    //add betMaxButton Sprite
    betMaxButton = new objects.Button("betMaxButton", 196, 334, false);
    stage.addChild(betMaxButton);
    betMaxButton.on("click", betMax,this);
}