const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ballRadius = 10;
let dx = 2, dy = -2;
let paddleHeight = 10, paddleWidth = 75, paddleX = 0;
let rightPressed = false, leftPressed = false;
let brickRowCount = 5, brickColumnCount = 8;
let brickWidth = 75, brickHeight = 20, brickPadding = 10;
let brickOffsetTop = 30, brickOffsetLeft = 30;
let bricks = [];
let score = 0, lives = 3, level = 1, mode = '';
let x, y;

// Event Listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
window.addEventListener('resize', resizeCanvas);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
    if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
    if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
}

function initBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

function drawBricks() {
    bricks.forEach((col, c) => {
        col.forEach((brick, r) => {
            if (brick.status === 1) {
                let brickX = brickOffsetLeft + c * (brickWidth + brickPadding);
                let brickY = brickOffsetTop + r * (brickHeight + brickPadding);
                brick.x = brickX;
                brick.y = brickY;
                ctx.fillStyle = '#0095DD';
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
            }
        });
    });
}

function drawBall() {
    ctx.fillStyle = '#0095DD';
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fill();
}

function drawPaddle() {
    ctx.fillStyle = '#0095DD';
    ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
}

function drawScore() {
    ctx.fillStyle = '#0095DD';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLevel() {
    if (mode === 'infinite') {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#0095DD';
        ctx.fillText('Level: ' + level, canvas.width / 2 - 30, 20);
    }
}

function drawLevel() {
    if (mode === 'infinite') {
        ctx.fillStyle = '#0095DD';
        ctx.font = '16px Arial';
        ctx.fillText(`Level: ${level}`, canvas.width / 2 - 30, 20);
    }
}

function collisionDetection() {
    bricks.forEach((col) => {
        col.forEach((brick) => {
            if (brick.status === 1) {
                if (x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight) {
                    dy = -dy;
                    brick.status = 0;
                    score++;
                }
            }
        });
    });
}

function checkLevelProgress() {
    if (mode === 'infinite' && bricks.flat().every(brick => brick.status === 0)) {
        level++;
        lives--;
        if (lives === 0) {
            alert('GAME OVER');
            document.location.reload();
        } else {
            initBricks();
        }
    } else if (mode === 'classic' && score === brickRowCount * brickColumnCount) {
        alert('YOU WIN, GAME OVER');
        document.location.reload();
    }
}

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

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
    if (y + dy < ballRadius) dy = -dy;
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) dy = -dy;
        else {
            lives--;
            if (!lives) {
                alert('GAME OVER');
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
    if (leftPressed && paddleX > 0) paddleX -= 7;

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

document.getElementById('classicModeBtn').addEventListener('click', () => {
    mode = 'classic';
    startGame();
});

document.getElementById('infiniteModeBtn').addEventListener('click', () => {
    mode = 'infinite';
    startGame();
});

function startGame() {
    document.getElementById('startMenu').style.display = 'none';
    canvas.style.display = 'block';
    document.body.style.background = "none"; 
    resizeCanvas();
    initBricks();
    x = canvas.width / 2;
    y = canvas.height - 30;
    draw();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    paddleWidth = canvas.width / 5;
    paddleX = (canvas.width - paddleWidth) / 2;
    ballRadius = canvas.width / 60;
    brickWidth = canvas.width / brickColumnCount - brickPadding;
    brickHeight = canvas.height / brickRowCount / 2 - brickPadding;
}

resizeCanvas();
