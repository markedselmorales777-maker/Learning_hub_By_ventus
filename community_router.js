// Dummy project thumbnails
const thumbDark = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'><rect width='320' height='180' fill='%2311121d'/><text x='160' y='90' fill='%237c4dff' font-size='18' font-weight='bold' text-anchor='middle'>VENTUS PROJECT</text></svg>";

const communityProjects = [
    // --- PYTHON ---
    {
        id: 1,
        title: "spaceshooter_gradproject",
        author: "Mohamed bestun",
        tag: "python",
        badge: "PYTHON",
        type: "spaceshooter",
        likes: 12,
        views: 92,
        comments: [],
        thumbnail: thumbDark,
        description: "A space shooter game where you choose your difficulty from beginner-astronaut, and shoot out asteroids falling from the sky. Can you beat all the levels?",
        date: "7/19/2026"
    },
    {
        id: 2,
        title: "Turtle Art Generator",
        author: "Mark Edsel Morales",
        tag: "python",
        badge: "PYTHON",
        type: "turtle",
        likes: 15,
        views: 110,
        comments: [],
        thumbnail: thumbDark,
        description: "Interactive Python Turtle graphics simulator generating dynamic rainbow geometric spirals.",
        date: "7/20/2026"
    },

    // --- SCRATCH ---
    {
        id: 3,
        title: "Clicker Quest",
        author: "Darun Faisal Vira",
        tag: "scratch",
        badge: "SCRATCH",
        type: "clicker",
        likes: 5,
        views: 40,
        comments: [],
        thumbnail: thumbDark,
        description: "Interactive Scratch clicker game with level upgrades!",
        date: "7/18/2026"
    },
    {
        id: 4,
        title: "Maze Escape Scratch",
        author: "Geissa Santos",
        tag: "scratch",
        badge: "SCRATCH",
        type: "maze",
        likes: 9,
        views: 63,
        comments: [],
        thumbnail: thumbDark,
        description: "Use Arrow Keys to navigate the blue character through the maze to reach the green exit!",
        date: "7/17/2026"
    },

    // --- OTHER CATEGORIES ---
    {
        id: 5,
        title: "3D Platformer Prototype",
        author: "Alex Rivera",
        tag: "unity",
        badge: "UNITY",
        type: "platformer",
        likes: 22,
        views: 150,
        comments: [],
        thumbnail: thumbDark,
        description: "3D physics platformer interactive prototype.",
        date: "7/15/2026"
    },
    {
        id: 6,
        title: "HTML5 Canvas Paint App",
        author: "Mark Edsel Morales",
        tag: "websites",
        badge: "WEBSITES",
        type: "paint",
        likes: 27,
        views: 175,
        comments: [],
        thumbnail: thumbDark,
        description: "Fully functional interactive web painting application. Click and drag to draw!",
        date: "7/01/2026"
    }
];

let activeCategory = 'new';
let activeFilter = 'all';
let currentGameIntervals = [];

document.addEventListener('DOMContentLoaded', () => {
    setupCommunityTabs();
    setupFilterPills();
    setupModalHandlers();
    setupRouter();
});

function setupRouter() {
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
}

function stopAllGameLoops() {
    currentGameIntervals.forEach(id => clearInterval(id));
    currentGameIntervals = [];
    if (window.activeGameKeyHandler) {
        window.removeEventListener('keydown', window.activeGameKeyHandler);
        window.activeGameKeyHandler = null;
    }
    if (window.active3DFrameloop) {
        cancelAnimationFrame(window.active3DFrameloop);
        window.active3DFrameloop = null;
    }
}

function handleRoute() {
    const hash = window.location.hash;
    const galleryView = document.getElementById('community-gallery-view');
    const detailView = document.getElementById('project-detail-view');

    stopAllGameLoops();

    if (hash.startsWith('#project/')) {
        const projectId = parseInt(hash.split('/')[1], 10);
        const project = communityProjects.find(p => p.id === projectId);
        if (project) {
            renderProjectDetail(project);
            if(galleryView) galleryView.style.display = 'none';
            if(detailView) detailView.style.display = 'block';
        } else {
            window.location.hash = '';
        }
    } else {
        if(galleryView) galleryView.style.display = 'block';
        if(detailView) detailView.style.display = 'none';
        renderProjects();
    }
}

