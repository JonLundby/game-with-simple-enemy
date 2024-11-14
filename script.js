"use strict";

window.addEventListener("load", init);

const gameFieldElement = document.querySelector("#gamefield");
const gameFieldBounds = {
    top: 0,
    bottom: parseInt(window.getComputedStyle(gameFieldElement).height),
    left: 0,
    right: parseInt(window.getComputedStyle(gameFieldElement).width),
};

const playerElement = document.querySelector("#player");
const player = {
    x: 0,
    y: 0,
    speed: 240,
    h: parseInt(window.getComputedStyle(playerElement).height, 10),
    w: parseInt(window.getComputedStyle(playerElement).width, 10),
    collision: false,
};

const controls = {
    up: false,
    down: false,
    left: false,
    right: false,
};

const newPlayerPos = {
    x: player.x,
    y: player.y,
};

const enemyElement = document.querySelector("#enemy");
const enemy = {
    x: 0,
    y: 260,
    speed: 240,
    h: parseInt(window.getComputedStyle(enemyElement).height, 10),
    w: parseInt(window.getComputedStyle(enemyElement).width, 10),
};

const newEnemyPos = {
    x: enemy.x,
    y: enemy.y,
};

const enemyDirection = {
    right: false,
    left: false,
};

let lastTime = 0;

function tick(time) {
    // "time" comes from requestAnimationFrame which is a built-in function that calls the function it is given with the current time as an argument
    const deltaTime = (time - lastTime) / 1000;

    lastTime = time;

    requestAnimationFrame(tick);

    if (detectEnemyCollision(player, enemy)) {
        player.collision = true;
        displayCollision();
    } else {
        player.collision = false;
    }

    movePlayer(deltaTime);
    moveEnemy(deltaTime);

    diplayPlayer();
    displayEnemy();
}

function init() {
    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyReleased);

    requestAnimationFrame(tick);
}

function diplayPlayer() {
    const visualPlayer = document.querySelector("#player");

    visualPlayer.style.transform = `translate(${player.x}px, ${player.y}px)`;
}

function movePlayer(deltaTime) {
    if (controls.up) {
        newPlayerPos.y -= player.speed * deltaTime;
    }
    if (controls.down) {
        newPlayerPos.y += player.speed * deltaTime;
    }
    if (controls.left) {
        newPlayerPos.x -= player.speed * deltaTime;
    }
    if (controls.right) {
        newPlayerPos.x += player.speed * deltaTime;
    }

    if (canMove(player, newPlayerPos)) {
        player.x = newPlayerPos.x;
        player.y = newPlayerPos.y;
    } else {
        newPlayerPos.x = player.x;
        newPlayerPos.y = player.y;
    }
}

function keyPressed(event) {
    if (event.key === "w" || event.key === "ArrowUp") {
        controls.up = true;
    }
    if (event.key === "s" || event.key === "ArrowDown") {
        controls.down = true;
    }
    if (event.key === "a" || event.key === "ArrowLeft") {
        controls.left = true;
    }
    if (event.key === "d" || event.key === "ArrowRight") {
        controls.right = true;
    }
}

function keyReleased(event) {
    if (event.key === "w" || event.key === "ArrowUp") {
        controls.up = false;
    }
    if (event.key === "s" || event.key === "ArrowDown") {
        controls.down = false;
    }
    if (event.key === "a" || event.key === "ArrowLeft") {
        controls.left = false;
    }
    if (event.key === "d" || event.key === "ArrowRight") {
        controls.right = false;
    }
}

function canMove(player, position) {
    if (
        position.x >= gameFieldBounds.left &&
        position.x <= gameFieldBounds.right - player.w &&
        position.y >= gameFieldBounds.top &&
        position.y <= gameFieldBounds.bottom - player.h
    ) {
        return true;
    }

    return false;
}

function detectEnemyCollision(player, enemy) {
    let playerBottomBelowEnemyTop = false;
    if (player.y + player.h > enemy.y) {
        playerBottomBelowEnemyTop = true;
    }

    let playerTopAboveEnemyBottom = false;
    if (player.y < enemy.y + enemy.h) {
        playerTopAboveEnemyBottom = true;
    }

    let playerRightOverEnemyLeft = false;
    if (player.x + player.w > enemy.x) {
        playerRightOverEnemyLeft = true;
    }

    let playerLeftOverEnemyRight = false;
    if (player.x < enemy.x + enemy.w) {
        playerLeftOverEnemyRight = true;
    }

    let isColliding = false;
    if (
        playerBottomBelowEnemyTop &&
        playerTopAboveEnemyBottom &&
        playerRightOverEnemyLeft &&
        playerLeftOverEnemyRight
    ) {
        isColliding = true;
    }

    // console.log(
    //     "playerBottomBelowEnemyTop",
    //     playerBottomBelowEnemyTop,
    //     "playerTopAboveEnemyBottom",
    //     playerTopAboveEnemyBottom,
    //     "playerRightOverEnemyLeft",
    //     playerRightOverEnemyLeft,
    //     "playerLeftOverEnemyRight",
    //     playerLeftOverEnemyRight
    // );

    return isColliding;
}

function displayEnemy() {
    const visualEnemy = document.querySelector("#enemy");

    visualEnemy.style.transform = `translate(${enemy.x}px, ${enemy.y}px)`;
}

function moveEnemy(deltaTime) {
    if (enemy.x <= gameFieldBounds.left) {
        enemyDirection.right = true;
        enemyDirection.left = false;
    } else if (enemy.x >= gameFieldBounds.right - enemy.w) {
        enemyDirection.right = false;
        enemyDirection.left = true;
    }
    if (enemyDirection.right) {
        enemy.x += enemy.speed * deltaTime;
    } else if (enemyDirection.left) {
        enemy.x -= enemy.speed * deltaTime;
    }
}

function displayCollision() {
    playerElement.classList.add("collision");

    setTimeout(() => {
        playerElement.classList.remove("collision");
    }, 800);
}
