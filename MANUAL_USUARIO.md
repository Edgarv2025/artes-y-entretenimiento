# Manual de Usuario: Plataforma Integral Artes & Entretenimiento
### Landing Page de Alta Conversión, Panel Administrativo y Módulo de Marketing Inteligente & CRM

---

## 1. Introducción y Arquitectura del Sistema

Bienvenido a la plataforma digital de **Artes & Entretenimiento**. Este sistema ha sido diseñado específicamente para la captación, conversión, administración y fidelización de clientes para servicios de producción técnica, sonido profesional, iluminación de espectáculos y DJs en Colombia.

La plataforma está compuesta por tres componentes integrados:

1. **Página Pública (Landing Page - `index.html`):** Diseñada bajo principios de neuromarketing y estética *Dark Luxury*, optimizada para convertir visitantes en contactos directos de WhatsApp.
2. **Panel de Administración General (`admin.html`):** Permite gestionar y actualizar el catálogo comercial (Planes, Artistas y Testimonios) sin tocar código.
3. **Módulo de Marketing Inteligente & CRM (`marketing.html`):** Módulo automatizado para planear campañas, generar contenido publicitario con Inteligencia Artificial basado en datos 100% reales, organizar el calendario de publicaciones, gestionar material multimedia y hacer seguimiento comercial a los prospectos (Leads) hasta cerrar reservas.

---

## 2. Puesta en Marcha (Cómo Iniciar la Plataforma)

### Requisitos Previos
* Tener instalado **Node.js** (versión 18 o superior) en el computador.

### Pasos para Ejecutar
1. Abre la terminal o consola de comandos (PowerShell o CMD) en la carpeta del proyecto:
   ```powershell
  cd d:\ARTYENTO\artes-y-entretenimiento
   ```
2. Ejecuta el comando de inicio:
   ```powershell
   npm start
   ```
3. La consola mostrará el mensaje de confirmación con las direcciones de acceso:
   * **Sitio Web Público:** `http://localhost:3000/`
   * **Panel Administrativo General:** `http://localhost:3000/admin.html`
   * **Módulo de Marketing Inteligente:** `http://localhost:3000/marketing.html`

### Clave de Acceso de Administrador
* Para acceder tanto a `admin.html` como a `marketing.html`, la contraseña predeterminada es:
  ```text
  admin2026
  ```
* *Nota:* La sesión se mantiene activa en el navegador mientras tengas la pestaña abierta, por lo que puedes alternar entre el Panel General y Marketing Inteligente sin tener que volver a digitar la clave.

---

## 3. Guía de la Página Pública (`index.html`)

La página web está enfocada en la experiencia visual y emocional del cliente. Opera con diversos gatillos de conversión:

* **Barra Superior de Urgencia:** Informa sobre la apertura de agenda 2026 y pocas fechas disponibles.
* **Contador de Visitas Inteligente:** Genera prueba social continua basada en visitas acumuladas.
* **Notificaciones Flotantes FOMO:** Cada 45 segundos notifica sutilmente contrataciones recientes en Bogotá (*"Carlos M. acaba de reservar el Plan Prestige"*, *"Familia Gómez reservó DJ Cool"*).
* **Oferta Flash (Exit-Intent):** Si el usuario intenta salir o lleva más de 60 segundos navegando, se activa una ventana con el regalo de **1 Hora Extra Gratis** direccionada a WhatsApp.
* **Captura Pasiva de Prospectos (CRM):** Cada vez que un usuario hace clic en el botón **"Lo quiero"** de un paquete o envía una **Reseña**, el sistema lo registra automáticamente en el CRM del panel de marketing en tiempo real, antes de abrir el chat de WhatsApp.

---

## 4. Guía del Panel Administrativo General (`admin.html`)

Este panel permite controlar la información básica de la empresa:

### 4.1. Gestión de Propuestas Integrales (Paquetes)
* Permite ver los paquetes actuales (**Plan Elegance** y **Plan Prestige**).
* Para crear una nueva propuesta: Diligencia el Título, Precio (ej. `$900.000`), Ruta de la Imagen (ej. `assets/plan-elegance.png`) y la lista de equipos incluidos separados por coma.
* Permite editar o eliminar paquetes existentes.

### 4.2. Gestión de Artistas
* Administra los perfiles de los DJs (**DJ Cool** y **DJ Ice**).
* Permite actualizar su subtítulo, descripción, características (icono y texto) y fotos promocionales en rotación.

### 4.3. Testimonios
* Permite agregar opiniones de clientes, calificación de estrellas (1 a 5), tipo de evento (Boda, Corporativo, 15 Años) y comentarios.

### 4.4. Guardar Cambios en la Web (`datos.js`)
* Al finalizar modificaciones en este panel, haz clic en el botón verde **"Descargar archivo datos.js"**.
* El archivo descargado contiene toda la nueva información y puede subirse a GitHub o reemplazar el archivo local `datos.js`.
* En la parte superior derecha encontrarás la pestaña dorada **"✨ Marketing Inteligente"** para ingresar al módulo avanzado de marketing.

---