function setupCommunityTabs() {
    document.querySelectorAll('.comm-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.comm-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            activeCategory = e.target.dataset.category;
            renderProjects();
        });
    });
}

function setupFilterPills() {
    document.querySelectorAll('.pill-btn').forEach(pill => {
        pill.addEventListener('click', (e) => {
            document.querySelectorAll('.pill-btn').forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');
            activeFilter = e.target.dataset.filter;
            renderProjects();
        });
    });
}

function renderProjects() {
    const container = document.getElementById('projects-grid-container');
    if(!container) return;
    container.innerHTML = '';

    let filtered = communityProjects.filter(p => {
        if (activeFilter === 'all') return true;
        return p.tag.toLowerCase() === activeFilter.toLowerCase();
    });

    if (activeCategory === 'popular') {
        filtered.sort((a, b) => b.likes - a.likes);
    }

    filtered.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.onclick = () => { window.location.hash = `#project/${project.id}`; };

        card.innerHTML = `
            <div class="card-thumb-wrapper">
                <span class="card-badge">${project.badge}</span>
                <img src="${project.thumbnail}" alt="${project.title}">
            </div>
            <div class="card-info">
                <h3 class="card-title">${project.title}</h3>
                <p class="card-author">${project.author}</p>
                <div class="card-stats">
                    <span>👍 ${project.likes}</span>
                    <span>👁️ ${project.views}</span>
                    <span>💬 ${project.comments.length}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderProjectDetail(project) {
    const container = document.getElementById('project-detail-content');
    if(!container) return;

    const backBtn = document.getElementById('back-to-community-btn');
    if(backBtn) backBtn.onclick = () => { window.location.hash = ''; };

    container.innerHTML = `
        <div class="detail-container-alg">
            <div class="stage-wrapper" id="stage-wrapper-box" style="position:relative; width:100%; max-width:800px; height:480px; margin:0 auto; background:#000; overflow:hidden; border-radius:8px;">
                <div class="stage-btn-fullscreen" id="fullscreen-btn" title="Full Screen" style="position:absolute; top:10px; right:10px; z-index:100; cursor:pointer; background:rgba(0,0,0,0.6); padding:6px 10px; border-radius:4px; color:#fff;">⛶</div>
                
                <div id="canvas-stage-area" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center; background:#000;">
                    <div id="start-overlay" class="stage-overlay-center" style="text-align:center;">
                        <div class="big-play-btn" id="play-trigger-btn" style="font-size:48px; cursor:pointer; color:#7c4dff;">▶</div>
                        <p style="font-size:13px; color:#aaa; margin-top:10px;">Click Play to Start Project</p>
                    </div>
                </div>
            </div>

            <div class="detail-meta-alg">
                <div class="meta-tag-alg">${project.badge}</div>
                <h1 class="meta-title-alg">${project.title}</h1>
                
                <div class="meta-author-row">
                    <div class="author-avatar-img">👤</div>
                    <span style="font-weight:bold; color:#333;">${project.author}</span>
                </div>

                <div class="meta-stats-row">
                    <span>👍 ${project.likes}</span>
                    <span>👁️ ${project.views}</span>
                    <span>💬 ${project.comments.length}</span>
                </div>

                <p class="meta-desc-alg">${project.description}</p>
                <div style="font-size:12px; color:#888; margin-bottom:15px;">Published on ${project.date}</div>

                <div class="meta-actions-alg">
                    <button class="btn-reaction" id="like-btn">🔥</button>
                    <button class="btn-reaction">🐸</button>
                    <button class="btn-reaction">❤️</button>
                    <button class="btn-remix-purple">Remix</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('fullscreen-btn').onclick = () => {
        const stage = document.getElementById('stage-wrapper-box');
        if (!document.fullscreenElement) {
            stage.requestFullscreen().catch(err => alert(err.message));
        } else {
            document.exitFullscreen();
        }
    };

    document.getElementById('play-trigger-btn').onclick = () => {
        launchInteractiveProject(project);
    };

    document.getElementById('like-btn').onclick = () => {
        project.likes += 1;
        renderProjectDetail(project);
    };
}

