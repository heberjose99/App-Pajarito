// Aparición progresiva de las secciones.
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

// Reproducción de archivos reales alojados en Wikimedia Commons.
let activeAudio = null;
const ambientAudio = document.getElementById('ambientAudio');
const soundBtn = document.getElementById('soundToggle');
const soundIcon = soundBtn.querySelector('i');

function stopBirdAudio() {
    if (!activeAudio) return;
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
}

function playBirdAudio(audio) {
    if (!audio) return;
    if (activeAudio && activeAudio !== audio) stopBirdAudio();
    activeAudio = audio;
    audio.currentTime = 0;
    audio.volume = 0.85;
    audio.play().catch(() => {
        // Algunos navegadores exigen una interacción previa del usuario.
    });
}

document.querySelectorAll('.card[data-bird]').forEach(card => {
    const audio = card.querySelector('audio');
    card.addEventListener('mouseenter', () => playBirdAudio(audio));
    card.addEventListener('mouseleave', stopBirdAudio);
    card.addEventListener('focus', () => playBirdAudio(audio));
    card.addEventListener('blur', stopBirdAudio);
});

soundBtn.addEventListener('click', () => {
    if (ambientAudio.paused) {
        ambientAudio.volume = 0.5;
        ambientAudio.play().catch(() => {});
        soundBtn.classList.add('active');
        soundBtn.setAttribute('aria-pressed', 'true');
        soundIcon.className = 'fas fa-volume-up';
    } else {
        ambientAudio.pause();
        ambientAudio.currentTime = 0;
        stopBirdAudio();
        soundBtn.classList.remove('active');
        soundBtn.setAttribute('aria-pressed', 'false');
        soundIcon.className = 'fas fa-volume-mute';
    }
});
