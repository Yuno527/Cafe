/**
 * ============================================================
 *  ONTOLOGÍA DEL CAFÉ COLOMBIANO
 *  Clases, jerarquías, taxonomías y relaciones
 * ============================================================
 */

// ─── CLASE BASE ────────────────────────────────────────────
class EntidadBase {
  constructor({ id, nombre, descripcion = '' }) {
    this.id          = id;
    this.nombre      = nombre;
    this.descripcion = descripcion;
  }
  toString() { return `[${this.constructor.name}] ${this.nombre}`; }
}

// ─── CLASE: REGIÓN ─────────────────────────────────────────
class Region extends EntidadBase {
  constructor({ id, nombre, descripcion, altitudMedia, clima, suelo, imagen }) {
    super({ id, nombre, descripcion });
    this.altitudMedia = altitudMedia;
    this.clima        = clima;
    this.suelo        = suelo || 'Volcánico';
    this.imagen       = imagen;
  }
  get categoriaAltitud() {
    if (this.altitudMedia >= 1900) return 'Muy Alta (> 1900 msnm)';
    if (this.altitudMedia >= 1600) return 'Alta (1600–1900 msnm)';
    return 'Media (< 1600 msnm)';
  }
}

// ─── TAXONOMÍAS (enumeraciones) ────────────────────────────
const TipoGrano = Object.freeze({
  ARABICA : 'Arábica',
  ROBUSTA : 'Robusta',
  LIBERICA: 'Libérica',
});

const MetodoProcesamiento = Object.freeze({
  LAVADO  : 'Lavado',
  NATURAL : 'Natural',
  HONEY   : 'Honey',
  ANAER   : 'Anaeróbico',
});

const Certificacion = Object.freeze({
  COMERCIO_JUSTO : 'Comercio Justo',
  ORGANICO       : 'Orgánico',
  RAINFOREST     : 'Rainforest Alliance',
  UTZ            : 'UTZ',
  CUATRO_C       : '4C',
  BIRD_FRIENDLY  : 'Bird Friendly',
});

const MetodoCultivo = Object.freeze({
  SOSTENIBLE   : 'Sostenible',
  AGROFORESTAL : 'Agroforestal',
  SOMBRA       : 'Sombra',
  TRADICIONAL  : 'Tradicional',
  ORGANICO     : 'Orgánico',
});

// ─── CLASE: VARIEDAD ───────────────────────────────────────
class Variedad extends EntidadBase {
  constructor({ id, nombre, descripcion, perfilSabor, altitudCultivo,
                tipoGrano, region, metodoProcesamiento, imagen, notasCata = [] }) {
    super({ id, nombre, descripcion });
    if (!(region instanceof Region))
      throw new TypeError('region debe ser instancia de Region');
    this.perfilSabor         = Array.isArray(perfilSabor)
                                 ? perfilSabor
                                 : perfilSabor.split(',').map(s => s.trim());
    this.altitudCultivo      = altitudCultivo;
    this.tipoGrano           = tipoGrano;
    this.region              = region;
    this.metodoProcesamiento = metodoProcesamiento;
    this.imagen              = imagen;
    this.notasCata           = notasCata;
  }
  get taxonomia()     { return `${this.tipoGrano} › ${this.nombre}`; }
  get regionNombre()  { return this.region.nombre; }
}

// ─── CLASE: PRODUCTOR ──────────────────────────────────────
class Productor extends EntidadBase {
  constructor({ id, nombre, descripcion, regiones, certificaciones = [],
                metodosCultivo = [], anioFundacion }) {
    super({ id, nombre, descripcion });
    if (!Array.isArray(regiones) || !regiones.every(r => r instanceof Region))
      throw new TypeError('regiones debe ser un array de instancias Region');
    this.regiones        = regiones;
    this.certificaciones = certificaciones;
    this.metodosCultivo  = metodosCultivo;
    this.anioFundacion   = anioFundacion || null;
  }
  get esCertificado()  { return this.certificaciones.length > 0; }
  get esSostenible()   { return this.metodosCultivo.includes(MetodoCultivo.SOSTENIBLE)
                              || this.metodosCultivo.includes(MetodoCultivo.AGROFORESTAL); }
  get regionesNombre() { return this.regiones.map(r => r.nombre).join(', '); }
}

