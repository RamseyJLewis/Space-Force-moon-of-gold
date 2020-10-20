//OSI = OSIRIS THE SHIP
//W = WIDTH && H = HEIGHT && POS = POSITION

var canvas = document.getElementById('myCanvas');
var healthBar = document.getElementById('healthBlue')
var ctx = canvas.getContext('2d');

var enemies = [];
var numOfEnemies = 100; 
var host;
var swarmSpeed = 2;
var swarmSize = 2;
var hostSpeed = .3;
var highestDeath = 0;
var pause = false;
//grab vale after all deaths


var osi = {
    x : canvas.width/2,
    y : canvas.height-40,
    up : false,
    left : false,
    right : false,
    down : false,
    diameter : 20,
    health: 8000,
    move: 1,
    
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
function drawOsiris(){ 
    ctx.beginPath();
    ctx.arc(osi.x,osi.y,osi.diameter,0,Math.PI*2);
    ctx.fillStyle = "#1EA0FF";
    ctx.fill();
    ctx.closePath()  
}
function drawEnemy(obj){
    ctx.beginPath();
    ctx.arc(obj.x,obj.y,enemy.diameter,0,Math.PI*2);
    ctx.fillStyle = "#FF0000";
    if (obj.host){
        ctx.fillStyle ="#00FF00"
    }
    ctx.fill();
    ctx.closePath() 
}
function hostChaseOsi(){
    for(let i = 0; i < enemies.length; i++){
        let currentEnemy = enemies[i];
    
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


function swarm(){
    for(let i = 0; i < enemies.length; i++){
        let currentEnemy = enemies[i];
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
        if((currentEnemy.x + enemy.diameter/2  >= osi.x - osi.diameter/2 && currentEnemy.x - enemy.diameter/2 <= osi.x + osi.diameter/2 )
        && (currentEnemy.y + enemy.diameter/2 >= osi.y - osi.diameter/2 && currentEnemy.y - enemy.diameter/2 <= osi.y + osi.diameter/2)){
            osi.health--
            healthBar.style.width = `${osi.health/10}px` 
            
            deleteEnemy(currentEnemy)
            //invoke delete enemy 
        
        }
    }
}
function deleteEnemy(currentEnemy){
    enemies.splice(enemies.indexOf(currentEnemy),1)

    if(currentEnemy.host){
        currentEnemy.host = false
        enemies[0].host = true
        host = enemies[0]
    }
}

function setHost(currentEnemy){
    if(currentEnemy.host){
        for(let i = 0; i < enemies.length; i++){
            if (enemies[i]){
                enemies[i].host = true
                host = enemies[i]
                return
            }
        }
    }
}

(function (){ 
    let locationX = 240
    let locationY = 20 
    
    for(let i = 0; i < numOfEnemies; i++){
        //Amount of enemies
        if(i% 10 === 0){
            locationX = (canvas.width /2) - 50
            locationY += 20
        } 
        locationX += Math.random() * 20;
        let currentEnemy = {};
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
}())
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
    if(osi.right && osi.x <= 980){
        osi.x += osi.move 
    }
    // down out zero
    if(osi.down && osi.y <= 780){
        osi.y += osi.move
    }
}
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
    if(event.key.toLowerCase() == 'p'){
        pause = !pause 
    }
}

function draw(){
    if(pause){
        return
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    osiMove();
    hostChaseOsi();
    drawOsiris();
    swarm()
}
setInterval(draw, 1)


