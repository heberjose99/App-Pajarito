// Aparición progresiva de las secciones.
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

// Reproducción de archivos reales alojados en Wikimedia Commons.
let activeAudio = null;
let ambientWasPlaying = false;
const ambientAudio = document.getElementById('ambientAudio');
const soundBtn = document.getElementById('soundToggle');
const soundIcon = soundBtn.querySelector('i');
const extendedDescriptions = {
    tucan: 'Su pico también le ayuda a regular el calor y a intimidar a posibles competidores.',
    colibri: 'Su metabolismo exige alimentarse muchas veces al día, por eso visita flores de forma constante.',
    buho: 'Sus plumas están adaptadas para romper el ruido del aire y acercarse sin ser detectado.',
    guacamayo: 'Vive en grupos familiares y utiliza llamados intensos para mantenerse en contacto durante el vuelo.',
    benteveo: 'Es una especie adaptable que suele observarse cerca de ríos, claros y zonas abiertas del bosque.',
    jacamar: 'Su pico largo y fino funciona como una herramienta precisa para capturar presas en pleno vuelo.',
    tangara: 'Busca frutos pequeños e insectos entre las copas, donde sus colores se mezclan con la luz del follaje.',
    motmot: 'Excava túneles en taludes y barrancas para anidar, una conducta poco común entre las aves del dosel.',
    carpintero: 'Sus golpes localizan cavidades y larvas bajo la corteza, mientras su cola le sirve de apoyo.',
    martin: 'Se lanza desde una rama y vuelve a posarse en segundos, casi siempre con el reflejo de la presa asegurado.'
};

function stopBirdAudio() {
    if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
        activeAudio = null;
    }
    if (ambientWasPlaying && soundBtn.classList.contains('active')) {
        ambientAudio.play().catch(() => {});
    }
    ambientWasPlaying = false;
}

function playBirdAudio(audio) {
    if (!audio) return;
    if (activeAudio && activeAudio !== audio) stopBirdAudio();
    if (!ambientAudio.paused) {
        ambientWasPlaying = true;
        ambientAudio.pause();
    }
    activeAudio = audio;
    audio.currentTime = 0;
    audio.volume = 0.85;
    audio.play().catch(() => {
        // Algunos navegadores exigen una interacción previa del usuario.
    });
}

document.querySelectorAll('.card[data-bird]').forEach(card => {
    const image = card.querySelector('img');
    const audio = card.querySelector('audio');
    const imageFrame = image ? image.parentElement : null;
    const moreDescription = extendedDescriptions[card.dataset.bird];
    if (image) image.parentElement.style.setProperty('--bird-image', `url("${image.currentSrc || image.src}")`);
    if (imageFrame && moreDescription) {
        const detail = document.createElement('p');
        detail.className = 'card-more';
        detail.id = `description-${card.dataset.bird}`;
        detail.textContent = moreDescription;
        imageFrame.append(detail);
        card.setAttribute('aria-describedby', detail.id);
    }
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
        soundBtn.classList.remove('active');
        soundBtn.setAttribute('aria-pressed', 'false');
        soundIcon.className = 'fas fa-volume-mute';
        stopBirdAudio();
    }
});