function launchInteractiveProject(project) {
    stopAllGameLoops();
    const area = document.getElementById('canvas-stage-area');

    if (project.type === 'spaceshooter') {
        loadSpaceShooterDifficultyMenu(area);
    } else if (project.type === 'turtle') {
        loadTurtleGraphicsDemo(area);
    } else if (project.type === 'maze') {
        loadMazeGame(area);
    } else if (project.type === 'clicker') {
        loadClickerGame(area);
    } else if (project.type === 'paint') {
        loadPaintApp(area);
    } else if (project.type === 'platformer') {
        load3DPlatformerGame(area);
    } else {
        area.innerHTML = `
            <div style="background:#0c0d16; color:#7c4dff; font-family:monospace; padding:20px; width:100%; height:100%; box-sizing:border-box; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
                <h2>🚀 ${project.title}</h2>
                <p style="color:#aaa; margin-top:10px;">[${project.badge}] Engine loaded successfully!</p>
            </div>
        `;
    }
}

/* =========================================================
   1. SPACE SHOOTER ENGINE
   ========================================================= */
function loadSpaceShooterDifficultyMenu(container) {
    container.innerHTML = `
        <div style="background:#000; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px;" id="shooter-main-box">
            <h2 style="color:#fff; font-family:sans-serif; font-size:20px; letter-spacing:1px; margin-bottom:5px;">CHOOSE DIFFICULTY</h2>
            <button class="diff-btn" onclick="startSpaceGame(10, 'Beginner')" style="background:#00c853; color:#fff; width:220px; padding:10px; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Beginner (10 pts)</button>
            <button class="diff-btn" onclick="startSpaceGame(25, 'Intermediate')" style="background:#0288d1; color:#fff; width:220px; padding:10px; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Intermediate (25 pts)</button>
            <button class="diff-btn" onclick="startSpaceGame(50, 'Advanced')" style="background:#fbc02d; color:#111; width:220px; padding:10px; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Advanced (50 pts)</button>
            <button class="diff-btn" onclick="startSpaceGame(75, 'Professional')" style="background:#f57c00; color:#fff; width:220px; padding:10px; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Professional (75 pts)</button>
            <button class="diff-btn" onclick="startSpaceGame(100, 'Astronaut')" style="background:#d32f2f; color:#fff; width:220px; padding:10px; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Astronaut (100 pts)</button>
        </div>
    `;
}

