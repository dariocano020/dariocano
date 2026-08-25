document.addEventListener("DOMContentLoaded", () => {
    // Asegurarse de que GSAP y ScrollTrigger están cargados
    gsap.registerPlugin(ScrollTrigger);

    /* =========================================
       1. LÓGICA DEL CANVAS Y SCROLL DE IMÁGENES
       ========================================= */
    const canvas = document.getElementById("hero-canvas");
    const ctx = canvas.getContext("2d");

    // Configuración de la secuencia
    const frameCount = 300; // Número total de imágenes
    const images = [];
    
    // RUTA IMPORTANTE: Sustituye 'assets/frames/' por la carpeta donde tengas tus 300 imágenes.
    // Genera nombres como 'ezgif-frame-001.jpg', 'ezgif-frame-002.jpg', etc.
    const currentFrame = index => (
        `assets/frames/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
    );

    // Precargar la primera imagen para ajustar el canvas
    const img = new Image();
    img.src = currentFrame(0);

    // Ajustar el tamaño del canvas preservando la relación de aspecto de la imagen
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderImage(images[Math.round(canvasObj.frame)] || images[0]);
    }

    // Dibujar la imagen centrada y escalada (efecto "cover")
    function renderImage(imageToRender) {
        if (!imageToRender || !imageToRender.complete) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const hRatio = canvas.width / imageToRender.width;
        const vRatio = canvas.height / imageToRender.height;
        const ratio = Math.max(hRatio, vRatio); // Usar max para object-fit: cover
        
        const centerShiftX = (canvas.width - imageToRender.width * ratio) / 2;
        const centerShiftY = (canvas.height - imageToRender.height * ratio) / 2;
        
        ctx.drawImage(
            imageToRender, 
            0, 0, imageToRender.width, imageToRender.height,
            centerShiftX, centerShiftY, imageToRender.width * ratio, imageToRender.height * ratio
        );
    }

    // Precargar todas las imágenes en un array para rendimiento fluido
    for (let i = 0; i < frameCount; i++) {
        const imgPreload = new Image();
        imgPreload.src = currentFrame(i);
        images.push(imgPreload);
    }

    img.onload = () => {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
    };

    // Objeto proxy para que GSAP anime su propiedad 'frame'
    const canvasObj = { frame: 0 };

    // Configurar la animación ligada al scroll
    gsap.to(canvasObj, {
        frame: frameCount - 1,
        snap: "frame", // Fuerza a que sea un número entero
        ease: "none",
        scrollTrigger: {
            trigger: ".content", // Usa el body/main como track de scroll
            start: "top top",
            end: "bottom bottom",
            scrub: 1 // 1 segundo de inercia para que sea más suave
        },
        onUpdate: () => renderImage(images[Math.round(canvasObj.frame)])
    });

    /* =========================================
       2. LÓGICA DE FADE-IN PARA SECCIONES
       ========================================= */
    const fadeElements = document.querySelectorAll(".fade-el");

    fadeElements.forEach((el) => {
        gsap.fromTo(el, 
            { 
                opacity: 0, 
                y: 50 // Empieza 50px más abajo
            }, 
            {
                opacity: 1, 
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%", // La animación empieza cuando el elemento asoma por el 85% de la pantalla
                    toggleActions: "play none none reverse" // Se reproduce al bajar, se revierte al subir
                }
            }
        );
    });
});