// server.js
// Backend de la API de App Pajarito.
// Expone datos de aves (nombre, descripciones, imagen, audio) desde una base
// de datos PostgreSQL, para que el frontend arme las tarjetas dinámicamente.

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const aves = [
    {
        nombre: 'tucan', titulo: 'Tucán Tropical',
        descripcion: 'Reconocible por su enorme pico colorido.',
        url_imagen: 'https://images.unsplash.com/photo-1555169062-013468b47731?q=75&w=800&auto=format&fit=crop',
        url_audio: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Toco_Toucan_call_%28Ramphastos_toco%29.ogg',
    },
    {
        nombre: 'colibri', titulo: 'Colibrí Esmeralda',
        descripcion: 'Puede batir sus alas más de 50 veces por segundo.',
        url_imagen: 'https://images.unsplash.com/photo-1520552159191-e28a1d9f0d7e?q=75&w=800&auto=format&fit=crop',
        url_audio: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Calypte_anna_-_Anna%27s_Hummingbird_XC109651.mp3',
    },
    {
        nombre: 'buho', titulo: 'Búho Nival',
        descripcion: 'Cazador nocturno de vuelo silencioso.',
        url_imagen: 'https://images.unsplash.com/photo-1547732463-553e72480112?q=75&w=800&auto=format&fit=crop',
        url_audio: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Ninox_scutulata_-_Brown_Hawk-Owl_XC382468.mp3',
    },
    {
        nombre: 'guacamayo', titulo: 'Guacamayo Escarlata',
        descripcion: 'Uno de los loros más grandes y coloridos.',
        url_imagen: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?q=75&w=800&auto=format&fit=crop',
        url_audio: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Scarlet_macaw_01.wav',
    },
    {
        nombre: 'benteveo', titulo: 'Benteveo Tropical',
        descripcion: 'Ave muy común en Sudamérica, canto inconfundible.',
        url_imagen: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Great_kiskadee_%2870240%29.jpg',
        url_audio: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Pitangus_sulphuratus_-_Great_Kiskadee_XC248744.mp3',
    },
    {
        nombre: 'jacamar', titulo: 'Jacamar Cobrizo',
        descripcion: 'Plumaje iridiscente, caza insectos al vuelo.',
        url_imagen: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Rufous-tailed_jacamar_%28Galbula_ruficauda%29_male_2.JPG',
        url_audio: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Galbula_ruficauda_-_Rufous-tailed_Jacamar_XC250854.mp3',
    },
    {
        nombre: 'tangara', titulo: 'Tangara Azuleja',
        descripcion: 'Pequeña ave de colores azules muy vivos.',
        url_imagen: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Blue-grey_tanager_%28Thraupis_episcopus_berlepschi%29.jpg',
        url_audio: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Thraupis_episcopus_-_Blue-grey_Tanager_XC243186.mp3',
    },
    {
        nombre: 'motmot', titulo: 'Momoto Coroniceleste',
        descripcion: 'Su cola en forma de péndulo es su sello distintivo.',
        url_imagen: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Momotus_momotaAQBIP08CA.jpg',
        url_audio: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Baryphthengus_martii_-_Rufous_Motmot_XC250538.mp3',
    },
    {
        nombre: 'carpintero', titulo: 'Carpintero Tropical',
        descripcion: 'Picotea la madera en busca de insectos.',
        url_imagen: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Dryocopus_lineatus_%28Carpintero_real%29_%2824793532516%29.jpg',
        url_audio: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Dryocopus_lineatus_-_Lineated_Woodpecker_XC214145.mp3',
    },
    {
        nombre: 'martin', titulo: 'Martín Pescador',
        descripcion: 'Se lanza en picada al agua para atrapar peces.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ringed%20Kingfisher%2C%20Rio%20Sarar%C3%A9%2C%20Mato%20Grosso%2C%20Brazil.jpg',
        url_audio: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Megaceryle_torquata_-_Ringed_Kingfisher_XC251087.mp3',
    },
];

async function inicializarBaseDeDatos() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS aves (
            id SERIAL PRIMARY KEY,
            nombre TEXT UNIQUE NOT NULL,
            titulo TEXT NOT NULL,
            descripcion TEXT,
            url_imagen TEXT NOT NULL,
            url_audio TEXT NOT NULL
        )
    `);

    const { rows } = await pool.query('SELECT COUNT(*) FROM aves');
    if (parseInt(rows[0].count) === 0) {
        for (const ave of aves) {
            await pool.query(
                `INSERT INTO aves (nombre, titulo, descripcion, url_imagen, url_audio)
                 VALUES ($1, $2, $3, $4, $5)`,
                [ave.nombre, ave.titulo, ave.descripcion, ave.url_imagen, ave.url_audio]
            );
        }
        console.log(`Tabla lista, ${aves.length} aves cargadas.`);
    } else {
        console.log('Tabla lista, ya tenía datos cargados.');
    }
}

app.get('/api/aves', async (req, res) => {
    const { buscar } = req.query;
    try {
        let resultado;
        if (buscar) {
            resultado = await pool.query(
                `SELECT * FROM aves WHERE nombre ILIKE $1 OR titulo ILIKE $1 ORDER BY titulo`,
                [`%${buscar}%`]
            );
        } else {
            resultado = await pool.query('SELECT * FROM aves ORDER BY titulo');
        }
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
});

app.get('/api/aves/:nombre', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM aves WHERE nombre = $1',
            [req.params.nombre]
        );
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Ave no encontrada' });
        }
        res.json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
});

const PUERTO = process.env.PORT || 3000;

inicializarBaseDeDatos()
    .then(() => {
        app.listen(PUERTO, () => {
            console.log(`Servidor escuchando en puerto ${PUERTO}`);
        });
    })
    .catch((error) => {
        console.error('No se pudo conectar a la base de datos:', error);
        process.exit(1);
    });