window.startSpaceGame = function(targetScore, mode) {
    stopAllGameLoops();
    const container = document.getElementById('canvas-stage-area');
    container.innerHTML = `
        <div id="game-viewport" style="background:#050508; width:480px; height:100%; position:relative; overflow:hidden; font-family:sans-serif; margin:0 auto;">
            <div style="position:absolute; top:8px; left:0; width:100%; text-align:center; color:#777; font-size:11px; z-index:5;">Use ◄ ► Arrow Keys to Move | SPACEBAR to Shoot</div>
            <div style="position:absolute; bottom:10px; left:12px; color:#fff; font-size:13px; font-weight:bold; z-index:5;">Lives: <span id="hp-txt" style="color:#ff5555;">3</span></div>
            <div style="position:absolute; bottom:10px; right:12px; color:#fff; font-size:13px; font-weight:bold; z-index:5;">Score: <span id="score-txt" style="color:#00c853;">0</span>/${targetScore}</div>
            
            <div id="player-ship" style="position:absolute; bottom:25px; left:210px; width:40px; height:40px; font-size:32px; line-height:40px; text-align:center; user-select:none;">🚀</div>
        </div>
    `;

    let score = 0;
    let lives = 3;
    let shipX = 210;
    const viewport = document.getElementById('game-viewport');
    const ship = document.getElementById('player-ship');

    let activeLasers = [];
    let activeAsteroids = [];

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            shipX = Math.max(10, shipX - 22);
            ship.style.left = shipX + 'px';
        } else if (e.key === 'ArrowRight') {
            shipX = Math.min(410, shipX + 22);
            ship.style.left = shipX + 'px';
        } else if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            shootLaser();
        }
    };

    window.activeGameKeyHandler = handleKeyDown;
    window.addEventListener('keydown', handleKeyDown);

    function shootLaser() {
        const laser = document.createElement('div');
        const lX = shipX + 18;
        let lY = 65;
        laser.style.cssText = `position:absolute; bottom:${lY}px; left:${lX}px; width:4px; height:14px; background:#00e5ff; border-radius:2px; box-shadow:0 0 8px #00e5ff; z-index:4;`;
        viewport.appendChild(laser);

        const laserObj = { element: laser, x: lX, y: lY };
        activeLasers.push(laserObj);
    }

    const spawnInterval = setInterval(() => {
        const ast = document.createElement('div');
        const astX = Math.floor(Math.random() * 400) + 15;
        let astY = 0;

        ast.innerText = '🪨';
        ast.style.cssText = `position:absolute; top:${astY}px; left:${astX}px; width:36px; height:36px; font-size:28px; line-height:36px; text-align:center; user-select:none; z-index:3;`;
        viewport.appendChild(ast);

        activeAsteroids.push({ element: ast, x: astX, y: astY });
    }, 1200);

    currentGameIntervals.push(spawnInterval);

    const frameInterval = setInterval(() => {
        for (let i = activeLasers.length - 1; i >= 0; i--) {
            let l = activeLasers[i];
            l.y += 12;
            l.element.style.bottom = l.y + 'px';

            if (l.y > 480) {
                l.element.remove();
                activeLasers.splice(i, 1);
            }
        }

        for (let aIndex = activeAsteroids.length - 1; aIndex >= 0; aIndex--) {
            let ast = activeAsteroids[aIndex];
            ast.y += 4;
            ast.element.style.top = ast.y + 'px';

            for (let lIndex = activeLasers.length - 1; lIndex >= 0; lIndex--) {
                let l = activeLasers[lIndex];
                let laserTop = 480 - l.y;

                if (
                    l.x >= ast.x - 10 &&
                    l.x <= ast.x + 36 &&
                    laserTop >= ast.y &&
                    laserTop <= ast.y + 36
                ) {
                    ast.element.innerText = '💥';
                    setTimeout(() => ast.element.remove(), 100);

                    l.element.remove();
                    activeAsteroids.splice(aIndex, 1);
                    activeLasers.splice(lIndex, 1);

                    score += 1;
                    document.getElementById('score-txt').innerText = score;

                    if (score >= targetScore) {
                        stopAllGameLoops();
                        alert(`🎉 VICTORY! You beat ${mode} mode with ${score} points!`);
                        loadSpaceShooterDifficultyMenu(container);
                    }
                    break;
                }
            }

            if (ast.y > 440) {
                ast.element.remove();
                activeAsteroids.splice(aIndex, 1);
                lives -= 1;
                document.getElementById('hp-txt').innerText = lives;

                if (lives <= 0) {
                    stopAllGameLoops();
                    alert("💥 GAME OVER! Your spaceship was destroyed.");
                    loadSpaceShooterDifficultyMenu(container);
                }
            }
        }
    }, 30);

    currentGameIntervals.push(frameInterval);
};

/* =========================================================
   2. SCRATCH MAZE GAME ENGINE
   ========================================================= */

