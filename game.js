const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let ballRadius = 10;
let dx = 2, dy = -2;
let paddleHeight = 10, paddleWidth = 75, paddleX = 0;
let rightPressed = false, leftPressed = false;
let brickRowCount = 5, brickColumnCount = 8;
let brickWidth = 75, brickHeight = 20, brickPadding = 10;
let brickOffsetTop = 30, brickOffsetLeft = 30;
let bricks = [];
let score = 0, lives = 3, level = 1;
let mode = ''; // 'classic' or 'infinite'
let x, y;
const heartImage = new Image();
heartImage.src = 'heart.png'; // Heart image for lives display

// Event listeners for paddle movement
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') rightPressed = true;
    if (e.key === 'ArrowLeft') leftPressed = true;
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') rightPressed = false;
    if (e.key === 'ArrowLeft') leftPressed = false;
});

// Initialize bricks
function initBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

// Draw bricks
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = brickOffsetLeft + c * (brickWidth + brickPadding);
                let brickY = brickOffsetTop + r * (brickHeight + brickPadding);
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.fillStyle = '#0095DD';
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

// Draw ball, paddle, score, lives
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
}

function drawPaddle() {
    ctx.fillStyle = '#0095DD';
    ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
}

function drawScore() {
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Score: ' + score, 8, 20);
}

function drawLives() {
    let heartSize = 20;
    for (let i = 0; i < lives; i++) {
        ctx.drawImage(heartImage, canvas.width - (65 + i * (heartSize + 5)), 5, heartSize, heartSize);
    }
}

function drawLevel() {
    if (mode === 'infinite') {
        ctx.fillStyle = '#0095DD';
        ctx.fillText('Level: ' + level, canvas.width / 2 - 30, 20);
    }
}

// Collision detection
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1 && x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                dy = -dy;
                b.status = 0;
                score++;
            }
        }
    }
}

// Check level progress
function checkLevelProgress() {
    if (mode === 'infinite' && bricks.every(row => row.every(brick => brick.status === 0))) {
        level++;
        lives--;
        if (lives === 0) gameOver();
        else initBricks();
    } else if (mode === 'classic' && score === brickRowCount * brickColumnCount) {
        alert('YOU WIN, GAME OVER');
        gameOver();
    }
}

// Draw function (game loop)
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    drawLevel();
    
    collisionDetection();
    checkLevelProgress();

    // Ball collision with walls
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
    if (y + dy < ballRadius) dy = -dy;
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) dy = -dy;
        else {
            lives--;
            if (!lives) gameOver();
            else resetBall();
        }
    }

    // Paddle movement
    if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
    else if (leftPressed && paddleX > 0) paddleX -= 7;

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

// Reset ball position
function resetBall() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2;
    dy = -2;
    paddleX = (canvas.width - paddleWidth) / 2;
}

// Game over function
function gameOver() {
    alert('GAME OVER');
    document.body.style.background = 'url(img4.jpg)'; // Restore background
    document.location.reload();
}

// Start game function
function startGame(selectedMode) {
    mode = selectedMode;
    document.getElementById('startMenu').style.display = 'none';
    canvas.style.display = 'block';

    // Remove background when game starts
    document.body.style.background = "none";

    resizeCanvas();
    initBricks();
    x = canvas.width / 2;
    y = canvas.height - 30;
    draw();
}

// Resize canvas for better responsiveness
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    paddleWidth = canvas.width / 5;
    paddleX = (canvas.width - paddleWidth) / 2;
    ballRadius = canvas.width / 60;
    brickWidth = canvas.width / brickColumnCount - brickPadding;
    brickHeight = canvas.height / brickRowCount / 2 - brickPadding;
}

window.addEventListener('resize', resizeCanvas);

// Button event listeners
document.getElementById('classicModeBtn').addEventListener('click', () => startGame('classic'));
document.getElementById('infiniteModeBtn').addEventListener('click', () => startGame('infinite'));
