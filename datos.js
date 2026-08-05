const paquetesData = [
  {
    id: "elegance",
    titulo: "PLAN ELEGANCE",
    precio: "$600.000",
    imagen: "assets/plan-elegance.png", 
    elementos: [
      "2 Cabinas Profesionales",
      "Cercha Tipo T",
      "4 Robots LS10",
      "1 Spider LED",
      "1 Bola de Espejos",
      "2 Pares LED",
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
      "4 laser B500 azul (Show Laser)",
      "1 Bola espejos ful'80s",
      "Luz neon UV",
      "Cabina dj iluminada",
      "Controlador y pc",
      "Video bean con telon"
    ]
  }
];

const artistasData = [
  {
    id: "djcool",
    nombre: "DJ Cool",
    subtitulo: "El Arquitecto de la Pista",
    descripcion: "Especialista en leer la energía del público. Lleva el control de la noche con una técnica impecable y un instinto para el Crossover Premium.",
    imagen: "assets/djcool-promo.jpg",
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
    imagen: "assets/djice-promo.jpg",
    etiquetaClase: "ice-tag",
    caracteristicas: [
      { icono: "fa-building", texto: "Eventos Corporativos" },
      { icono: "fa-music", texto: "Conciertos y Festivales" },
      { icono: "fa-star", texto: "Fiestas Privadas VIP" }
    ]
  }
];