## 5. Guía del Módulo de Marketing Inteligente & CRM (`marketing.html`)

El módulo se compone de **9 vistas especializadas** accesibles desde la barra de navegación superior:

```
[Dashboard] [Campañas] [Generador IA] [Calendario] [Biblioteca Multimedia] [Redes Sociales] [Leads (CRM)] [Analítica] [Configuración]
```

---

### Vista 1: Dashboard
Es el centro de comando principal con indicadores en tiempo real:
* **Tarjetas de KPI:** Total de prospectos registrados, reservas cerradas, tasa de conversión comercial, campañas activas, publicaciones programadas y fotos indexadas.
* **Embudo de Conversión Comercial:** Muestra gráficamente cuántos clientes están en cada fase (*Nuevo* → *Contactado* → *Cotización* → *Negociación* → *Reservado*).
* **Prospectos Recientes:** Tabla con los últimos clientes que han interactuado, con botón directo para responderles por WhatsApp.
* **Próximos Posts:** Resumen de las publicaciones que saldrán en los próximos días.

---

### Vista 2: Campañas
Permite organizar y presupuestar las estrategias de promoción por temporada o segmento:
* **Crear Nueva Campaña:**
  1. Haz clic en **"+ Crear Campaña"**.
  2. Asigna un nombre (ej. *Campaña Bodas Fin de Año 2026*).
  3. Define el objetivo (ej. *Captación de Wedding Planners* o *Eventos Corporativos*).
  4. Selecciona el **Público Objetivo** segmentado:
     * *Organizadores de Eventos & Wedding Planners*
     * *Empresas BTL & Agencias de Publicidad*
     * *Clientes Finales - Bodas y Celebraciones VIP*
     * *Clientes Finales - Quince Años & Fiestas Privadas*
     * *Eventos Corporativos & Galas de Empresa*
  5. Establece fechas de inicio/fin y presupuesto estimado en COP.
  6. Guarda la campaña para asociar a ella futuras publicaciones y leads.

---

### Vista 3: Generador de Contenido con IA (Catálogo Real)
Crea copys publicitarios y guiones de video profesionales adaptados a cada red social sin inventar datos:
* **Paso a Paso:**
  1. **Red Social:** Elige entre *Instagram (Post/Carrusel)*, *TikTok (Guion Audiovisual)*, *Instagram Reels* o *Facebook (Post Comercial)*.
  2. **Público Objetivo:** Selecciona a quién va dirigido el mensaje (el tono y los argumentos cambiarán automáticamente según el público).
  3. **Paquete en Foco:** Selecciona **Plan Elegance** ($600.000) o **Plan Prestige** ($750.000).
  4. **Artista en Foco:** Elige a **DJ Cool** (rumba crossover) o **DJ Ice** (corporativo/festival).
  5. **Meta:** Captación, Posicionamiento o Promoción de Temporada.
  6. Haz clic en **"Generar Contenido Comercial Ahora"**.
* **Resultado Obtenido:**
  * **Gancho (Hook 0-3s):** Frase de alto impacto para capturar la atención en los primeros 3 segundos.
  * **Copy / Texto Estructurado:** Texto persuasivo con emojis, viñetas de equipos reales y oferta formal.
  * **Llamado a la Acción (CTA):** Instrucción clara para contactar por WhatsApp.
  * **Hashtags:** Etiquetas estratégicas para posicionamiento en Colombia.
  * **Recomendación Visual:** Sugerencia de fotos o videos a utilizar.
* **Enviar al Calendario:**
  * En la parte inferior del resultado, selecciona la fecha y hora deseada, asócialo a una campaña y haz clic en **"Aprobar y Programar"** o **"Guardar como Borrador"**.

---

### Vista 4: Calendario de Publicaciones
Permite visualizar y coordinar la parrilla de contenidos:
* **Filtros:** Filtra por red social (*Instagram*, *Facebook*, *TikTok*) y por estado (*Borrador*, *Pendiente*, *Aprobado*, *Programado*, *Publicado*).
* **Gestión de Publicaciones:**
  * Haz clic en el icono del ojo 👁️ para abrir el visor completo del post.
  * Usa el botón **"Copiar Texto Formateado"** para llevarte el texto listo para pegar en la red social correspondiente.
  * Haz clic en el botón verde ✔️ para marcar la publicación como **Publicada**.

---

### Vista 5: Biblioteca Multimedia
Almacena y clasifica los activos visuales del negocio:
* **Sincronización:** Haz clic en **"Sincronizar Galería"** para que el sistema escanee automáticamente las carpetas locales `fotos/` y `assets/`.
* **Filtros por Servicio y Artista:** Encuentra rápidamente imágenes de *Bodas*, *Corporativo*, *Bares*, *Planes*, *DJ Cool* o *DJ Ice*.
* **Copiar Ruta:** Puedes copiar la ruta de cualquier imagen con un solo clic para usarla en campañas o publicaciones.

---

