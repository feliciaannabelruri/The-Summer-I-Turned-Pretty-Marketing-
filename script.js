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
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
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

// Seashell Game Class
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
        
        // Fewer particles on mobile for better performance
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 3 : 6;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'sand-particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                container.appendChild(particle);
                
                // Clean up particles after animation
                setTimeout(() => {
                    if (container.contains(particle)) {
                        container.removeChild(particle);
                    }
                }, 6000);
            }, i * 300);
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
        
        // Mobile-responsive positioning
        const containerRect = this.gameContainer.getBoundingClientRect();
        const isMobile = window.innerWidth <= 768;
        
        const shellSize = isMobile ? 28 : 35;
        const margin = isMobile ? 10 : 15;
        const topOffset = isMobile ? 35 : 50;
        const bottomOffset = isMobile ? 70 : 90;
        
        const x = Math.random() * (containerRect.width - shellSize - (margin * 2)) + margin;
        const y = Math.random() * (containerRect.height - topOffset - bottomOffset) + topOffset;
        
        shell.style.left = x + 'px';
        shell.style.top = y + 'px';
        shell.style.animationDelay = Math.random() * 2 + 's';
        
        // Touch-friendly event listeners
        shell.addEventListener('click', (e) => this.collectShell(e, shell));
        shell.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.collectShell(e, shell);
        }, { passive: false });
        
        // Prevent context menu on long press (mobile)
        shell.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        this.gameContainer.appendChild(shell);
        this.shells.push(shell);
        
        // Shell lifetime - shorter on mobile for easier gameplay
        const shellLifetime = isMobile ? 4000 : 5500;
        setTimeout(() => {
            if (this.gameContainer.contains(shell)) {
                this.gameContainer.removeChild(shell);
                this.shells = this.shells.filter(s => s !== shell);
                this.resetCombo();
            }
        }, shellLifetime);
        
        // Spawn timing - more frequent on mobile
        const nextSpawnTime = isMobile ? 
            Math.random() * 1000 + 700 : 
            Math.random() * 1300 + 900;
        setTimeout(() => this.spawnShell(), nextSpawnTime);
    }

    collectShell(event, shell) {
        event.preventDefault();
        event.stopPropagation();
        
        if (!this.gameRunning || shell.classList.contains('collected')) return;
        
        shell.classList.add('collected');
        const shellValue = parseInt(shell.dataset.value);
        
        this.combo++;
        this.shellCount++;
        
        // Calculate score with combo multiplier
        let points = shellValue;
        if (this.combo > 1) {
            points = Math.floor(shellValue * (1 + (this.combo - 1) * 0.25));
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
        
        // Create sand particles effect
        if (Math.random() < 0.4) {
            this.createSandParticles();
        }
    }

    showComboIndicator() {
        const indicator = document.getElementById('comboIndicator');
        if (!indicator) return;
        
        let comboText = '';
        if (this.combo <= 3) {
            comboText = `COMBO x${this.combo}!`;
        } else if (this.combo <= 6) {
            comboText = `AMAZING x${this.combo}! ⭐`;
        } else {
            comboText = `INCREDIBLE x${this.combo}! 🌟✨`;
        }
        
        indicator.textContent = comboText;
        indicator.classList.remove('combo-show');
        // Force reflow
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
            if (timeEl) {
                timeEl.textContent = this.timeLeft + 's';
                
                // Warning color for low time
                if (this.timeLeft <= 10) {
                    timeEl.style.color = '#dc3545';
                    timeEl.style.fontWeight = 'bold';
                }
            }
            
            if (this.timeLeft <= 0) {
                clearInterval(timer);
                this.endGame();
            }
        }, 1000);
    }

    startGameLoop() {
        // Periodic sand particle generation
        const particleInterval = setInterval(() => {
            if (!this.gameRunning) {
                clearInterval(particleInterval);
                return;
            }
            if (Math.random() < 0.15) {
                this.createSandParticles();
            }
        }, 2500);
    }

    endGame() {
        this.gameRunning = false;
        
        // Remove all remaining shells
        this.shells.forEach(shell => {
            if (this.gameContainer.contains(shell)) {
                shell.style.animation = 'collect 0.3s ease-out forwards';
                setTimeout(() => {
                    if (this.gameContainer.contains(shell)) {
                        this.gameContainer.removeChild(shell);
                    }
                }, 300);
            }
        });
        this.shells = [];
        
        // Show game over screen with results
        setTimeout(() => {
            const finalScoreEl = document.getElementById('finalScore');
            const finalShellsEl = document.getElementById('finalShells');
            
            if (finalScoreEl) finalScoreEl.textContent = this.score;
            if (finalShellsEl) finalShellsEl.textContent = this.shellCount;
            
            const gameOverEl = document.getElementById('gameOver');
            if (gameOverEl) {
                gameOverEl.style.display = 'flex';
                gameOverEl.style.animation = 'fadeIn 0.5s ease-out';
            }
        }, 500);
    }
}

