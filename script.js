//OSI = OSIRIS THE SHIP
//W = WIDTH && H = HEIGHT && POS = POSITION

var canvas = document.getElementById('myCanvas');
var healthBar = document.getElementById('healthBlue')
var HUD = document.getElementById('scoreBoard')
var ctx = canvas.getContext('2d');
window.addEventListener('click', bulletFire);


///////////////////////////////// GLOBAL INFORMATION /////////////////////////////////////////////
var enemies = [];
var numOfEnemies = 50; 
var host;
var swarmSpeed = 4;
var swarmSize = 2;
var hostSpeed = .5;
var highestDeath = 0;
var pause = false;
var bulletList = [];
var score = 0;
var time = 310;
var waveNum = 1;
var bullets = []

var osi = {
    x : canvas.width/2,
    y : canvas.height-40,
    up : false,
    left : false,
    right : false,
    down : false,
    diameter : 20,
    health: 800,
    move: 1,
}
var bullet = {
    x: osi.x,
    y: osi.y,
    diameter:2.5,
    speed: .5,
    color: 'gold', 
}

var  enemy = {
    x : canvas.width/2,
    y : 20,
    up : false,
    left : false,
    right : false,
    down : false,
    diameter : 2.5,
}

///////////////////////////////// START TO DRAW ON SCREEN  /////////////////////////////////////////////

//draws scoreboard
function updateHUD(){
    HUD.innerText = 'Score: ' + score + '\n' + ' H.P: ' + osi.health + '\n' + 'Time Left:' + time + 's' + '\n' + 'Enemeis' + enemies.length ; 

}

//make bullet
function drawBullet(currentBullet){
    console.log(currentBullet)
    ctx.beginPath();
    ctx.arc(currentBullet.x,currentBullet.y,currentBullet.diameter,0,Math.PI*2);
    ctx.fillStyle = `#FFFFFF`;
    ctx.fill();
    ctx.closePath()  
}
//draws player ship
function drawOsiris(){ 
    ctx.beginPath();
    ctx.arc(osi.x,osi.y,osi.diameter,0,Math.PI*2);
    ctx.fillStyle = "#5bc0be";
    ctx.fill();
    ctx.closePath()  
}
//draws enemy & host 
function drawEnemy(obj){
    ctx.beginPath();
    ctx.arc(obj.x,obj.y,enemy.diameter,0,Math.PI*2);
    ctx.fillStyle = "#b934e3";
    if (obj.host){
        ctx.fillStyle ="#b934e3"
    }
    ctx.fill();
    ctx.closePath() 
}
///////////////////////////////// FUNCTIONS OF HOW ITEMS ON SCREEN ACT /////////////////////////////////////////////
//host chases Player
function hostChaseOsi(){
    for(var i = 0; i < enemies.length; i++){
        var currentEnemy = enemies[i];
        //Enemies are pulled to Host
        drawEnemy(currentEnemy);
        if(currentEnemy.host && currentEnemy.x > osi.x){
            host.x -= hostSpeed
        }else   if(currentEnemy.host && currentEnemy.x < osi.x){
            host.x += hostSpeed
        }
        if(currentEnemy.host && currentEnemy.y> osi.y){
            host.y -= hostSpeed
        }else   if(currentEnemy.host && currentEnemy.y< osi.y){
            host.y += hostSpeed
        }
    }
}

//enemies are pulled around host based on where they are in relation to the host 
//plus a bit of randomness
function swarm(){
    for(var i = 0; i < enemies.length; i++){
        var currentEnemy = enemies[i];
        drawEnemy(currentEnemy);
        if(!currentEnemy.host){
            if(host.x > currentEnemy.x && currentEnemy.dx < swarmSize){
                currentEnemy.dx += (Math.random() * swarmSpeed/100);  
            }else if (host.x <currentEnemy.x && currentEnemy.dx > -swarmSize){
                currentEnemy.dx -= (Math.random() * swarmSpeed/100);
            }  if(host.y > currentEnemy.y && currentEnemy.dy < swarmSize){
                currentEnemy.dy += (Math.random() * swarmSpeed/100); 
            }else if (host.y < currentEnemy.y && currentEnemy.dy > -swarmSize){
                currentEnemy.dy -= (Math.random() * swarmSpeed/100);
            }
            currentEnemy.x += currentEnemy.dx
            currentEnemy.y += currentEnemy.dy
        }
        //if ship hits an enemy you destory enemy but take damage
        if(
            (currentEnemy.x + enemy.diameter/2  >= osi.x - osi.diameter/2 
            && currentEnemy.x - enemy.diameter/2 <= osi.x + osi.diameter/2)
            && (currentEnemy.y + enemy.diameter/2 >= osi.y - osi.diameter/2 
            && currentEnemy.y - enemy.diameter/2 <= osi.y + osi.diameter/2)
        ){
            osi.health-- 
            healthBar.style.width = `${osi.health}px` 
            
            score++
            deleteEnemy(currentEnemy)
            //invoke delete enemy 
        }

        //////////////////////////////////////////////////////////////// NEED TO FIX /////////////////////
        
        //loop over all bullets and check curent enemy for impact
        // for(var i = 0; i < currentBullet.length; i++){
        //     if(
        //         (currentEnemy.x + enemy.diameter/2  === currentBullet.x - currentBullet.diameter/2 
        //         && currentEnemy.x - enemy.diameter/2 === currentBullet.x + currentBullet.diameter/2)
        //         && (currentEnemy.y + enemy.diameter/2 === currentBullet.y - currentBullet.diameter/2 
        //         && currentEnemy.y - enemy.diameter/2 === currentBullet.y + currentBullet.diameter/2)
        //     ){
        //         score++
        //         deleteEnemy(currentEnemy)
        //         //invoke delete enemy 
        //     }
        // }
    }
}



