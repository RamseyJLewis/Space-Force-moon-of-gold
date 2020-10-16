//OSI = OSIRIS THE SHIP
//W = WIDTH && H = HEIGHT && POS = POSITION

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var enemies = [];
var host;

var osi = {
    x : canvas.width/2,
    y : canvas.height-40,
    up : false,
    left : false,
    right : false,
    down : false,
    width : 100,
    height : 20,
    
}
var  enemy = {
    x : canvas.width/2,
    y : 20,
    up : false,
    left : false,
    right : false,
    down : false,
    height : 3,
    width : 2,
}
function drawOsiris(){ 
    ctx.beginPath();
    ctx.arc(osi.x,osi.y,osi.height,0,Math.PI*2);
    ctx.fillStyle = "#1EA0FF";
    ctx.fill();
    ctx.closePath()  
}
function drawEnemy(obj){
    ctx.beginPath();
    ctx.arc(obj.x,obj.y,enemy.height,0,Math.PI*2);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath() 
}
function hostChaseOsi(){
    for(let i = 0; i < enemies.length; i++){
        let currentEnemy = enemies[i];
    
        drawEnemy(currentEnemy);
        if(currentEnemy.host && currentEnemy.x > osi.x){
            host.x --
        }else   if(currentEnemy.host && currentEnemy.x < osi.x){
            host.x ++
        }
        if(currentEnemy.host && currentEnemy.y> osi.y){
            host.y--
        }else   if(currentEnemy.host && currentEnemy.y< osi.y){
            host.y++
        }
    }
}

function swarm(){
    for(let i = 0; i < enemies.length; i++){
        let currentEnemy = enemies[i];
        drawEnemy(currentEnemy);
    if(!currentEnemy.host){
        if(host.x > currentEnemy.x){
            currentEnemy.x ++   
        }else if (host.x <currentEnemy.x){
            currentEnemy.x --   
        }  if(host.y > currentEnemy.y){
            currentEnemy.y ++   
        }else if (host.y < currentEnemy.y){
                    currentEnemy.y --   
                //attempt to create orbit
            }   if(host.x == currentEnemy.x){
                currentEnemy.x --   
            }else if (host.x == currentEnemy.x){
                currentEnemy.x ++
            }  if(host.y == currentEnemy.y){
                currentEnemy.y --  
            }else if (host.y ==  currentEnemy.y){
                currentEnemy.y ++   
            }
            //get location of curent enemy
            //reduce distance between the two( ONLY CHANGING ENEMY LOCATION NOT HOST)
        }
    }
}


(function (){ 
    let locationX = 20 
    let locationY = 20 
    
    for(let i = 0; i < 100; i++){
        //Amount of enemeis
        if(locationX > canvas.width -60){
            locationX = 20
            locationY += 20
        } 
        locationX += 20;
        let currentEnemy = {};
        currentEnemy.x = locationX;
        currentEnemy.y = locationY;
        currentEnemy.alive = true;
        currentEnemy.host = false;
        if(i==25){
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
        osi.y -= 1  
    }
    //left out '0'
    if(osi.left && osi.x >= 20){
        osi.x -= 1
        
    }
    //right out 1000
    if(osi.right && osi.x <= 980){
        osi.x += 1      
    }
    // down out zero
    if(osi.down && osi.y <= 780){
        osi.y += 1
    }
}
window.onkeydown = (event) => { 
    if(event.key == 'w' ){ 
        osi.up = true
    }
    if(event.key == 'a' ){
        osi.left = true
    }
    if(event.key == 'd' ){
        osi.right = true
    }
    if(event.key == 's' ){
        osi.down = true
    }
}

window.onkeyup = (event) => { 
    if(event.key == 'w'){ 
        osi.up = false
    }
    if(event.key == 'a'){
        osi.left = false
    }
    if(event.key == 'd' ){
        osi.right = false
    }
    if(event.key == 's'){
        osi.down = false
    }
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    osiMove();
    hostChaseOsi();
    drawOsiris();
    swarm()
}
setInterval(draw, 1)