let game;

function toggleGame() {
    const gameContainer = document.getElementById('gameContainer');
    const startBtn = document.querySelector('.start-game-btn');
    
    if (gameContainer.style.display === 'none') {
        gameContainer.style.display = 'block';
        startBtn.textContent = '🏖️ Hide Game';
        startBtn.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
        startGame();
    } else {
        gameContainer.style.display = 'none';
        startBtn.textContent = '🐚 Start Game';
        startBtn.style.background = 'linear-gradient(135deg, var(--sunset-peach), var(--warm-sand))';
        if (game) {
            game.gameRunning = false;
        }
        // Clear any remaining elements
        clearGameElements();
    }
}

function startGame() {
    // Reset display elements
    const elements = {
        score: document.getElementById('score'),
        shellCount: document.getElementById('shellCount'),
        timeLeft: document.getElementById('timeLeft'),
        combo: document.getElementById('combo')
    };
    
    Object.values(elements).forEach(el => {
        if (el) {
            el.textContent = el.id === 'timeLeft' ? '60s' : '0';
            el.style.color = '';
            el.style.fontWeight = '';
        }
    });
    
    // Clear previous game elements
    clearGameElements();
    
    // Start new game
    game = new SeashellGame();
}

function restartGame() {
    const gameOverEl = document.getElementById('gameOver');
    if (gameOverEl) gameOverEl.style.display = 'none';
    
    clearGameElements();
    startGame();
}

function closeGame() {
    const gameOverEl = document.getElementById('gameOver');
    const gameContainer = document.getElementById('gameContainer');
    const startBtn = document.querySelector('.start-game-btn');
    
    if (gameOverEl) gameOverEl.style.display = 'none';
    if (gameContainer) gameContainer.style.display = 'none';
    if (startBtn) {
        startBtn.textContent = '🐚 Start Game';
        startBtn.style.background = 'linear-gradient(135deg, var(--sunset-peach), var(--warm-sand))';
    }
    
    if (game) {
        game.gameRunning = false;
    }
    
    clearGameElements();
}

function clearGameElements() {
    // Clear shells
    const existingShells = document.querySelectorAll('.seashell');
    existingShells.forEach(shell => shell.remove());
    
    // Clear sand particles
    const sandContainer = document.getElementById('sandParticles');
    if (sandContainer) sandContainer.innerHTML = '';
}

// Loading animation
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    document.body.style.opacity = '1';
});

// Smooth scrolling behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Card hover effects with subtle animations
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.content-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
        });
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

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.highlight-box').forEach(box => {
        highlightObserver.observe(box);
    });
});

// Dynamic background gradient based on scroll position
window.addEventListener('scroll', () => {
    const scrollPercent = Math.min(100, (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    
    // Subtle color shift in hero background based on scroll
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        const hue = 200 + (scrollPercent * 0.3);
        const saturation = Math.max(50, 70 - (scrollPercent * 0.1));
        heroBg.style.filter = `hue-rotate(${scrollPercent * 0.3}deg) saturate(${saturation}%)`;
    }
});

// Mobile-friendly touch events
if ('ontouchstart' in window) {
    document.addEventListener('DOMContentLoaded', () => {
        // Add touch-friendly styles
        const style = document.createElement('style');
        style.textContent = `
            .seashell:active {
                transform: scale(1.2) rotate(15deg) !important;
                filter: brightness(1.4) !important;
            }
            
            .start-game-btn:active,
            .restart-btn:active,
            .close-game-btn:active {
                transform: translateY(-1px) !important;
            }
        `;
        document.head.appendChild(style);
    });
}

// Performance optimization for mobile
const isMobile = window.innerWidth <= 768;
if (isMobile) {
    // Reduce animation complexity on mobile
    document.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.textContent = `
            .hero-bg {
                will-change: auto;
            }
            
            .animate-on-scroll {
                transition: all 0.5s ease;
            }
            
            .content-card {
                transition: all 0.2s ease;
            }
        `;
        document.head.appendChild(style);
    });
}

// Prevent zoom on double tap for iOS
document.addEventListener('DOMContentLoaded', () => {
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
});

// Add custom CSS animations
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes slideInFromLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        .highlight-box::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            animation: shimmer 6s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
});

// Error handling for game
window.addEventListener('error', (event) => {
    console.error('Game error:', event.error);
    const gameOverEl = document.getElementById('gameOver');
    if (gameOverEl && gameOverEl.style.display === 'flex') {
        // Game is running, try to gracefully handle error
        if (game) {
            game.gameRunning = false;
        }
    }
});

// Visibility change handling (for mobile browsers)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && game && game.gameRunning) {
        // Pause game when tab is hidden
        game.gameRunning = false;
        const gameOverEl = document.getElementById('gameOver');
        if (gameOverEl) {
            gameOverEl.style.display = 'flex';
        }
    }
});