### Vista 6: Redes Sociales & Publicación Asistida
Gestión transparente de las cuentas oficiales de la marca:
* Muestra el estado de **Instagram**, **Facebook** y **TikTok** de Artes & Entretenimiento.
* **Modo Manual Asistido:** Conforme a las mejores prácticas y restricciones de las APIs de redes sociales, el sistema no finge publicaciones automáticas: te entrega el contenido perfectamente formateado con enlaces y hashtags para que el community manager o encargado lo pegue en 10 segundos.
* **Registro de Métricas Reales:** Formulario para registrar manualmente el alcance, impresiones e interacciones obtenidas en publicaciones clave.

---

### Vista 7: Leads (CRM de Oportunidades Comerciales)
Es el núcleo de ventas para dar seguimiento a cada cliente interesado:
* **Listado de Prospectos:** Muestra el nombre, empresa, teléfono, servicio de interés, tipo de evento, fecha programada, canal de procedencia y estado actual.
* **Buscador en Tiempo Real:** Busca por nombre, empresa o teléfono.
* **Estados del Lead:**
  1. `Nuevo`: Acaba de registrarse desde la web o manualmente.
  2. `Contactado`: Ya se tuvo un primer acercamiento.
  3. `Cotización enviada`: Se le entregó propuesta formal con precios.
  4. `En negociación`: Ajustando detalles de fecha, equipos o sonido.
  5. `Reservado (Ganado)`: Evento confirmado y fecha apartada.
  6. `Perdido`: El cliente no contrató o canceló el evento.
* **Botón Verde de WhatsApp (Responder):**
  * Al hacer clic en **"Responder"**, el sistema genera un mensaje pre-redactado personalizado con el nombre del cliente, tipo de evento y paquete consultado, abriendo directamente el chat oficial de WhatsApp sin que tengas que redactar desde cero.
* **Registrar Lead Manual:** Permite registrar prospectos que llegaron por llamadas telefónicas, referidos o eventos presenciales mediante el botón **"+ Nuevo Lead"**.

---

### Vista 8: Analítica
Muestra el rendimiento integral del negocio:
* **Ranking de Servicios Más Consultados:** Identifica si los clientes solicitan más el *Plan Elegance*, *Plan Prestige* o servicios personalizados.
* **Canales de Origen:** Revela qué porcentaje de clientes proviene de la Web, Instagram, Facebook, TikTok o WhatsApp.
* **Rendimiento de Campañas:** Evalúa cuántos leads y reservas concretadas ha generado cada campaña frente a su presupuesto invertido.

---

### Vista 9: Configuración
* Muestra los datos de contacto oficiales de la empresa (+57 320 245 90 32 / Sede Bogotá).
* **Conexión de Modelos de IA Externos:** Si deseas conectar Google Gemini o OpenAI, solo debes agregar la clave correspondiente en el archivo `.env` en la raíz del proyecto:
  ```env
  GEMINI_API_KEY=tu_clave_de_gemini
  # o
  OPENAI_API_KEY=tu_clave_de_openai
  ```
  *(Si no se configura ninguna clave, la plataforma sigue funcionando perfectamente con su motor contextual nativo que no genera costo alguno).*
* Muestra el listado de reglas de automatización activas.

---

## 6. Flujo de Trabajo Diario Recomendado (Paso a Paso)

Para aprovechar al máximo la plataforma en el día a día, se sugiere este flujo comercial:

1. **Revisar Nuevos Leads en el CRM (Mañana):**
   * Ingresa a `marketing.html` → pestaña **Leads**.
   * Revisa prospectos con estado `Nuevo`.
   * Presiona el botón verde de **WhatsApp** para contactarlos con la plantilla personalizada.
   * Cambia su estado a `Contactado` o `Cotización enviada`.
2. **Generar Contenido para la Semana (1 vez por semana):**
   * Ve a **Generador IA**.
   * Selecciona el público objetivo de la semana (ej. *Bodas* para Instagram o *Empresas BTL* para LinkedIn/Facebook).
   * Genera 2 o 3 piezas de contenido y envíalas al **Calendario** en estado `Aprobado`.
3. **Publicar en Redes Sociales:**
   * Entra a **Calendario**, abre el post del día, presiona **"Copiar Texto Formateado"** y súbelo a la red social con la imagen recomendada de la **Biblioteca Multimedia**.
   * Marca el post como `Publicado`.
4. **Cierre de Negocios:**
   * Cuando un cliente confirme el anticipo de su evento, cambia su estado en el CRM a `Reservado`. El dashboard actualizará automáticamente la tasa de conversión y los ingresos del mes.

---

## 7. Preguntas Frecuentes y Soporte

* **¿Se pierden los datos si apago el computador?**  
  No. Toda la información de campañas, publicaciones, prospectos y métricas se guarda permanentemente en la base de datos local `server/database.sqlite`.
* **¿Qué pasa si no tengo conexión a internet?**  
  La plataforma y el motor de generación de contenidos funcionan de forma local. La única función que requiere internet es el envío de mensajes a través de WhatsApp Web y la carga de tipografías externas.
* **¿Cómo cambio la contraseña de acceso?**  
  La contraseña está definida en los archivos `admin.html` y `marketing.html` en la función `attemptLogin() / checkPassword()`. Puedes cambiar `'admin2026'` por la clave que prefieras.