// ─── CLASE: DERIVADO ───────────────────────────────────────
/**
 * Relaciona:
 *   • variedad    → Variedad base usada para preparar la bebida
 *   • regionConsumo → Región donde se consume popularmente
 *   • preparacion → Método de preparación
 *   • cadena      → Trazabilidad completa (propiedad calculada)
 */
class Derivado extends EntidadBase {
  constructor({ id, nombre, descripcion, variedad, regionConsumo,
                preparacion, temperatura = 'Caliente',
                intensidad = 'Media', popularidad = 3 }) {
    super({ id, nombre, descripcion });
    if (!(variedad instanceof Variedad))
      throw new TypeError('variedad debe ser instancia de Variedad');
    if (!(regionConsumo instanceof Region))
      throw new TypeError('regionConsumo debe ser instancia de Region');
    this.variedad      = variedad;       // relación → Variedad
    this.regionConsumo = regionConsumo;  // relación → Region de consumo
    this.preparacion   = preparacion;
    this.temperatura   = temperatura;
    this.intensidad    = intensidad;
    this.popularidad   = Math.min(5, Math.max(1, popularidad));
  }
  /** Trazabilidad: origen → variedad → proceso → bebida → consumo */
  get cadena() {
    return `${this.variedad.regionNombre} → ${this.variedad.nombre} `
         + `(${this.variedad.metodoProcesamiento}) → ${this.nombre} `
         + `→ Consumo: ${this.regionConsumo.nombre}`;
  }
  get perfilSaboresHeredados() { return this.variedad.perfilSabor; }
  get estrellas() {
    return '★'.repeat(this.popularidad) + '☆'.repeat(5 - this.popularidad);
  }
}

// ================================================================
//  INSTANCIAS DE DATOS
// ================================================================

// Regiones — imágenes locales del proyecto
const REGIONES = {
  huila:       new Region({ id:'1', nombre:'Huila',     descripcion:'Región montañosa del sur, cuna de cafés de concurso con alta acidez y dulzura notable.',              altitudMedia:1750, clima:'Tropical de altura',    suelo:'Volcánico rico en minerales',            imagen:'assest/Regiones/Huila.jpeg' }),
  antioquia:   new Region({ id:'2', nombre:'Antioquia', descripcion:'Cuna de la cultura cafetera colombiana, con tradición centenaria y gran biodiversidad.',              altitudMedia:1650, clima:'Tropical húmedo',        suelo:'Arcilloso con materia orgánica',         imagen:'assest/Regiones/Antioquia.jpeg' }),
  narino:      new Region({ id:'3', nombre:'Nariño',    descripcion:'Fronteriza con Ecuador, produce cafés de alta acidez cítrica cultivados cerca de los 2.100 metros.', altitudMedia:2100, clima:'Frío de montaña',        suelo:'Volcánico con alto contenido de nitrógeno', imagen:'assest/Regiones/Nariño.jpeg' }),
  tolima:      new Region({ id:'4', nombre:'Tolima',    descripcion:'Zona central con gran diversidad de microclimas que permite cultivar varios perfiles de sabor.',      altitudMedia:1700, clima:'Tropical de montaña',    suelo:'Franco arenoso',                         imagen:'assest/Regiones/Tolima.jpeg' }),
  caldas:      new Region({ id:'5', nombre:'Caldas',    descripcion:'Corazón del Eje Cafetero, Patrimonio de la Humanidad UNESCO.',                                       altitudMedia:1600, clima:'Subtropical húmedo',     suelo:'Volcánico negro (andosol)',              imagen:'assest/Regiones/Caldas.jpeg' }),
  todoColombia:new Region({ id:'0', nombre:'Todo el país', descripcion:'Consumido en todo el territorio colombiano.',                                                       altitudMedia:0,    clima:'Variado',               suelo:'Variado',                                imagen:null }),
};

