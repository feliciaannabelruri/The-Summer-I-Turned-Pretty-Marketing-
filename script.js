// Parallax effect for hero background
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

// Intersection Observer for scroll animations
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

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Hide scroll indicator after scrolling
let indicatorHidden = false;
window.addEventListener('scroll', () => {
    const indicator = document.getElementById('scrollIndicator');
    if (!indicatorHidden && window.pageYOffset > 200 && indicator) {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateX(-50%) translateY(20px)';
        indicatorHidden = true;
    }
});

// Smooth scrolling behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Loading animation
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    document.body.style.opacity = '1';
});

// Dynamic background gradient based on scroll position
window.addEventListener('scroll', () => {
    const scrollPercent = Math.min(100, (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    
    // Subtle color shift in hero background based on scroll
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        const hue = 200 + (scrollPercent * 0.5);
        const saturation = Math.max(50, 70 - (scrollPercent * 0.2));
        heroBg.style.filter = `hue-rotate(${scrollPercent * 0.5}deg) saturate(${saturation}%)`;
    }
});

// Card hover effects with subtle animations
document.querySelectorAll('.content-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
    });
});

// Stagger animation for grids
const animateGrid = (gridSelector, delay = 100) => {
    const gridItems = document.querySelectorAll(`${gridSelector} > *`);
    gridItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * delay}ms`;
    });
};

// Apply staggered animations to content grids
document.addEventListener('DOMContentLoaded', () => {
    animateGrid('.content-grid');
    animateGrid('.conclusion-grid', 80);
    animateGrid('.stats-grid', 120);
});

// Add entrance animations for highlight boxes
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

// Seashell Game Integration
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
        
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 5 : 8; // Fewer particles on mobile for performance
        
        for (let i = 0; i < particleCount; i++) {
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
        
        // Random position within game container - mobile responsive
        const containerRect = this.gameContainer.getBoundingClientRect();
        const isMobile = window.innerWidth <= 768;
        
        const shellSize = isMobile ? 30 : 35;
        const margin = isMobile ? 15 : 20;
        const topOffset = isMobile ? 40 : 60;
        const bottomOffset = isMobile ? 80 : 100;
        
        const x = Math.random() * (containerRect.width - shellSize - (margin * 2)) + margin;
        const y = Math.random() * (containerRect.height - topOffset - bottomOffset) + topOffset;
        
        shell.style.left = x + 'px';
        shell.style.top = y + 'px';
        
        shell.style.animationDelay = Math.random() * 2 + 's';
        
        // Add touch event listeners for mobile
        shell.addEventListener('click', (e) => this.collectShell(e, shell));
        shell.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.collectShell(e, shell);
        }, { passive: false });
        
        this.gameContainer.appendChild(shell);
        this.shells.push(shell);
        
        // Remove shell after time - shorter on mobile for easier gameplay
        const shellLifetime = isMobile ? 5000 : 6000;
        setTimeout(() => {
            if (this.gameContainer.contains(shell)) {
                this.gameContainer.removeChild(shell);
                this.shells = this.shells.filter(s => s !== shell);
                this.resetCombo();
            }
        }, shellLifetime);
        
        // Spawn next shell - more frequent on mobile
        const nextSpawnTime = isMobile ? 
            Math.random() * 1200 + 800 : 
            Math.random() * 1500 + 1000;
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
        
        // Calculate score with combo multiplier
        let points = shellValue;
        if (this.combo > 1) {
            points = Math.floor(shellValue * (1 + (this.combo - 1) * 0.2));
            this.showComboIndicator();
        }
        
        this.score += points;
        
        this.updateDisplay();
        
        // Reset combo timer
        clearTimeout(this.comboTimer);
        this.comboTimer = setTimeout(() => this.resetCombo(), 3000);
        
        // Remove shell from DOM and array
        setTimeout(() => {
            if (this.gameContainer.contains(shell)) {
                this.gameContainer.removeChild(shell);
            }
            this.shells = this.shells.filter(s => s !== shell);
        }, 500);
        
        // Recreate sand particles occasionally
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
        
        // Remove all remaining shells
        this.shells.forEach(shell => {
            if (this.gameContainer.contains(shell)) {
                this.gameContainer.removeChild(shell);
            }
        });
        
        // Show game over screen
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
    
    // Clear existing shells
    const existingShells = document.querySelectorAll('.seashell');
    existingShells.forEach(shell => shell.remove());
    
    // Clear sand particles
    const sandContainer = document.getElementById('sandParticles');
    if (sandContainer) sandContainer.innerHTML = '';
    
    // Start new game
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
    
    // Clear any remaining game elements
    const existingShells = document.querySelectorAll('.seashell');
    existingShells.forEach(shell => shell.remove());
    
    const sandContainer = document.getElementById('sandParticles');
    if (sandContainer) sandContainer.innerHTML = '';
}
