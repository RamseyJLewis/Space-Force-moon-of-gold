//OSI = OSIRIS THE SHIP
//W = WIDTH && H = HEIGHT && POS = POSITION

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var enemies = [];
var host;

var osi = {
    posW : canvas.width/2,
    posH : canvas.height-40,
    up : false,
    left : false,
    right : false,
    down : false,
    height : 20,
}
var  enemy = {
    posW : canvas.width/2,
    posH : 20,
    up : false,
    left : false,
    right : false,
    down : false,
    height : 5,
}
function drawOsiris(){ 
    ctx.beginPath();
    ctx.arc(osi.posW,osi.posH,osi.height,0,Math.PI*2);
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
function updateEnemies(){
    for(let i = 0; i < enemies.length; i++){
        let currentEnemy = enemies[i];
        console.log(currentEnemy);
        drawEnemy(currentEnemy);
        if(currentEnemy.host && currentEnemy.x > osi.posW){
            host.x --
        }else   if(currentEnemy.host && currentEnemy.x < osi.posW){
            host.x ++
        }
        if(currentEnemy.host && currentEnemy.y> osi.posH){
            host.y--
        }else   if(currentEnemy.host && currentEnemy.y< osi.posH){
            host.y++
        }
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
            // }   if(host.x == currentEnemy.x){
            //     currentEnemy.x --   
            // }else if (host.x == currentEnemy.x){
            //     currentEnemy.x ++
            // }  if(host.y == currentEnemy.y){
            //     currentEnemy.y --  
            // }else if (host.y ==  currentEnemy.y){
            //     currentEnemy.y ++   
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
            currentEnemy.host = true;
            host = currentEnemy;
        }
        drawEnemy(currentEnemy);
        enemies.push(currentEnemy)
    }
}())

window.onkeydown = (event) => { 
    console.log(event.key)
    if(event.key == 'w' ||event.key == 'W'){ 
        osi.up = true
    }
    if(event.key == 'a' ||event.key == 'A'){
        osi.left = true
    }
    if(event.key == 'd' ||event.key == 'D'){
        osi.right = true
    }
    if(event.key == 's' ||event.key == 'S'){
        osi.down = true
    }
}

window.onkeyup = (event) => { 
    console.log(event.key)
    if(event.key == 'w' ||event.key == 'W'){ 
        osi.up = false
    }
    if(event.key == 'a' ||event.key == 'A'){
        osi.left = false
    }
    if(event.key == 'd' ||event.key == 'D'){
        osi.right = false
    }
    if(event.key == 's' ||event.key == 'S'){
        osi.down = false
    }
}
function osiMove(){
    if(osi.up){
        osi.posH -= 1  
    }
    if(osi.left){
        osi.posW -= 1
    }
    if(osi.right){
        osi.posW += 1
    }
    if(osi.down){
        osi.posH += 1
    }
} 
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    osiMove();
    updateEnemies();
    drawOsiris();
}
setInterval(draw, 1)