// Variedades — imágenes locales del proyecto
const VARIEDADES = {
  caturra: new Variedad({
    id:'1', nombre:'Caturra',
    descripcion:'Mutación del Bourbon, muy productiva y de alta calidad. Ideal para altitudes medias en la región andina.',
    perfilSabor:['Caramelo','Chocolate','Cítricos'],
    altitudCultivo:1200, tipoGrano:TipoGrano.ARABICA,
    region:REGIONES.antioquia, metodoProcesamiento:MetodoProcesamiento.LAVADO,
    notasCata:['Acidez media-alta','Cuerpo medio','Dulce residual'],
    imagen:'assest/Tipos_Cafe/Caturra.jpeg'
  }),
  castillo: new Variedad({
    id:'2', nombre:'Castillo',
    descripcion:'Variedad resistente a la roya, desarrollada en Colombia por Cenicafé. Equilibrio perfecto entre rendimiento y calidad.',
    perfilSabor:['Dulce','Balanceado','Notas Florales'],
    altitudCultivo:1400, tipoGrano:TipoGrano.ARABICA,
    region:REGIONES.huila, metodoProcesamiento:MetodoProcesamiento.LAVADO,
    notasCata:['Acidez suave','Cuerpo completo','Final limpio'],
    imagen:'assest/Tipos_Cafe/Castillo.jpeg'
  }),
  tipica: new Variedad({
    id:'3', nombre:'Típica',
    descripcion:'Variedad tradicional de excelente taza. La primera en cultivarse en Colombia, trae consigo siglos de historia cafetera.',
    perfilSabor:['Dulce','Limpio','Acidez Brillante'],
    altitudCultivo:1800, tipoGrano:TipoGrano.ARABICA,
    region:REGIONES.narino, metodoProcesamiento:MetodoProcesamiento.NATURAL,
    notasCata:['Alta acidez','Cuerpo ligero','Retrogusto prolongado'],
    imagen:'assest/Tipos_Cafe/Tipica.jpeg'
  }),
  bourbon: new Variedad({
    id:'4', nombre:'Bourbon',
    descripcion:'Variedad clásica de alta calidad con cuerpo prominente y notas oscuras. Reconocida mundialmente por baristas especializados.',
    perfilSabor:['Chocolate Oscuro','Frutas Rojas','Cremoso'],
    altitudCultivo:1600, tipoGrano:TipoGrano.ARABICA,
    region:REGIONES.tolima, metodoProcesamiento:MetodoProcesamiento.HONEY,
    notasCata:['Acidez media','Cuerpo alto','Notas vinosas'],
    imagen:'assest/Tipos_Cafe/Bourbon.jpeg'
  }),
  geisha: new Variedad({
    id:'5', nombre:'Geisha',
    descripcion:'La joya de las variedades especiales. Cultivada en las alturas del Eje Cafetero, produce una taza de sabor extraordinario.',
    perfilSabor:['Jazmín','Bergamota','Mango'],
    altitudCultivo:2000, tipoGrano:TipoGrano.ARABICA,
    region:REGIONES.caldas, metodoProcesamiento:MetodoProcesamiento.LAVADO,
    notasCata:['Muy alta acidez','Cuerpo ligero','Aroma floral intenso'],
    imagen:'assest/Tipos_Cafe/Geisha.jpeg'
  }),
};

