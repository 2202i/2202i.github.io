import * as THREE from "https://esm.sh/three";

// --------------------------
// GAME SETTINGS
// --------------------------
const minTileIndex = -8;
const maxTileIndex = 8;
const tileSize = 42;

// --------------------------
// LEADERBOARD LOGIC
// --------------------------
let currentScore = 0;
let currentPlayerName = "Anonymous";

function saveScore(username, score){
  if(!username) username="Anonymous";
  const leaderboard = JSON.parse(localStorage.getItem("crossyLeaderboard")) || [];
  leaderboard.push({name:username, score});
  leaderboard.sort((a,b)=>b.score-a.score);
  localStorage.setItem("crossyLeaderboard", JSON.stringify(leaderboard.slice(0,10)));
}

function updateLeaderboardRealtime(){
  const leaderboard = JSON.parse(localStorage.getItem("crossyLeaderboard")) || [];
  const leaderboardDOM = document.getElementById("leaderboard");
  leaderboardDOM.innerHTML = "";

  // Live player score first
  const liveEntry = document.createElement("li");
  liveEntry.textContent = `${currentPlayerName} (You): ${currentScore}`;
  liveEntry.style.fontWeight = "bold";
  leaderboardDOM.appendChild(liveEntry);

  // Top saved scores
  leaderboard.forEach(entry=>{
    const li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.score}`;
    leaderboardDOM.appendChild(li);
  });
}

// --------------------------
// THREE.JS SETUP
// --------------------------
const canvas = document.querySelector(".game");
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Camera
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -40, window.innerWidth / 40,
  window.innerHeight / 40, window.innerHeight / -40,
  0.1, 1000
);
camera.position.set(200, -200, 200);
camera.lookAt(0,0,0);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(200, -200, 200);
scene.add(light);

// --------------------------
// PLAYER SETUP
// --------------------------
const player = new THREE.Group();
const body = new THREE.Mesh(new THREE.BoxGeometry(15,15,20), new THREE.MeshLambertMaterial({color:"white"}));
body.position.z = 10; body.castShadow=true;
player.add(body);
player.position.set(0,0,0);
scene.add(player);

let playerPos = {row:0,tile:0};
let movesQueue=[];

// --------------------------
// INPUT HANDLING
// --------------------------
document.addEventListener("keydown", (e)=>{
  if(e.key==="ArrowUp") movesQueue.push("forward");
  if(e.key==="ArrowDown") movesQueue.push("backward");
  if(e.key==="ArrowLeft") movesQueue.push("left");
  if(e.key==="ArrowRight") movesQueue.push("right");
});

function processMoves(){
  if(movesQueue.length===0) return;
  const move = movesQueue.shift();
  if(move==="forward") player.position.y += tileSize;
  if(move==="backward") player.position.y -= tileSize;
  if(move==="left") player.position.x -= tileSize;
  if(move==="right") player.position.x += tileSize;

  if(move==="forward") playerPos.row++;
  if(move==="backward") playerPos.row--;
  if(move==="left") playerPos.tile--;
  if(move==="right") playerPos.tile++;

  currentScore = playerPos.row;
  document.getElementById("score").innerText = currentScore;
  updateLeaderboardRealtime();
}

// --------------------------
// GAME OVER
// --------------------------
function gameOver(){
  document.getElementById("final-score").innerText = currentScore;
  document.getElementById("result-container").style.display = "block";
  saveScore(currentPlayerName, currentScore);
  updateLeaderboardRealtime();
}

// --------------------------
// START / RETRY
// --------------------------
document.getElementById("start").addEventListener("click",()=>{
  const username = document.getElementById("username").value.trim();
  currentPlayerName = username || "Anonymous";
  resetGame();
});

document.getElementById("retry").addEventListener("click",()=>{
  resetGame();
});

function resetGame(){
  player.position.set(0,0,0);
  playerPos = {row:0,tile:0};
  movesQueue=[];
  currentScore = 0;
  document.getElementById("score").innerText = "0";
  document.getElementById("result-container").style.display = "none";
  updateLeaderboardRealtime();
}

// --------------------------
// MAIN LOOP
// --------------------------
function animate(){
  requestAnimationFrame(animate);
  processMoves();

  // Example collision/game over logic:
  if(Math.abs(playerPos.tile)>maxTileIndex || playerPos.row<0){
    gameOver();
  }

  renderer.render(scene, camera);
}

animate();
updateLeaderboardRealtime();
