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
    sprite: new Image(),
    animation: {},
    ship: new Object(),
    hitpoints: 100,
    mana: 20,
    speed: 1000,
    attacks: {
        dragonbreath: 
        {
            special: false,
            speed: 3000,
            projectiles: new createjs.Container()
        },
        deepbreath: 
        {
            special: true,
            text: "Deep Breath",
            speed: 5000,
            cooldown: 15000,
            projectiles: new createjs.Container()
        },
        rewind: 
        {
            special: true,
            text: "Rewind",
            speed: 4000,
            cooldown: 25000,
            projectiles: new createjs.Container()
        }

    }
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
        Attack: function() { console.log("Attack!"); player.speed = 2000; },
        Special: function() { console.log("Special!"); player.speed = 5000; },
        Evade: function() { console.log("Evade!"); player.speed = 1500; },
        Withdraw: function() { console.log("Withdraw!"); player.speed = 2000;}
    },
}


function Main() {

	stage = new createjs.Stage("battle");

	//stage.mouseEventsEnabled = true;

	createjs.Sound.registerSound('sound/boss.wav', 'boss', 1), 
    createjs.Sound.registerSound('sound/explo.wav', 'explo', 10), 
    createjs.Sound.registerSound('sound/shot.wav', 'shot', 10), 
    createjs.Sound.registerSound('sound/kaching.wav', 'turnReady', 1);
    createjs.Sound.registerSound('sound/sthip.wav', 'menuBlip', 1);
    createjs.Sound.registerSound('sound/bring.wav', 'menuConfirm', 1);

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

    var dragonsprite = {
        images: ['img/dragon.png'],
        frames: [
            [439,144,190,144],
            [625,154,184,137],
            [806,164,187,141]
        ],
        animations: {
            fly: [0, 2]
        },
        framerate: 4
    };

    var dragonspritess = new createjs.SpriteSheet(dragonsprite);
    boss.sprite = new createjs.Sprite(dragonspritess);

    checkGfx();

    boss.attacks.dragonbreath.image = new Image();
    boss.attacks.dragonbreath.image.src = "img/bullet.png";
    boss.attacks.dragonbreath.image.name = "dragonbreath";
    boss.attacks.dragonbreath.image.onload = checkGfx();


	createjs.Ticker.setFPS(30); 
	createjs.Ticker.addEventListener("tick", stage);

    //window.onkeyup = keyUpHandler;
    window.onkeydown = keyDownHandler;

}

function checkGfx() 
{     
    chrome.gfxLoaded++;
      
    if(chrome.gfxLoaded == 4) 
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

    boss.sprite.x = 740;
    boss.sprite.y = 150;
    boss.sprite.scaleX = -1.3;
    boss.sprite.scaleY = 1.3;

    boss.sprite.gotoAndPlay("fly");

    stage.addChild(boss.sprite, boss.attacks.dragonbreath.projectiles, boss.attacks.deepbreath.projectiles, boss.attacks.rewind.projectiles);

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

    createjs.Sound.play('menuConfirm');

    game.menu[Object.keys(game.menu)[game.menuselected]]();

    playerTurnEnd();

}

game.moveMenuUp = function() {

    if(!player.ready)

    if(game.menu == null)
        return;

    if(game.menuselected <= 0)
        return;

    createjs.Sound.play('menuBlip');

    chrome.selector.y -= 30;
    game.menuselected--;

}

game.moveMenuDown = function() {

    if(!player.ready)

    if(game.menu == null)
        return;

    if(game.menuselected >= Object.keys(game.menu).length - 1)
        return;

    createjs.Sound.play('menuBlip');

    game.menuselected++;

    chrome.selector.y += 30;

}

function drawInterface()
{
    chrome.mainMenuRect = createMenuRect(20, 400, 760, 180);
    chrome.hitpointsText = createText(player.hitpoints + " HP", 500, 500);
    chrome.manapointsText = createText(player.mana + " MP", 500, 530);

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

function Timer(callback, delay) {
    var timerId, start, remaining = delay;

    this.pause = function() {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
    };

    this.resume = function() {
        start = new Date();
        window.clearTimeout(timerId);
        timerId = window.setTimeout(callback, remaining);
    };

    this.resume();
}

function startPlayerTurnTimer()
{
    stage.removeChild(player.timerBar);

    player.timerBar = createTimerRect(400, 420);

    player.turnTimer = new Timer(playerTurnReady, player.speed);

    // resume boss turn
    boss.turnTimer.resume();

    player.timerBarInterior = bar.graphics.drawRect(0,0,0,30).command;

    createjs.Tween.get(player.timerBarInterior)
      .to({w:300}, player.speed, createjs.Ease.quadIn);

}

function startBossTurnTimer()
{
    boss.turnTimer = new Timer(bossTurnReady, boss.speed);
}

function bossTurnReady()
{
    // boss turn
    console.log("Rawr boss turn");

    // should pick an attack? only shoot fireballs for now
    var b = new createjs.Bitmap(boss.attacks.dragonbreath.image);
    b.x = boss.sprite.x - 220;
    b.y = boss.sprite.y + 45;


    boss.attacks.dragonbreath.projectiles.addChild(b);

    stage.update();

    createjs.Sound.play('shot');

    startBossTurnTimer();
}

function playerTurnReady()
{
    console.log("READY!");
    createjs.Sound.play('turnReady');
    player.ready = true;

    // pause boss turn timer
    boss.turnTimer.pause();

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

    startBossTurnTimer();
    startPlayerTurnTimer();
}

function update(e) {

    // move attacks
    for(var i = 0; i < boss.attacks.dragonbreath.projectiles.children.length; i++)
    {
        boss.attacks.dragonbreath.projectiles.children[i].x -= 10;

        if(boss.attacks.dragonbreath.projectiles.children[i].x < player.ship.x + 200)
        {
            boss.attacks.dragonbreath.projectiles.removeChildAt(i);

            createjs.Sound.play('explo');
            player.hitpoints -= 1;
            drawInterface();
        }
    }

}
