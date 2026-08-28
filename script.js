// Para producción en Coolify, reemplaza esta URL por la URL pública del backend.
const API_URL = 'http://localhost:3000';

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
    card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            playBirdAudio(audio);
        }
    });
});

soundBtn.addEventListener('click', () => {
    if (ambientAudio.paused) {
        ambientAudio.volume = 0.5;
        ambientAudio.play().catch(() => {});
        soundBtn.classList.add('active');
        soundBtn.setAttribute('aria-pressed', 'true');
        soundBtn.setAttribute('aria-label', 'Desactivar sonido ambiental');
        soundIcon.className = 'fas fa-volume-up';
    } else {
        ambientAudio.pause();
        ambientAudio.currentTime = 0;
        soundBtn.classList.remove('active');
        soundBtn.setAttribute('aria-pressed', 'false');
        soundBtn.setAttribute('aria-label', 'Activar sonido ambiental');
        soundIcon.className = 'fas fa-volume-mute';
        stopBirdAudio();
    }
});

const birdsContainer = document.getElementById('contenedor-aves');
const searchInput = document.getElementById('busqueda-aves');
const initialBirdCards = [...birdsContainer.children];
let currentRequestController = null;
let searchTimeout = null;

function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[character]));
}

function renderBirds(birds) {
    if (birds.length === 0) {
        birdsContainer.innerHTML = '<p class="col-span-full py-12 text-center text-gray-400">No encontramos aves con esa búsqueda.</p>';
        return;
    }

    birdsContainer.innerHTML = birds.map(bird => `
        <article class="card reveal overflow-hidden rounded-[15px] border border-white/10 bg-black/60 backdrop-blur-[15px] transition-transform duration-500 hover:-translate-y-2.5 hover:shadow-2xl" data-bird="${escapeHTML(bird.nombre)}" tabindex="0">
            <div class="h-[250px] overflow-hidden">
                <img class="h-full w-full bg-black object-contain transition-transform duration-500 hover:scale-110" src="${escapeHTML(bird.url_imagen)}" alt="${escapeHTML(bird.titulo)}" loading="lazy" decoding="async">
            </div>
            <div class="p-6">
                <h3 class="mb-2.5 font-display text-3xl text-gold">${escapeHTML(bird.titulo)}</h3>
                <p class="text-[.95rem] font-light leading-relaxed text-gray-300">${escapeHTML(bird.descripcion)}</p>
                <audio class="mt-5 w-full" controls preload="none" src="${escapeHTML(bird.url_audio)}" aria-label="Reproducir canto de ${escapeHTML(bird.titulo)}"></audio>
            </div>
        </article>
    `).join('');

    birdsContainer.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    birdsContainer.querySelectorAll('.card[data-bird]').forEach(card => {
        const image = card.querySelector('img');
        const audio = card.querySelector('audio');
        if (image) image.parentElement.style.setProperty('--bird-image', `url("${image.src}")`);
        card.addEventListener('mouseenter', () => playBirdAudio(audio));
        card.addEventListener('mouseleave', stopBirdAudio);
        card.addEventListener('focus', () => playBirdAudio(audio));
        card.addEventListener('blur', stopBirdAudio);
    });
}

function restoreInitialBirds() {
    if (currentRequestController) currentRequestController.abort();
    birdsContainer.replaceChildren(...initialBirdCards);
    birdsContainer.setAttribute('aria-busy', 'false');
}

async function loadBirds(search = '') {
    if (currentRequestController) currentRequestController.abort();
    currentRequestController = new AbortController();
    const endpoint = new URL('/api/aves', API_URL);
    if (search.trim()) endpoint.searchParams.set('buscar', search.trim());
    birdsContainer.setAttribute('aria-busy', 'true');

    try {
        const response = await fetch(endpoint, { signal: currentRequestController.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        renderBirds(await response.json());
    } catch (error) {
        if (error.name !== 'AbortError') {
            birdsContainer.innerHTML = '<p class="col-span-full py-12 text-center text-red-300">No se pudieron cargar las aves. Comprueba que el backend esté disponible.</p>';
        }
    } finally {
        birdsContainer.setAttribute('aria-busy', 'false');
    }
}

searchInput.addEventListener('input', event => {
    clearTimeout(searchTimeout);
    const searchTerm = event.target.value.trim();
    if (!searchTerm) {
        restoreInitialBirds();
        return;
    }
    searchTimeout = setTimeout(() => loadBirds(searchTerm), 250);
});

searchInput.closest('form').addEventListener('submit', event => event.preventDefault());
loadBirds();
