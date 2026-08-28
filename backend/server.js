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
    {
        nombre: 'quetzal', titulo: 'Quetzal Resplandeciente',
        descripcion: 'Ave emblemática de los bosques nublados de Mesoamérica, reconocible por su plumaje verde y su larga cola.',
        url_imagen: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Quetzal01.jpg',
        url_audio: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Resplendent_Quetzal_song_%28Pharomachrus_mocinno%29.ogg',
    },
    {
        nombre: 'condor-andino', titulo: 'Cóndor Andino',
        descripcion: 'Planea sobre la cordillera de los Andes y es una de las aves voladoras más grandes del mundo.',
        url_imagen: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/204_-_Canyon_de_Colca_-_Condor_des_Andes_-_Juin_2010.JPG',
        url_audio: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Andean_Condor_call_%28Vultur_gryphus%29.ogg',
    },
    {
        nombre: 'aguila-arpia', titulo: 'Águila Arpía',
        descripcion: 'Poderosa rapaz de las selvas tropicales, adaptada para cazar entre las copas de los árboles.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Harpia%20harpyja%20-%20Harpy%20Eagle.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Harpia%20harpyja%20-%20Harpy%20Eagle.ogg',
    },
    {
        nombre: 'tucan-pico-arcoiris', titulo: 'Tucán Pico Arcoíris',
        descripcion: 'Habita los bosques húmedos de Centroamérica y destaca por su enorme pico multicolor.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Keel-billed%20Toucan%20%28Ramphastos%20sulfuratus%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ramphastos%20sulfuratus%20-%20Keel-billed%20Toucan.ogg',
    },
    {
        nombre: 'hornero', titulo: 'Hornero Común',
        descripcion: 'Construye nidos de barro con forma de horno y es una presencia habitual en campos y ciudades sudamericanas.',
        url_imagen: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Hornero_y_su_casa.jpg',
        url_audio: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Furnarius_rufus.ogg',
    },
    {
        nombre: 'sabiá', titulo: 'Sabiá Común',
        descripcion: 'Su canto melodioso acompaña los amaneceres de bosques, jardines y parques de Sudamérica.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rufous-bellied%20Thrush%20%28Turdus%20rufiventris%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Turdus%20rufiventris%20-%20Rufous-bellied%20Thrush.ogg',
    },
    {
        nombre: 'gallito-de-las-rocas', titulo: 'Gallito de las Rocas',
        descripcion: 'Ave de los bosques andinos cuyo plumaje naranja intenso resalta durante sus despliegues de cortejo.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Andean%20Cock-of-the-rock%20%28Rupicola%20peruvianus%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rupicola%20peruvianus%20-%20Andean%20Cock-of-the-rock.ogg',
    },
    {
        nombre: 'pava-de-monte', titulo: 'Pava de Monte',
        descripcion: 'Se desplaza entre los árboles de las selvas neotropicales alimentándose de frutos y semillas.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Plain%20Chachalaca%20%28Ortalis%20vetula%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ortalis%20vetula%20-%20Plain%20Chachalaca.ogg',
    },
    {
        nombre: 'caracara', titulo: 'Carancho',
        descripcion: 'Rapaz oportunista de espacios abiertos, frecuente desde el sur de Estados Unidos hasta la Patagonia.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Southern%20Crested%20Caracara%20%28Caracara%20plancus%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Caracara%20plancus%20-%20Southern%20Crested%20Caracara.ogg',
    },
    {
        nombre: 'chingolo', titulo: 'Chingolo',
        descripcion: 'Pequeño cantor de garganta rojiza que habita montes, pastizales y zonas urbanas de gran parte de Sudamérica.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rufous-collared%20Sparrow%20%28Zonotrichia%20capensis%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Zonotrichia%20capensis%20-%20Rufous-collared%20Sparrow.ogg',
    },
    {
        nombre: 'urraca-verde', titulo: 'Urraca Verde',
        descripcion: 'Su plumaje verde y azul ilumina los bordes de los bosques y las zonas arboladas de Centroamérica.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Green%20Jay%20%28Cyanocorax%20yncas%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cyanocorax%20yncas%20-%20Green%20Jay.ogg',
    },
    {
        nombre: 'ani', titulo: 'Garrapatero Ani',
        descripcion: 'Ave social de pico curvo que busca insectos y pequeños frutos en sabanas, potreros y claros tropicales.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Smooth-billed%20Ani%20%28Crotophaga%20ani%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Crotophaga%20ani%20-%20Smooth-billed%20Ani.ogg',
    },
    {
        nombre: 'flamenco-chileno', titulo: 'Flamenco Chileno',
        descripcion: 'Camina por lagunas salinas de los Andes y filtra pequeños organismos con su pico curvado.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chilean%20flamingo%20%28Phoenicopterus%20chilensis%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Phoenicopterus%20chilensis%20-%20Chilean%20Flamingo.ogg',
    },
    {
        nombre: 'jabiru', titulo: 'Jabirú',
        descripcion: 'Cigüeña gigante de humedales tropicales, con cuello negro y un característico saco rojo en la garganta.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jabiru%20%28Jabiru%20mycteria%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jabiru%20mycteria%20-%20Jabiru.ogg',
    },
    {
        nombre: 'hoatzin', titulo: 'Hoacín',
        descripcion: 'Ave amazónica de aspecto singular que se alimenta principalmente de hojas y vive junto a ríos y pantanos.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hoatzin%20%28Opisthocomus%20hoazin%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Opisthocomus%20hoazin%20-%20Hoatzin.ogg',
    },
    {
        nombre: 'potoo', titulo: 'Potoo Común',
        descripcion: 'Ave nocturna de plumaje críptico que permanece inmóvil sobre las ramas durante el día.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Common%20Potoo%20%28Nyctibius%20griseus%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nyctibius%20griseus%20-%20Common%20Potoo.ogg',
    },
    {
        nombre: 'trogon-de-corona-azul', titulo: 'Trogón de Corona Azul',
        descripcion: 'Ave colorida de los bosques neotropicales, donde busca frutos e insectos entre el follaje.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Blue-crowned%20Trogon%20%28Trogon%20curucui%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Trogon%20curucui%20-%20Blue-crowned%20Trogon.ogg',
    },
    {
        nombre: 'ibis-escarlata', titulo: 'Ibis Escarlata',
        descripcion: 'Su plumaje rojo intenso contrasta con los manglares y humedales costeros del norte de Sudamérica.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Scarlet%20Ibis%20%28Eudocimus%20ruber%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Eudocimus%20ruber%20-%20Scarlet%20Ibis.ogg',
    },
    {
        nombre: 'espátula-rosada', titulo: 'Espátula Rosada',
        descripcion: 'Recorre aguas poco profundas moviendo su pico en forma de espátula para encontrar alimento.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Roseate%20Spoonbill%20%28Platalea%20ajaja%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Platalea%20ajaja%20-%20Roseate%20Spoonbill.ogg',
    },
    {
        nombre: 'zopilote-rey', titulo: 'Zopilote Rey',
        descripcion: 'Gran carroñera de las selvas americanas, distinguida por su cabeza desnuda y su colorido plumaje.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/King%20Vulture%20%28Sarcoramphus%20papa%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sarcoramphus%20papa%20-%20King%20Vulture.ogg',
    },
    {
        nombre: 'carpintero-lineado', titulo: 'Carpintero Lineado',
        descripcion: 'Usa su pico fuerte para descubrir insectos bajo la corteza y tamborilea para marcar su territorio.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lineated%20Woodpecker%20%28Dryocopus%20lineatus%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dryocopus%20lineatus%20-%20Lineated%20Woodpecker.ogg',
    },
    {
        nombre: 'tijereta', titulo: 'Tijereta de Mar',
        descripcion: 'Vuela sobre costas y estuarios con su cola profundamente bifurcada y captura peces desde el aire.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Black%20Skimmer%20%28Rynchops%20niger%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rynchops%20niger%20-%20Black%20Skimmer.ogg',
    },
    {
        nombre: 'tero', titulo: 'Tero Común',
        descripcion: 'Defiende sus nidos en pastizales y humedales con un llamado fuerte y vuelos de distracción.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Southern%20Lapwing%20%28Vanellus%20chilensis%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vanellus%20chilensis%20-%20Southern%20Lapwing.ogg',
    },
    {
        nombre: 'milano-tijereta', titulo: 'Milano Tijereta',
        descripcion: 'Rapaz migratoria de alas largas que se desliza sobre bosques y sabanas en busca de pequeños animales.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Swallow-tailed%20Kite%20%28Elanoides%20forficatus%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Elanoides%20forficatus%20-%20Swallow-tailed%20Kite.ogg',
    },
    {
        nombre: 'azulejo', titulo: 'Azulejo de Jardín',
        descripcion: 'Pequeño frugívoro de plumaje azul que visita jardines, bordes de bosque y zonas cultivadas.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Blue-gray%20Tanager%20%28Thraupis%20episcopus%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Thraupis%20episcopus%20-%20Blue-gray%20Tanager.ogg',
    },
    {
        nombre: 'tangara-de-siete-colores', titulo: 'Tangara de Siete Colores',
        descripcion: 'Una de las aves más vistosas del Caribe y el norte de Sudamérica, asociada a bosques húmedos.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Seven-colored%20Tanager%20%28Tangara%20fastuosa%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tangara%20fastuosa%20-%20Seven-colored%20Tanager.ogg',
    },
    {
        nombre: 'reinita-coronada', titulo: 'Reinita Coronada',
        descripcion: 'Pequeña ave insectívora que recorre las ramas bajas y el sotobosque en busca de alimento.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Golden-crowned%20Warbler%20%28Basileuterus%20culicivorus%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Basileuterus%20culicivorus%20-%20Golden-crowned%20Warbler.ogg',
    },
    {
        nombre: 'martin-pescador-verde', titulo: 'Martín Pescador Verde',
        descripcion: 'Se posa cerca de ríos y lagunas para lanzarse al agua y capturar peces pequeños.',
        url_imagen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Amazon%20Kingfisher%20%28Chloroceryle%20amazona%29.jpg',
        url_audio: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chloroceryle%20amazona%20-%20Amazon%20Kingfisher.ogg',
    },
];

const nombresDeCalidad = new Set(['tucan', 'colibri', 'buho', 'guacamayo', 'benteveo', 'jacamar', 'tangara', 'motmot', 'carpintero', 'martin', 'quetzal', 'condor-andino', 'hornero']);
const avesDeCalidad = aves.filter(ave => nombresDeCalidad.has(ave.nombre));
const nombresNoVerificados = aves.filter(ave => !nombresDeCalidad.has(ave.nombre)).map(ave => ave.nombre);

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

    if (nombresNoVerificados.length > 0) {
        await pool.query('DELETE FROM aves WHERE nombre = ANY($1::text[])', [nombresNoVerificados]);
    }

    for (const ave of avesDeCalidad) {
        await pool.query(
            `INSERT INTO aves (nombre, titulo, descripcion, url_imagen, url_audio)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (nombre) DO NOTHING`,
            [ave.nombre, ave.titulo, ave.descripcion, ave.url_imagen, ave.url_audio]
        );
    }
    console.log(`Tabla lista, ${avesDeCalidad.length} aves verificadas disponibles en el catálogo.`);
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