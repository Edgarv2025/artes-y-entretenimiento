const paquetesData = [
  {
    id: "elegance",
    titulo: "PLAN ELEGANCE",
    precio: "$600.000",
    imagen: "assets/plan-elegance.png", 
    elementos: [
      "2 Cabinas Profesionales",
      "Cercha Tipo T",
      "2 Robots LM30"
      "2 Laser azul B500 (Show Laser)",
      "1 Bola de Espejos",
      "4 Pares LED",
      "Cabina DJ Acrílica Iluminada",
      "Controlador y PC",
      "DJ Animador"
    ]
  },
  {
    id: "prestige",
    titulo: "PLAN PRESTIGE",
    precio: "$750.000",
    imagen: "assets/plan-prestige.png",
    elementos: [
      "2 cabinas profesionales",
      "Cercha tipo Truss",
      "2 robots prisma 100w aro luz",
      "1 robots 150W colmena",
      "2 robots LM70S wass",
      "2 laser B500 azul (Show Laser)",
      "1 Bola espejos ful'80s",
      "Luz neon UV",
      "Cabina dj iluminada",
      "Controlador y pc",
      "Video beam con telon"
    ]
  }
];

const artistasData = [
  {
    id: "djcool",
    nombre: "DJ Cool",
    subtitulo: "El Arquitecto de la Pista",
    descripcion: "Especialista en leer la energía del público. Lleva el control de la noche con una técnica impecable y un instinto para el Crossover Premium.",
    imagenes: ["assets/djcool-promo.jpg", "assets/boda_3.jpg", "assets/bar_2.jpg"],
    etiquetaClase: "", // default
    caracteristicas: [
      { icono: "fa-glass-cheers", texto: "Bodas, 15 Años y Bautizos" },
      { icono: "fa-compact-disc", texto: "Residencias en Bares y Clubes" },
      { icono: "fa-map-marker-alt", texto: "Experiencias en toda Colombia" }
    ]
  },
  {
    id: "djice",
    nombre: "DJ Ice",
    subtitulo: "El Maestro de las Frecuencias",
    descripcion: "Innovador y enérgico. Transforma cualquier escenario en un festival privado, combinando ritmos modernos con una animación arrolladora.",
    imagenes: ["assets/djice-promo.jpg", "assets/corp_3.jpg", "assets/bar_3.jpg"],
    etiquetaClase: "ice-tag",
    caracteristicas: [
      { icono: "fa-building", texto: "Eventos Corporativos" },
      { icono: "fa-music", texto: "Conciertos y Festivales" },
      { icono: "fa-star", texto: "Fiestas Privadas VIP" }
    ]
  }
];

const testimoniosData = [
  { nombre: "Carolina y Andrés", fecha: "Hace 2 semanas", comentario: "Nuestra boda fue un sueño. DJ Cool mantuvo a todos bailando hasta las 4 AM. ¡Increíble energía y sonido de primer nivel!", estrellas: 5, servicio: "Boda" },
  { nombre: "Empresa TechCorp", fecha: "Hace 1 mes", comentario: "Contratamos el Plan Prestige para nuestra fiesta de fin de año. La puntualidad, el montaje y la música de DJ Ice fueron impecables.", estrellas: 5, servicio: "Corporativo" },
  { nombre: "Familia Gómez", fecha: "Hace 3 semanas", comentario: "Excelente servicio para los 15 años de mi hija. Las luces y la animación hicieron que los chicos no pararan de disfrutar.", estrellas: 5, servicio: "15 Años" },
  { nombre: "David Martínez", fecha: "Hace 1 semana", comentario: "El mejor proveedor de sonido que he contratado. Claridad, potencia y una actitud increíble. Recomendados 100%.", estrellas: 5, servicio: "Evento Privado" },
  { nombre: "Valeria Ruiz", fecha: "Hace 2 meses", comentario: "Nos casamos en una hacienda y el montaje se vio espectacular. Todos los invitados nos preguntaron por el DJ. ¡Gracias!", estrellas: 5, servicio: "Boda" },
  { nombre: "Bar El Muelle", fecha: "Hace 3 días", comentario: "Cada vez que llevamos a DJ Cool, el bar se llena y el ambiente es brutal. Excelente crossover y lectura del público.", estrellas: 5, servicio: "Bar/Club" },
  { nombre: "Andrea Suárez", fecha: "Hace 1 mes", comentario: "Súper cumplidos con todo lo acordado. El sonido es muy potente y las cabinas profesionales lucen muy bien.", estrellas: 5, servicio: "Cumpleaños" },
  { nombre: "Felipe Castañeda", fecha: "Hace 4 meses", comentario: "Cotizamos con varios, pero ellos nos dieron la mejor asesoría. La fiesta de la empresa fue un éxito total.", estrellas: 5, servicio: "Corporativo" },
  { nombre: "Laura y Miguel", fecha: "Hace 5 días", comentario: "El montaje de luces transformó por completo el salón. Las fotos quedaron divinas gracias a la iluminación.", estrellas: 5, servicio: "Boda" },
  { nombre: "Colegio San José", fecha: "Hace 2 semanas", comentario: "DJ Ice supo manejar perfecto a los estudiantes en el Prom. Todos quedaron felices con los visuales y la música.", estrellas: 5, servicio: "Prom" },
  { nombre: "Sofía Vergara", fecha: "Hace 1 mes", comentario: "Puntualidad británica. Llegaron 4 horas antes para armar todo. Cero estrés el día del evento.", estrellas: 5, servicio: "Bautizo" },
  { nombre: "Club Los Pinos", fecha: "Hace 3 semanas", comentario: "Siempre confiamos en ellos para nuestras fiestas temáticas. El sonido nunca falla y los DJs son profesionales.", estrellas: 5, servicio: "Bar/Club" },
  { nombre: "Mariana López", fecha: "Hace 2 meses", comentario: "Mi fiesta de 15 no hubiera sido igual sin ellos. ¡Hicieron show de luces y humo, parecía un concierto!", estrellas: 5, servicio: "15 Años" },
  { nombre: "Restaurante La Cima", fecha: "Hace 1 semana", comentario: "Contratamos el Plan Elegance para nuestra inauguración y fue un acierto. Ambiente sofisticado y música perfecta.", estrellas: 5, servicio: "Inauguración" },
  { nombre: "Juan Pablo P.", fecha: "Hace 2 días", comentario: "Simplemente los mejores. No duden en contratarlos, valen cada peso. ¡La fiesta del año garantizada!", estrellas: 5, servicio: "Evento Privado" }
];
