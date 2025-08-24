window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content');
    
    if (heroBg && scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
        heroContent.style.opacity = Math.max(0, 1 - (scrolled / window.innerHeight));
    }
});
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});
let indicatorHidden = false;
window.addEventListener('scroll', () => {
    const indicator = document.getElementById('scrollIndicator');
    if (!indicatorHidden && window.pageYOffset > 200 && indicator) {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateX(-50%) translateY(20px)';
        indicatorHidden = true;
    }
});

document.documentElement.style.scrollBehavior = 'smooth';
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    document.body.style.opacity = '1';
});

window.addEventListener('scroll', () => {
    const scrollPercent = Math.min(100, (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        const hue = 200 + (scrollPercent * 0.5);
        const saturation = Math.max(50, 70 - (scrollPercent * 0.2));
        heroBg.style.filter = `hue-rotate(${scrollPercent * 0.5}deg) saturate(${saturation}%)`;
    }
});

document.querySelectorAll('.content-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
    });
});

const animateGrid = (gridSelector, delay = 100) => {
    const gridItems = document.querySelectorAll(`${gridSelector} > *`);
    gridItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * delay}ms`;
    });
};

document.addEventListener('DOMContentLoaded', () => {
    animateGrid('.content-grid');
    animateGrid('.conclusion-grid', 80);
    animateGrid('.stats-grid', 120);
});

const highlightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInFromLeft 0.8s ease-out forwards';
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.highlight-box').forEach(box => {
    highlightObserver.observe(box);
});

class SeashellGame {
    constructor() {
        this.score = 0;
        this.shellCount = 0;
        this.timeLeft = 60;
        this.combo = 0;
        this.comboTimer = null;
        this.gameRunning = true;
        this.shells = [];
        this.gameContainer = document.getElementById('gameContainer');
        this.shellTypes = ['🐚', '🦪', '🐌', '🦀', '⭐', '🪸'];
        this.shellValues = { '🐚': 10, '🦪': 15, '🐌': 12, '🦀': 20, '⭐': 25, '🪸': 18 };
        
        this.init();
    }

    init() {
        this.createSandParticles();
        this.startGameLoop();
        this.startTimer();
        this.spawnShell();
    }

    createSandParticles() {
        const container = document.getElementById('sandParticles');
        if (!container) return;
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'sand-particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                container.appendChild(particle);
                
                setTimeout(() => {
                    if (container.contains(particle)) {
                        container.removeChild(particle);
                    }
                }, 6000);
            }, i * 200);
        }
    }

    spawnShell() {
        if (!this.gameRunning) return;

        const shell = document.createElement('div');
        shell.className = 'seashell';
        
        const shellType = this.shellTypes[Math.floor(Math.random() * this.shellTypes.length)];
        shell.innerHTML = shellType;
        shell.dataset.type = shellType;
        shell.dataset.value = this.shellValues[shellType];
        const containerRect = this.gameContainer.getBoundingClientRect();
        const x = Math.random() * (containerRect.width - 70) + 20;
        const y = Math.random() * (containerRect.height - 150) + 60;
        
        shell.style.left = x + 'px';
        shell.style.top = y + 'px';
        
        shell.style.animationDelay = Math.random() * 2 + 's';
        
        shell.addEventListener('click', (e) => this.collectShell(e, shell));
        
        this.gameContainer.appendChild(shell);
        this.shells.push(shell);
        setTimeout(() => {
            if (this.gameContainer.contains(shell)) {
                this.gameContainer.removeChild(shell);
                this.shells = this.shells.filter(s => s !== shell);
                this.resetCombo();
            }
        }, 6000);
        
        const nextSpawnTime = Math.random() * 1500 + 1000;
        setTimeout(() => this.spawnShell(), nextSpawnTime);
    }

    collectShell(event, shell) {
        event.preventDefault();
        event.stopPropagation();
        
        if (!this.gameRunning) return;
        
        shell.classList.add('collected');
        const shellValue = parseInt(shell.dataset.value);
        
        this.combo++;
        this.shellCount++;
        
        let points = shellValue;
        if (this.combo > 1) {
            points = Math.floor(shellValue * (1 + (this.combo - 1) * 0.2));
            this.showComboIndicator();
        }
        
        this.score += points;
        
        this.updateDisplay();
        
        clearTimeout(this.comboTimer);
        this.comboTimer = setTimeout(() => this.resetCombo(), 3000);
    
        setTimeout(() => {
            if (this.gameContainer.contains(shell)) {
                this.gameContainer.removeChild(shell);
            }
            this.shells = this.shells.filter(s => s !== shell);
        }, 500);
    
        if (Math.random() < 0.3) {
            this.createSandParticles();
        }
    }

    showComboIndicator() {
        const indicator = document.getElementById('comboIndicator');
        if (!indicator) return;
        
        indicator.textContent = `COMBO x${this.combo}! 🌟`;
        indicator.classList.remove('combo-show');
        void indicator.offsetWidth;
        indicator.classList.add('combo-show');
    }

    resetCombo() {
        this.combo = 0;
        this.updateDisplay();
    }

    updateDisplay() {
        const scoreEl = document.getElementById('score');
        const shellCountEl = document.getElementById('shellCount');
        const comboEl = document.getElementById('combo');
        
        if (scoreEl) scoreEl.textContent = this.score;
        if (shellCountEl) shellCountEl.textContent = this.shellCount;
        if (comboEl) comboEl.textContent = this.combo;
    }

    startTimer() {
        const timer = setInterval(() => {
            this.timeLeft--;
            const timeEl = document.getElementById('timeLeft');
            if (timeEl) timeEl.textContent = this.timeLeft + 's';
            
            if (this.timeLeft <= 0) {
                clearInterval(timer);
                this.endGame();
            }
        }, 1000);
    }

    startGameLoop() {
        setInterval(() => {
            if (this.gameRunning && Math.random() < 0.1) {
                this.createSandParticles();
            }
        }, 2000);
    }

    endGame() {
        this.gameRunning = false;
        this.shells.forEach(shell => {
            if (this.gameContainer.contains(shell)) {
                this.gameContainer.removeChild(shell);
            }
        });
        
        const finalScoreEl = document.getElementById('finalScore');
        const finalShellsEl = document.getElementById('finalShells');
        if (finalScoreEl) finalScoreEl.textContent = this.score;
        if (finalShellsEl) finalShellsEl.textContent = this.shellCount;
        
        const gameOverEl = document.getElementById('gameOver');
        if (gameOverEl) gameOverEl.style.display = 'flex';
    }
}

let game;

function toggleGame() {
    const gameContainer = document.getElementById('gameContainer');
    const startBtn = document.querySelector('.start-game-btn');
    
    if (gameContainer.style.display === 'none') {
        gameContainer.style.display = 'block';
        startBtn.textContent = '🏖️ Hide Game';
        startGame();
    } else {
        gameContainer.style.display = 'none';
        startBtn.textContent = '🐚 Start Game';
        if (game) {
            game.gameRunning = false;
        }
    }
}

function startGame() {
    // Reset display elements
    const scoreEl = document.getElementById('score');
    const shellCountEl = document.getElementById('shellCount');
    const timeLeftEl = document.getElementById('timeLeft');
    const comboEl = document.getElementById('combo');
    
    if (scoreEl) scoreEl.textContent = '0';
    if (shellCountEl) shellCountEl.textContent = '0';
    if (timeLeftEl) timeLeftEl.textContent = '60s';
    if (comboEl) comboEl.textContent = '0';
    
    game = new SeashellGame();
}

function restartGame() {
    const gameOverEl = document.getElementById('gameOver');
    if (gameOverEl) gameOverEl.style.display = 'none';
    
    const existingShells = document.querySelectorAll('.seashell');
    existingShells.forEach(shell => shell.remove());
    
    const sandContainer = document.getElementById('sandParticles');
    if (sandContainer) sandContainer.innerHTML = '';
    
    startGame();
}

function closeGame() {
    const gameOverEl = document.getElementById('gameOver');
    const gameContainer = document.getElementById('gameContainer');
    const startBtn = document.querySelector('.start-game-btn');
    
    if (gameOverEl) gameOverEl.style.display = 'none';
    if (gameContainer) gameContainer.style.display = 'none';
    if (startBtn) startBtn.textContent = '🐚 Start Game';
    
    if (game) {
        game.gameRunning = false;
    }

    const existingShells = document.querySelectorAll('.seashell');
    existingShells.forEach(shell => shell.remove());
    
    const sandContainer = document.getElementById('sandParticles');
    if (sandContainer) sandContainer.innerHTML = '';
}