//
function deleteEnemy(currentEnemy){
    enemies.splice(enemies.indexOf(currentEnemy),1)

    if(currentEnemy.host){
        currentEnemy.host = false
        enemies[0].host = true
        host = enemies[0]
    }
}
//moves Host to new enemy on Host Death
function setHost(currentEnemy){
    if(currentEnemy.host){
        for(var i = 0; i < enemies.length; i++){
            if (enemies[i]){
                enemies[i].host = true
                host = enemies[i]
                return
            }
        }
    }
}


//SWAN IN ENEMIES 
 function moreEnemies(){
    if (enemies.length <= 10 || time % 200 == 0 ){
        numOfEnemies * 1 * waveNum
        spawnWave()
    }
 }
function spawnWave(){ 
    var locationX = 240
    var locationY = 20 
    
    for(var i = 0; i < numOfEnemies; i++){
        //Amount of enemies
        if(i% 10 === 0){
            locationX = (canvas.width /2) - 50
            locationY += 20
        } 
        locationX += Math.random() * 10;
        var currentEnemy = {};
        currentEnemy.x = locationX;
        currentEnemy.y = locationY;
        currentEnemy.host = false;
        currentEnemy.dx = 0;
        currentEnemy.dy = 0;
        currentEnemy.id = i;
        if(i== enemies/5){
        // dictates Host
        currentEnemy.host = true;
        host = currentEnemy;
        }
        drawEnemy(currentEnemy);
        enemies.push(currentEnemy)
    }
}


//MOVES PLAYER // MOVES SHIP
function osiMove(){
    //up out 800
    if(osi.up && osi.y >= 20 ){
        osi.y -= osi.move
    }
    //left out '0'
    if(osi.left && osi.x >= 20){
        osi.x -= osi.move
        
    }
    //right out 1000
    if(osi.right && osi.x <= 830){
        osi.x += osi.move 
    }
    // down out zero
    if(osi.down && osi.y <= 680){
        osi.y += osi.move
    }
}

//the w,a,s,d keys are what contol your ship
//IF USER IS IN UPPPERCASE MAKE THE INPUT LOWERCASE THIS IS A FAILSAFE 
window.onkeydown = (event) => { 
    if(event.key.toLowerCase() == 'w' ){ 
        osi.up = true
    }
    if(event.key.toLowerCase() == 'a' ){
        osi.left = true
    }
    if(event.key.toLowerCase() == 'd' ){
        osi.right = true
    }
    if(event.key.toLowerCase() == 's' ){
        osi.down = true
    }
}

window.onkeyup = (event) => { 
    if(event.key.toLowerCase() == 'w'){ 
        osi.up = false
    }
    if(event.key.toLowerCase() == 'a'){
        osi.left = false
    }
    if(event.key.toLowerCase() == 'd' ){
        osi.right = false
    }
    if(event.key.toLowerCase() == 's'){
        osi.down = false
    }
    if(event.key.toLowerCase() == ' '){
        pause = !pause 
    }
}
//Making bullets
function bulletFire(){
    //console.log('shoot')    
    var currentBullet = {...bullet};
    currentBullet.x = osi.x;
    currentBullet.y = osi.y;
    bullets.push(currentBullet);
}
//drawing bullets on screeen and moving 
function drawAllBullets(){
   
    for(let i = 0; i < bullets.length; i++){
        var currentBullet = bullets[i];
        currentBullet.y--;
        drawBullet(currentBullet)

    }
}

    



//if health reaches zero GAME OVER
function gameover(){
    if( osi.health <= 0 || time === 0)
    alert('GAME OVER')
}

// RETURN FOR PAUSE FUNCTION ON SPACEBAR
function draw(){
    if(pause){
        return
    }
    //where every above function is running through
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    osiMove();
    hostChaseOsi();
    drawAllBullets();
    drawOsiris();
    swarm()
    updateHUD()
    gameover();
    
} 

function countDown(){
    // Decrement the time variable
    time--
    moreEnemies();
}


// 300 seconds in 5 minutes which is our run time 
// 1 second = 1000 miliseconds setIntervals are run every milisecond
setInterval(countDown, 1000);
setInterval(draw, 1)