// Productores
const PRODUCTORES = [
  new Productor({ id:'1', nombre:'Cooperativa Caficultores del Huila',   descripcion:'Cooperativa con más de 3.000 familias caficultoras del Huila.', regiones:[REGIONES.huila],     certificaciones:[Certificacion.COMERCIO_JUSTO,Certificacion.ORGANICO,Certificacion.RAINFOREST], metodosCultivo:[MetodoCultivo.SOSTENIBLE,MetodoCultivo.AGROFORESTAL], anioFundacion:1965 }),
  new Productor({ id:'2', nombre:'Finca La Esperanza',                   descripcion:'Finca familiar reconocida por sus microlotes de alta calidad.',  regiones:[REGIONES.antioquia], certificaciones:[Certificacion.UTZ,Certificacion.ORGANICO],                                         metodosCultivo:[MetodoCultivo.SOSTENIBLE,MetodoCultivo.SOMBRA],       anioFundacion:1990 }),
  new Productor({ id:'3', nombre:'Asociación de Productores de Nariño',  descripcion:'Agrupa a pequeños productores de las altas montañas de Nariño.', regiones:[REGIONES.narino],    certificaciones:[Certificacion.COMERCIO_JUSTO,Certificacion.CUATRO_C],                              metodosCultivo:[MetodoCultivo.TRADICIONAL,MetodoCultivo.ORGANICO],    anioFundacion:2001 }),
];

// ── INSTANCIAS DE DERIVADOS ── (clase central solicitada)
const DERIVADOS = [
  new Derivado({ id:'1', nombre:'Tinto',              descripcion:'Café negro tradicional colombiano. Simple, fuerte y presente en cada rincón del país desde el amanecer.',          variedad:VARIEDADES.caturra,  regionConsumo:REGIONES.todoColombia, preparacion:'Filtrado en tela',                              temperatura:'Caliente', intensidad:'Media',      popularidad:5 }),
  new Derivado({ id:'2', nombre:'Café con Leche',     descripcion:'Combinación de café concentrado con leche caliente. El desayuno colombiano por excelencia en la región andina.',  variedad:VARIEDADES.castillo, regionConsumo:REGIONES.antioquia,    preparacion:'Espresso con leche vaporizada',                 temperatura:'Caliente', intensidad:'Suave',      popularidad:5 }),
  new Derivado({ id:'3', nombre:'Perico',             descripcion:'Café suave con un toque de leche. Acompañante del campesino colombiano, símbolo del campo y la ruralidad.',        variedad:VARIEDADES.caturra,  regionConsumo:REGIONES.huila,        preparacion:'Café diluido con agua caliente y un chorrito de leche', temperatura:'Caliente', intensidad:'Suave',      popularidad:4 }),
  new Derivado({ id:'4', nombre:'Espresso Colombiano',descripcion:'Shot concentrado elaborado con Geisha. Intensidad y complejidad aromática en cada sorbo.',                         variedad:VARIEDADES.geisha,   regionConsumo:REGIONES.caldas,       preparacion:'Máquina espresso a 9 bar, 25–30 segundos',      temperatura:'Caliente', intensidad:'Muy fuerte', popularidad:4 }),
  new Derivado({ id:'5', nombre:'Café de Olla',       descripcion:'Preparación tradicional en olla de barro con panela y canela. Herencia colonial en zonas rurales de Nariño.',     variedad:VARIEDADES.tipica,   regionConsumo:REGIONES.narino,       preparacion:'Hervido en olla de barro con panela y canela',  temperatura:'Caliente', intensidad:'Fuerte',     popularidad:3 }),
  new Derivado({ id:'6', nombre:'Cold Brew Bourbon',  descripcion:'Infusión en frío del Bourbon del Tolima. 24 horas de extracción lenta que resaltan notas de chocolate y frutas.', variedad:VARIEDADES.bourbon,  regionConsumo:REGIONES.tolima,       preparacion:'Infusión en frío 24 horas, relación 1:8 café/agua', temperatura:'Frío',     intensidad:'Fuerte',     popularidad:3 }),
];

// Exponer al ámbito global
window.CafeColombia = {
  EntidadBase, Region, Variedad, Productor, Derivado,
  TipoGrano, MetodoProcesamiento, Certificacion, MetodoCultivo,
  REGIONES, VARIEDADES, PRODUCTORES, DERIVADOS,
};

console.info('✅ Ontología cargada —',
  Object.keys(REGIONES).length - 1, 'regiones |',
  Object.keys(VARIEDADES).length, 'variedades |',
  PRODUCTORES.length, 'productores |',
  DERIVADOS.length, 'derivados'
);