const MAZE_MAPS = {
    easy: {
        gridSize: 8,
        timeLimit: null,
        map: [
            [0,0,0,1,0,0,0,0],
            [1,1,0,1,0,1,1,0],
            [0,0,0,0,0,0,1,0],
            [0,1,1,1,1,0,1,0],
            [0,0,0,0,1,0,0,0],
            [1,1,1,0,1,1,1,0],
            [0,0,0,0,0,0,1,0],
            [0,1,1,1,1,0,0,0]
        ]
    },
    medium: {
        gridSize: 10,
        timeLimit: null,
        map: [
            [0,0,1,0,0,0,1,0,0,0],
            [1,0,1,0,1,0,1,0,1,0],
            [0,0,0,0,1,0,0,0,1,0],
            [0,1,1,1,1,1,1,0,1,0],
            [0,0,0,0,0,0,1,0,0,0],
            [1,1,1,1,1,0,1,1,1,0],
            [0,0,0,0,1,0,0,0,1,0],
            [0,1,1,0,1,1,1,0,1,0],
            [0,0,1,0,0,0,0,0,1,0],
            [1,0,0,0,1,1,1,0,0,0]
        ]
    },
    hard: {
        gridSize: 12,
        timeLimit: null,
        map: [
            [0,0,0,1,0,0,0,1,0,0,0,0],
            [1,1,0,1,0,1,0,1,0,1,1,0],
            [0,0,0,0,0,1,0,0,0,1,0,0],
            [0,1,1,1,1,1,1,1,0,1,0,1],
            [0,1,0,0,0,0,0,1,0,1,0,0],
            [0,1,0,1,1,1,0,1,0,1,1,0],
            [0,0,0,1,0,0,0,0,0,0,1,0],
            [1,1,1,1,0,1,1,1,1,0,1,0],
            [0,0,0,0,0,1,0,0,1,0,0,0],
            [0,1,1,1,1,1,0,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,0,0,1,0],
            [1,1,1,1,1,1,1,1,1,0,0,0]
        ]
    },
    extreme: {
        gridSize: 12,
        timeLimit: 15,
        map: [
            [0,1,0,0,0,1,0,0,0,1,0,0],
            [0,1,0,1,0,1,0,1,0,1,0,1],
            [0,0,0,1,0,0,0,1,0,0,0,1],
            [1,1,1,1,1,1,0,1,1,1,0,1],
            [0,0,0,0,0,1,0,0,0,1,0,0],
            [0,1,1,1,0,1,1,1,0,1,1,0],
            [0,1,0,0,0,0,0,1,0,0,1,0],
            [0,1,0,1,1,1,0,1,1,0,1,0],
            [0,0,0,1,0,0,0,0,1,0,0,0],
            [1,1,0,1,0,1,1,0,1,1,1,0],
            [0,0,0,0,0,1,0,0,0,0,1,0],
            [0,1,1,1,1,1,1,1,1,0,0,0]
        ]
    }
};

function loadMazeGame(container) {
    stopAllGameLoops();
    container.innerHTML = `
        <div style="background:#0c0d16; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; font-family:sans-serif;" id="maze-menu">
            <h2 style="color:#fff; font-size:22px; letter-spacing:1px; margin-bottom:5px;">MAZE DIFFICULTY SELECT</h2>
            <button class="diff-btn" onclick="startMazeLevel('easy')" style="background:#00c853; color:#fff; width:240px; padding:12px; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:14px;">🟢 Easy</button>
            <button class="diff-btn" onclick="startMazeLevel('medium')" style="background:#0288d1; color:#fff; width:240px; padding:12px; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:14px;">🔵 Medium</button>
            <button class="diff-btn" onclick="startMazeLevel('hard')" style="background:#f57c00; color:#fff; width:240px; padding:12px; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:14px;">🟠 Hard</button>
            <button class="diff-btn" onclick="startMazeLevel('extreme')" style="background:#d32f2f; color:#fff; width:240px; padding:12px; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:14px;">💀 Sobrang Hirap (Timed!)</button>
        </div>
    `;
}

