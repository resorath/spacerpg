// Structure
var stage;
var canvas;

// Player
var player = {
    image: new Image(),
    ship: new Object(),
    hitpoints: 20,
    mana: 20,
    speed: 2000,
    ready: false
}

var boss = {
    image: new Image(),
    ship: new Object(),
    hitpoints: 100,
    mana: 20,
    speed: 4000
}

var chrome = {
    gfxLoaded: 0
}

var game = {
    tkr: new Object,
    timerSource: null,
    menu: null,
    menuselected: 0
}

var keys = {
    ENTER: 13,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
}

var menu = {
    main: {
        Attack: function() { console.log("Attack!"); },
        Special: function() { console.log("Special!"); },
        Evade: function() { console.log("Evade!"); },
        Withdraw: function() { console.log("Withdraw!"); }
    },
}


function Main() {

	stage = new createjs.Stage("battle");

	//stage.mouseEventsEnabled = true;

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

    ps = new Image();
    ps.src = 'img/playership.png';
    ps.name = 'playership';
    ps.onload = function(e) {
        player.ship = new createjs.Bitmap(ps);
        checkGfx();
    }


	createjs.Ticker.setFPS(30); 
	createjs.Ticker.addEventListener("tick", stage);

    //window.onkeyup = keyUpHandler;
    window.onkeydown = keyDownHandler;

}

function checkGfx() 
{     
    chrome.gfxLoaded++;
      
    if(chrome.gfxLoaded == 2) 
    { 
        addGameView(); 
    } 

}

function addGameView() 
{ 
    player.ship.x = 40;
    player.ship.y = 200;

    /* Bottom Interface */
    stage.addChild(chrome.background, player.ship);

    createjs.Tween.get(player.ship, {loop: true})
        .to({y: player.ship.y+10}, 1000)
        .to({y: player.ship.y}, 1000);


    drawInterface();

    game.menu = menu.main;

    stage.update();

    startGame();
      
}

function keyDownHandler(e)
{
    if(game.menu == null)
        return;

    switch(e.keyCode)
    {
        case keys.ENTER:
            game.commitMenu();
            break;
        case keys.DOWN: 
            game.moveMenuDown(); 
            break;
        case keys.UP: 
            game.moveMenuUp(); 
            break;
    }

}

game.commitMenu = function() {

    if(!player.ready)
        return;

    game.menu[Object.keys(game.menu)[game.menuselected]]();

    playerTurnEnd();

}

game.moveMenuUp = function() {

    if(!player.ready)

    if(game.menu == null)
        return;

    if(game.menuselected <= 0)
        return;

    chrome.selector.y -= 30;
    game.menuselected--;

}

game.moveMenuDown = function() {

    if(!player.ready)

    if(game.menu == null)
        return;

    if(game.menuselected >= Object.keys(game.menu).length - 1)
        return;

    game.menuselected++;

    chrome.selector.y += 30;

}

function drawInterface()
{
    chrome.mainMenuRect = createMenuRect(20, 400, 760, 180);
    chrome.hitpointsText = createText(player.hitpoints + " HP", 500, 500);
    chrome.manapointsText = createText(player.hitpoints + " MP", 500, 530);

    chrome.attackText = createText("Attack", 70, 430);
    chrome.specialText = createText("Special", 70, 460);
    chrome.evadeText = createText("Evade", 70, 490);
    chrome.withdrawText = createText("Withdraw", 70, 520);

    chrome.selector = createSelector(55, 440);

    stage.addChild(chrome.mainMenuRect, chrome.hitpointsText, chrome.manapointsText, chrome.attackText, chrome.specialText, chrome.evadeText, chrome.withdrawText);

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

function createMenuRect(x, y, width, height)
{
    r = new createjs.Graphics();
    r.setStrokeStyle(10);
    r.beginStroke('#0033BB');
    r.beginFill('#00AAFF');
    r.drawRect(x, y, width, height);
    r.endFill();    
    return new createjs.Shape(r);
}

function createSelector(x, y)
{
    r = new createjs.Shape();
    r.graphics.beginStroke("#FFFFFF");
    r.graphics.beginFill("#FFFFFF");
    r.graphics.moveTo(x, y).lineTo(x-20, y-10).lineTo(x-20, y+10).lineTo(x, y);
    return r;
}

function createTimerRect(x, y)
{
    bar = new createjs.Shape() 
        .set({x, y});
    stage.addChild(bar);

    bar.graphics.setStrokeStyle(2)
        .beginStroke("#FFFFFF")
        .drawRect(-1, -1, 302, 32)
        .endStroke();

    bar.graphics.beginFill("#FFFFFF")

    c =  bar.graphics.drawRect(0,0,03).command;

    createjs.Tween.get(c).to({w:300}, 3000, createjs.Ease.quadIn).call(function() {});

    return bar;
}

function startPlayerTurnTimer()
{
    stage.removeChild(player.timerBar);

    player.timerBar = createTimerRect(400, 420);

    player.turnTimer = window.setTimeout(playerTurnReady, player.speed);

    player.timerBarInterior = bar.graphics.drawRect(0,0,0,30).command;

    createjs.Tween.get(player.timerBarInterior)
      .to({w:300}, player.speed, createjs.Ease.quadIn);

}

function playerTurnReady()
{
    console.log("READY!");
    player.ready = true;

    stage.addChild(chrome.selector)
}

function playerTurnEnd()
{
    console.log("DONE!");
    player.ready = false; 

    stage.removeChild(chrome.selector);

    startPlayerTurnTimer();
}

function startGame()
{
    //stage.on("stagemousemove", moveShip); 
    //stage.on("stagemousedown", shoot)
      
    createjs.Ticker.addEventListener("tick", update); 

    startPlayerTurnTimer();
}

function update() {



}
