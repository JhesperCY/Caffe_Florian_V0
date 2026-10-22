const { animate } = anime;

const pills = document.querySelectorAll('.categoria-pill');

pills.forEach(pill => {
    const texto = pill.querySelector('.categoria-texto');

    pill.addEventListener('mouseenter', () => {
        pill.style.width = 'auto';
        const anchoFinal = pill.offsetWidth;
        pill.style.width = '60px';

        animate(pill, {
            width: anchoFinal,
            duration: 350,
            ease: 'outQuad'
        });

        animate(texto, {
            opacity: 1,
            duration: 250,
            delay: 100
        });
    });

    pill.addEventListener('mouseleave', () => {
        animate(pill, {
            width: 60,
            duration: 300,
            ease: 'outQuad'
        });

        animate(texto, {
            opacity: 0,
            duration: 150
        });
    });
});

const stackCards = Array.from(document.querySelectorAll('.testimonio-stack-card'));
let ordenActual = stackCards.map((_, i) => i);

function pintarStack(instantaneo) {
  ordenActual.forEach((cardIndex, posicion) => {
    const card = stackCards[cardIndex];
    animate(card, {
      zIndex: stackCards.length - posicion,
      scale: 1 - posicion * 0.05,
      translateY: posicion * 14,
      translateX: 0,
      rotate: 0,
      opacity: posicion < 3 ? 1 - posicion * 0.25 : 0,
      duration: instantaneo ? 0 : 400,
      ease: 'outQuad'
    });
  });
}

function rotarStack() {
  const frente = stackCards[ordenActual[0]];
  animate(frente, {
    translateX: 400,
    rotate: 15,
    opacity: 0,
    duration: 500,
    ease: 'inQuad',
    onComplete: () => {
      ordenActual.push(ordenActual.shift());
      pintarStack(true);
    }
  });
}

if (stackCards.length > 0) {
  pintarStack(true);
  setInterval(rotarStack, 4000);
}