window.startMazeLevel = function(diffKey) {
    stopAllGameLoops();
    const container = document.getElementById('canvas-stage-area');
    const levelData = MAZE_MAPS[diffKey];
    const grid = levelData.map;
    const size = levelData.gridSize;

    const boardSize = 420;
    const cellSize = boardSize / size;

    container.innerHTML = `
        <div id="maze-viewport" style="background:#11121d; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; font-family:sans-serif;">
            <div style="position:absolute; top:10px; left:15px; color:#aaa; font-size:12px; z-index:10;">
                Mode: <b style="color:#7c4dff;">${diffKey.toUpperCase()}</b> | Use Arrow Keys ◄ ▲ ► ▼
            </div>
            ${levelData.timeLimit ? `<div style="position:absolute; top:10px; right:15px; color:#ff5555; font-weight:bold; font-size:13px; z-index:10;">Time Left: <span id="maze-timer">${levelData.timeLimit}</span>s</div>` : ''}
            
            <div id="maze-board" style="position:relative; width:${boardSize}px; height:${boardSize}px; background:#161724; border:2px solid #2a2b3d; border-radius:6px; margin-top:20px;"></div>
        </div>
    `;

    const board = document.getElementById('maze-board');

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.style.position = 'absolute';
            cell.style.top = (r * cellSize) + 'px';
            cell.style.left = (c * cellSize) + 'px';
            cell.style.width = cellSize + 'px';
            cell.style.height = cellSize + 'px';
            cell.style.boxSizing = 'border-box';

            if (grid[r][c] === 1) {
                cell.style.background = '#2a2b3d';
                cell.style.border = '1px solid #3d3e56';
                cell.style.borderRadius = '3px';
            }
            board.appendChild(cell);
        }
    }

    const exitCell = document.createElement('div');
    exitCell.innerText = '🏁';
    exitCell.style.cssText = `
        position: absolute;
        top: ${(size - 1) * cellSize}px;
        left: ${(size - 1) * cellSize}px;
        width: ${cellSize}px;
        height: ${cellSize}px;
        background: #00c853;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${cellSize * 0.5}px;
        border-radius: 4px;
        z-index: 2;
    `;
    board.appendChild(exitCell);

    let playerR = 0;
    let playerC = 0;

    const player = document.createElement('div');
    player.style.cssText = `
        position: absolute;
        top: ${playerR * cellSize + 2}px;
        left: ${playerC * cellSize + 2}px;
        width: ${cellSize - 4}px;
        height: ${cellSize - 4}px;
        background: #7c4dff;
        border-radius: 4px;
        box-shadow: 0 0 10px #7c4dff;
        z-index: 5;
        transition: top 0.08s ease, left 0.08s ease;
    `;
    board.appendChild(player);

    const handleMazeKeys = (e) => {
        let nextR = playerR;
        let nextC = playerC;

        if (e.key === 'ArrowUp') nextR--;
        else if (e.key === 'ArrowDown') nextR++;
        else if (e.key === 'ArrowLeft') nextC--;
        else if (e.key === 'ArrowRight') nextC++;
        else return;

        e.preventDefault();

        if (nextR >= 0 && nextR < size && nextC >= 0 && nextC < size) {
            if (grid[nextR][nextC] === 0) {
                playerR = nextR;
                playerC = nextC;
                player.style.top = (playerR * cellSize + 2) + 'px';
                player.style.left = (playerC * cellSize + 2) + 'px';

                if (playerR === size - 1 && playerC === size - 1) {
                    stopAllGameLoops();
                    setTimeout(() => {
                        alert(`🎉 MAZE ESCAPED! Excellent job beating ${diffKey.toUpperCase()} mode!`);
                        loadMazeGame(container);
                    }, 100);
                }
            }
        }
    };

    window.activeGameKeyHandler = handleMazeKeys;
    window.addEventListener('keydown', handleMazeKeys);

    if (levelData.timeLimit) {
        let timeLeft = levelData.timeLimit;
        const timerInterval = setInterval(() => {
            timeLeft--;
            const timerTxt = document.getElementById('maze-timer');
            if (timerTxt) timerTxt.innerText = timeLeft;

            if (timeLeft <= 0) {
                stopAllGameLoops();
                alert("⏰ TIME'S UP! Naubusan ka ng oras sa Sobrang Hirap mode!");
                loadMazeGame(container);
            }
        }, 1000);
        currentGameIntervals.push(timerInterval);
    }
};

/* =========================================================
   3. TURTLE GRAPHICS SIMULATOR
   ========================================================= */
