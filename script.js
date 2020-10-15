//OSI = OSIRIS THE SHIP
//W = WIDTH && H = HEIGHT && POS = POSITION

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d')

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


function drawEnemies(){ 
    let locationX = 20 
    let locationY = 20 
    for(let i = 0; i < 100; i++){
        if(locationX > canvas.width -60){
            locationX = 20
            locationY += 20
        } 
        locationX += 20;
        ctx.beginPath();
        ctx.arc(locationX,locationY,enemy.height,0,Math.PI*2);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.closePath()  
    }
}

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
    drawOsiris();
    drawEnemies();
}
setInterval(draw, 1)


