// sparkles.js
export function createSparkleBurst(container) {
    for (let i = 0; i < 20; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      container.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1000);
    }
  }
  
  export function startGlowingBorder(container) {
    container.classList.add('glow');
  }