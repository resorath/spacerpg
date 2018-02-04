// Structure
var stage;
var canvas;

// Player
var player = {
    image: new Image(),
    ship: new Object(),
    hitpoints: 20,
    mana: 20,
}

var boss = {
    image: new Image(),
    ship: new Object(),
    hitpoints: 100,
    mana: 20,
}

var chrome = {
    gfxLoaded: 0
}

var game = {
    tkr: new Object,
    timerSource: null,
}


function Main() {

	stage = new createjs.Stage("battle");

	stage.mouseEventsEnabled = true;

	createjs.Sound.registerSound('sound/boss.wav', 'boss', 1), 
    createjs.Sound.registerSound('sound/explo.wav', 'explo', 10), 
    createjs.Sound.registerSound('sound/shot.wav', 'shot', 10), 

	/* Load GFX */
	  
	bg = new Image();
    bg.src = 'img/starfield.jpg'; 
	bg.name = 'background';
	bg.onload = function(e) { 
        chrome.background = new createjs.Bitmap(bg);
        checkGfx();
    }


	createjs.Ticker.setFPS(30); 
	createjs.Ticker.addEventListener("tick", stage);

}

function checkGfx() 
{     
    chrome.gfxLoaded++;
      
    if(chrome.gfxLoaded == 1) 
    { 
        addGameView(); 
    } 

}

function addGameView() 
{ 
    player.ship.x = 40;
    player.ship.y = 80;

    /* Bottom Interface */
      
    /* Score Text */
      
    score = new createjs.Text('0', 'bold 14px Courier New', '#FFFFFF'); 
    score.maxWidth = 1000;  //fix for Chrome 17 
    score.x = 2; 
    score.y = 460; 

    stage.addChild(chrome.background);


    drawInterface();

    stage.update();

    startGame();
      
}

function drawInterface()
{
    chrome.rectangle = new createjs.Graphics();
    chrome.rectangle.setStrokeStyle(10);
    chrome.rectangle.beginStroke('#0033BB');
    chrome.rectangle.beginFill('#00AAFF');
    chrome.rectangle.drawRect(20, 400, 760, 180);
    chrome.rectangle.endFill();

    stage.addChild(new createjs.Shape(chrome.rectangle));

    chrome.hitpointsText = createText(player.hitpoints + " HP", 500, 500);
    chrome.manapointsText = createText(player.hitpoints + " MP", 500, 530);

    stage.addChild(chrome.hitpointsText, chrome.manapointsText);

}

function createText(s, x, y)
{
    r = new createjs.Text('0', 'bold 22px Courier New', '#FFFFFF');
    r.maxWidth = 1000;
    r.x = x;
    r.y = y;
    r.text = s;

    return r;
}

function startGame()
{
    //stage.on("stagemousemove", moveShip); 
    //stage.on("stagemousedown", shoot)
      
    createjs.Ticker.addEventListener("tick", update); 
}

function update() {



}