function loadTurtleGraphicsDemo(container) {
    container.innerHTML = `
        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#0a0a12;">
            <canvas id="turtleCanvas" width="480" height="480" style="background:#0a0a12; max-width:100%; max-height:100%;"></canvas>
        </div>
    `;
    const canvas = document.getElementById('turtleCanvas');
    const ctx = canvas.getContext('2d');
    
    let angle = 0;
    const tInterval = setInterval(() => {
        ctx.fillStyle = 'rgba(10, 10, 18, 0.05)';
        ctx.fillRect(0, 0, 480, 480);

        ctx.save();
        ctx.translate(240, 240);
        ctx.rotate(angle);
        ctx.strokeStyle = `hsl(${(angle * 40) % 360}, 100%, 60%)`;
        ctx.lineWidth = 2;
        ctx.strokeRect(-90, -90, 180, 180);
        ctx.restore();

        angle += 0.04;
    }, 30);

    currentGameIntervals.push(tInterval);
}

/* =========================================================
   4. SCRATCH CLICKER GAME
   ========================================================= */
function loadClickerGame(container) {
    let score = 0;
    container.innerHTML = `
        <div style="background:#181925; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:15px; color:#fff;">
            <h1 id="clk-score" style="font-size:54px; color:#7c4dff; text-shadow:0 0 10px rgba(124,77,255,0.5);">0</h1>
            <button id="main-click-btn" style="width:120px; height:120px; border-radius:50%; background:#7c4dff; color:#fff; border:none; font-size:40px; cursor:pointer; box-shadow:0 8px 0 #5c26d1;">🖱️</button>
            <p style="color:#888; font-size:12px;">Click as fast as you can!</p>
        </div>
    `;
    document.getElementById('main-click-btn').onclick = () => {
        score += 1;
        document.getElementById('clk-score').innerText = score;
    };
}

/* =========================================================
   5. WEBSITES CANVAS PAINT APP
   ========================================================= */
