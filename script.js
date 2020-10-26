////////////////////////////////////// GAME TITLE ////////////////////////
//OSI = OSIRIS THE SHIP
//W = WIDTH && H = HEIGHT && POS = POSITION
document.getElementById('startGame').addEventListener('click',function startGame(){


    //Removes image after click 
    var parent = document.getElementById('Parent')
    var child = document.getElementById('startGame')
    parent.removeChild(child)
    
    
    
    ////////////////////////////////////////////////////// GAME START ////////////////////////
    var canvas = document.getElementById('myCanvas');
    var healthBar = document.getElementById('healthGreen')
    var HUD = document.getElementById('scoreBoard')
    var ctx = canvas.getContext('2d');
    window.addEventListener('click', (e) => {
        // console.log(e, "event")
        // console.log(osi.x, osi.y, "x y osi")
        bulletFire(getCursorPosition(canvas, e));
    });
    
    
    
    
    ///////////////////////////////// GLOBAL INFORMATION /////////////////////////////////////////////
    var enemies = [];
    var allEnemies = [];
    var numOfEnemies = 100; 
    var host;
    var swarmSpeed = 4;
    var swarmSize = 2;
    var hostSpeed = .6;
    var pause = false;
    var score = 0;
    var time = 120;
    var waveNum = 1;
    var bullets = []
    
    var osi = {
        x : canvas.width/2,
        y : canvas.height-40,
        initY: null,
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
        diameter: 4,
        speed: 2,
        difference: null,
        slope: null,
        dest: null,
        // counter: null
    }
    var enemy = {
        x : canvas.width/2,
        y : 20,
        up : false,
        left : false,
        right : false,
        down : false,
        diameter : 2.5,
    }
    
    // ->
    // Difference 
    
    /// if there is a click run below 
    
    
    ///////////////////////////////// START TO DRAW ON SCREEN  /////////////////////////////////////////////
    
    //draws scoreboard
    function updateHUD(){
        HUD.innerText = 'Score: ' + score + '\n' + ' H.P: ' + osi.health +  '\n' + 'Enemeis: ' + enemies.length + '\n' + 'Time Left: ' + time + 's' ; 
    
    }
    //make bullet
    function drawBullet(currentBullet){
        ctx.beginPath();
        ctx.arc(currentBullet.x,currentBullet.y,currentBullet.diameter,0,Math.PI*2);
        ctx.fillStyle = `#FFFFFF`;
        ctx.fill();
        ctx.closePath();
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
            ctx.fillStyle ="red"
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
                osi.health -= 1.5
                healthBar.style.width = `${osi.health}px` 
                
                //score++
                deleteEnemy(currentEnemy)
                //invoke delete enemy 
            }
        }
    }
    
    
    function bulletContact(){
        //loop over all bullets and check curent enemy for impact
        if(bullets.length > 0){
            for(var bullet of bullets){
                for(let i = 0; i < allEnemies.length; i++){
                    var curEnemy = allEnemies[i];
    /// bullet.x ==  is the location of the bullet on an X value  (bullet.diameter/2); == the radius of the bullet 
                    var bulletRX = bullet.x + (bullet.diameter/2);
                    var bulletLX = bullet.x - (bullet.diameter/2);
                    var bulletTY = bullet.y - (bullet.diameter/2);
                    var bulletBY = bullet.y + (bullet.diameter/2);
    
                    var enemyRX = curEnemy.x + (enemy.diameter/2);
                    var enemyLX = curEnemy.x - (enemy.diameter/2);
                    var enemyTY = curEnemy.y - (enemy.diameter/2);
                    var enemyBY = curEnemy.y + (enemy.diameter/2);
                    
                    if(
                        enemyRX >= bulletLX && enemyRX <= bulletRX && enemyTY >= bulletTY && enemyTY <= bulletBY ||
                        enemyLX >= bulletLX && enemyLX <= bulletRX && enemyTY >= bulletTY && enemyTY <= bulletBY ||
    
                        enemyRX >= bulletLX && enemyRX <= bulletRX && enemyBY <= bulletBY && enemyBY >= bulletTY ||
                        enemyLX >= bulletLX && enemyLX <= bulletRX && enemyBY <= bulletBY && enemyBY >= bulletTY
    
                    ){
                        console.log("hit")
                        if(curEnemy.host){
                            deleteEnemy(curEnemy.host);
                        }
    
                        deleteEnemy(curEnemy);
                        deleteBullets(bullet);
                        score++
                        return true;
                        //invoke delete enemy 
                    }
                }
            }
        }
    }
    
    
    //moves Host to new enemy on Host Death
    function deleteEnemy(currentEnemy){
        if(enemies){
            enemies.splice(enemies.indexOf(currentEnemy),1)
            if(currentEnemy.host){
                currentEnemy.host = false
                enemies.length > 0 ? enemies[0].host = true : null
                host = enemies[0]
            }
        }   
    }
    
    
    //SPWAN IN ENEMIES 
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
            allEnemies.push(currentEnemy, numOfEnemies)
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
    function bulletFire(cursorPosition){ 
        var curBullet = {...bullet};
        curBullet.x = osi.x;
        curBullet.y = osi.y;
        curBullet.initY = osi.y;
        // console.log(dir[0], "TARGET")
        curBullet.dest = cursorPosition;
        curBullet.difference = [curBullet.x - cursorPosition[0], curBullet.y - cursorPosition[1]];
        // change in y divided by change in x
        curBullet.slope = curBullet.difference[1] / curBullet.difference[0];
        // curBullet.counter = [...curBullet.difference];
        bullets.push(curBullet);
    }
    /// STACK OVERFLOW ----------- slightly modified
    function getCursorPosition(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        // console.log("x: " + x + " y: " + y)
        return [x, y];
    }
    /// --------------------------------------------
    
    function moveBullet(curBullet){
        // If y is less than 0 we are going down - we need to add to y till reaching destination
        // If x is less than 0 we are going right - we need to add to x till reacing destination
    
        // I NEED TO CALCULATE THE SLOPE!
        // change in y divided by change in x;
        // console.log(curBullet, "here")
    
        // how do I keep the Y value from being only the speed and the x value from being relative to that
        if(curBullet.difference[0] < 0){
            curBullet.x += curBullet.speed;
            curBullet.y += (curBullet.speed * curBullet.slope);
            
        } else if (curBullet.difference[0] > 0 /* && !(curBullet.counter[0] === curBullet.dest[0]) */) {
            curBullet.x -= curBullet.speed;
            curBullet.y -= (curBullet.speed * curBullet.slope);
        }
    
        // if(curBullet.difference[1] < 0 && !(curBullet.counter[1] === curBullet.dest[1])){
        //     curBullet.counter[1] += curBullet.speed;
        //     curBullet.y += curBullet.speed;
        // } else if (curBullet.difference[1] > 0 && !(curBullet.counter[1] === curBullet.dest[1])) {
        //     curBullet.counter[1] -= curBullet.speed;
        //     curBullet.y -= curBullet.speed;
        // }
    }
    //drawing bullets on screeen and moving 
    function drawAllBullets(){
        for(let i = 0; i < bullets.length; i++){
            var currentBullet = bullets[i];
            // console.log(currentBullet, "cur")
            // currentBullet.y -= bullet.speed;
            moveBullet(currentBullet)
            // Here get closer to dest instead of y
            drawBullet(currentBullet);
        }
    }
    
    function deleteBullets(bullet){
        if(bullet){
            bullets.splice(bullets.indexOf(bullet), 1);
        }
        if(bullets.length > 0){
            bullets[bullets.length-1].y <= 0 || bullets[bullets.length-1].x <= 0 || 
            bullets[bullets.length-1].x >= canvas.width || bullets[bullets.length-1].y >= canvas.height ? bullets.pop() : null
        }
    }
    
    //if health reaches zero GAME OVER
    function gameover(){
        if( osi.health <= 0 || time === 0)
        alert('YOUR SHIP WAS DESTROYED')
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
    
        // UNCOMMENT CODE TO PAUSE WHEN THERE IS A COLLISION 
        var contact = bulletContact();
        // if(contact){
        //     console.log('HIT!')
        //     pause = !pause
        //     return
        // }
        deleteBullets();
    } 
    
    function countDown(){
        // Decrement the time variable by 1
        time--
        moreEnemies();
    }
    
    // 300 seconds in 5 minutes which is our run time 
    // 1 second = 1000 miliseconds setIntervals are run every milisecond
    setInterval(countDown, 1000);
    setInterval(draw, 1)
    })
    // startGame();