function loadPaintApp(container) {
    container.innerHTML = `
        <div style="background:#fff; width:100%; height:100%; display:flex; flex-direction:column; overflow:hidden;">
            <div style="padding:8px 15px; background:#f0f0f0; display:flex; gap:10px; align-items:center; z-index:10; border-bottom:1px solid #ddd;">
                <span style="font-size:12px; font-weight:bold; color:#333;">Draw Color:</span>
                <input type="color" id="paint-color" value="#7c4dff" style="cursor:pointer;">
                <button id="clear-paint" style="padding:4px 12px; background:#ff5555; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:12px; font-weight:bold;">Clear</button>
            </div>
            <div style="flex:1; width:100%; position:relative; background:#fff; display:flex; justify-content:center; align-items:center;">
                <canvas id="paintCanvas" style="background:#fff; cursor:crosshair; width:100%; height:100%; touch-action:none;"></canvas>
            </div>
        </div>
    `;
    
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    
    setTimeout(resizeCanvas, 50);
    window.addEventListener('resize', resizeCanvas);

    let drawing = false;

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    canvas.onmousedown = (e) => {
        drawing = true;
        const pos = getMousePos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    canvas.onmouseup = () => { drawing = false; ctx.beginPath(); };
    canvas.onmouseleave = () => { drawing = false; ctx.beginPath(); };

    canvas.onmousemove = (e) => {
        if (!drawing) return;
        const pos = getMousePos(e);
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.strokeStyle = document.getElementById('paint-color').value;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    document.getElementById('clear-paint').onclick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
}

/* =========================================================
   6. UNITY 3D PLATFORMER ENGINE (PROJECT ID: 5 ONLY)
   ========================================================= */
function load3DPlatformerGame(container) {
    container.innerHTML = `
        <div style="position:relative; width:100%; height:100%; background:#0b0c16; display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden; font-family:sans-serif;">
            <div style="position:absolute; top:12px; left:15px; color:#888; font-size:12px; z-index:10;">
                🎮 Mode: <b style="color:#7c4dff;">3D PHYSICS PLATFORMER</b> | Controls: <b style="color:#7c4dff;">A / D</b> or <b style="color:#7c4dff;">Arrows</b> to move | <b style="color:#7c4dff;">SPACE</b> to Jump
            </div>
            <canvas id="platformer3DCanvas" width="640" height="380" style="background:#11121d; border-radius:8px; box-shadow:0 6px 20px rgba(0,0,0,0.6);"></canvas>
        </div>
    `;

    const canvas = document.getElementById('platformer3DCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let player = { x: 100, y: 220, width: 32, height: 32, vx: 0, vy: 0, grounded: false };
    let gravity = 0.5;
    let keys = {};

    const handlePlatformerKeys = (e) => {
        keys[e.code] = true;
    };
    const handlePlatformerUp = (e) => {
        keys[e.code] = false;
    };

    window.activeGameKeyHandler = handlePlatformerKeys;
    window.addEventListener('keydown', handlePlatformerKeys);
    window.addEventListener('keyup', handlePlatformerUp);

    function loop3D() {
        // Clear viewport
        ctx.fillStyle = '#0a0b12';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render 3D Grid floor perspective lines
        ctx.strokeStyle = '#1d1e30';
        ctx.lineWidth = 1;
        for (let i = 0; i <= canvas.width; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 280);
            ctx.lineTo(i - 60, canvas.height);
            ctx.stroke();
        }

        // Platforms layout
        const platforms = [
            { x: 0, y: 280, w: canvas.width, h: 100 },
            { x: 180, y: 210, w: 120, h: 15 },
            { x: 380, y: 150, w: 140, h: 15 }
        ];

        // Draw Platforms with 3D Bevel Edge
        platforms.forEach(p => {
            ctx.fillStyle = '#212338';
            ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.fillStyle = '#7c4dff';
            ctx.fillRect(p.x, p.y, p.w, 3);
        });

        // Controls
        if (keys['ArrowRight'] || keys['KeyD']) player.vx = 4;
        else if (keys['ArrowLeft'] || keys['KeyA']) player.vx = -4;
        else player.vx = 0;

        if ((keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && player.grounded) {
            player.vy = -10.5;
            player.grounded = false;
        }

        // Apply Gravity & Movement
        player.vy += gravity;
        player.x += player.vx;
        player.y += player.vy;

        // Platform Collisions
        player.grounded = false;
        platforms.forEach(p => {
            if (
                player.x + player.width > p.x &&
                player.x < p.x + p.w &&
                player.y + player.height >= p.y &&
                player.y + player.height <= p.y + 15 &&
                player.vy >= 0
            ) {
                player.y = p.y - player.height;
                player.vy = 0;
                player.grounded = true;
            }
        });

        // Screen boundaries
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

        // Draw 3D Box Character Perspective Projection
        // Front Face
        ctx.fillStyle = '#00e676';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Top 3D Edge
        ctx.fillStyle = '#69f0ae';
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(player.x + 8, player.y - 8);
        ctx.lineTo(player.x + player.width + 8, player.y - 8);
        ctx.lineTo(player.x + player.width, player.y);
        ctx.fill();

        // Right 3D Edge
        ctx.fillStyle = '#00b0ff';
        ctx.beginPath();
        ctx.moveTo(player.x + player.width, player.y);
        ctx.lineTo(player.x + player.width + 8, player.y - 8);
        ctx.lineTo(player.x + player.width + 8, player.y + player.height - 8);
        ctx.lineTo(player.x + player.width, player.y + player.height);
        ctx.fill();

        window.active3DFrameloop = requestAnimationFrame(loop3D);
    }

    loop3D();
}

function setupModalHandlers() {
    const modal = document.getElementById('post-modal');
    const openBtn = document.getElementById('open-post-modal-btn');
    const closeBtn = document.getElementById('close-post-modal-btn');
    
    if(openBtn) openBtn.onclick = () => modal.style.display = 'flex';
    if(closeBtn) closeBtn.onclick = () => modal.style.display = 'none';

    const form = document.getElementById('create-project-form');
    if(form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const title = document.getElementById('project-title-input').value;
            const tag = document.getElementById('project-tag-input').value;
            const desc = document.getElementById('project-desc-input').value;

            const newProj = {
                id: Date.now(),
                title: title,
                author: "Mark Edsel Morales",
                tag: tag,
                badge: tag.toUpperCase(),
                type: "generic",
                likes: 0,
                views: 0,
                comments: [],
                thumbnail: thumbDark,
                description: desc,
                date: new Date().toLocaleDateString()
            };

            communityProjects.unshift(newProj);
            modal.style.display = 'none';
            form.reset();
            renderProjects();
        };
    }
}