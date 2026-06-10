const logoMarque = document.getElementById('logo-marque');
const logoDropdown = document.getElementById('logo-dropdown');

if (logoMarque && logoDropdown) {
  logoMarque.addEventListener('click', () => {
    const estOuvert = logoDropdown.classList.toggle('ouvert');
    logoMarque.setAttribute('aria-expanded', estOuvert);
  });

  document.addEventListener('click', (e) => {
    if (!logoMarque.contains(e.target)) {
      logoDropdown.classList.remove('ouvert');
      logoMarque.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      logoDropdown.classList.remove('ouvert');
      logoMarque.setAttribute('aria-expanded', 'false');
    }
  });
}

const cursor = document.getElementById('curseur');
const cursorRing = document.getElementById('anneau-curseur');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

const canvasParticules = document.getElementById('particules');

if (canvasParticules) {
  const ctx = canvasParticules.getContext('2d');
  const nombreParticules = 70;
  const rayonAttraction = 180;
  let largeur, hauteur, particules;

  function redimensionnerCanvas() {
    largeur = canvasParticules.width = window.innerWidth;
    hauteur = canvasParticules.height = window.innerHeight;
  }

  function creerParticules() {
    particules = [];
    for (let i = 0; i < nombreParticules; i++) {
      particules.push({
        x: Math.random() * largeur,
        y: Math.random() * hauteur,
        rayon: Math.random() * 1.6 + 0.6,
        vitesseX: (Math.random() - 0.5) * 0.25,
        vitesseY: (Math.random() - 0.5) * 0.25,
      });
    }
  }

  function animerParticules() {
    ctx.clearRect(0, 0, largeur, hauteur);

    particules.forEach((p) => {
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const distance = Math.hypot(dx, dy);

      if (distance < rayonAttraction) {
        p.x += dx * 0.0015;
        p.y += dy * 0.0015;
      }

      p.x += p.vitesseX;
      p.y += p.vitesseY;

      if (p.x < 0) p.x = largeur;
      if (p.x > largeur) p.x = 0;
      if (p.y < 0) p.y = hauteur;
      if (p.y > hauteur) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.rayon, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fill();
    });

    requestAnimationFrame(animerParticules);
  }

  redimensionnerCanvas();
  creerParticules();
  animerParticules();

  window.addEventListener('resize', () => {
    redimensionnerCanvas();
    creerParticules();
  });
}

const boutons = document.querySelectorAll('.bouton-entrer');
boutons.forEach((btn) => {
  btn.addEventListener('mouseenter', () => {
    cursorRing.style.width  = '56px';
    cursorRing.style.height = '56px';
    cursorRing.style.borderColor = 'rgba(0,0,0,0.4)';
  });
  btn.addEventListener('mouseleave', () => {
    cursorRing.style.width  = '36px';
    cursorRing.style.height = '36px';
    cursorRing.style.borderColor = 'rgba(255,255,255,0.5)';
  });
});

const audio = document.getElementById('audio');
audio.volume = 0.5;

const boutonAudio = document.getElementById('bouton-lecture');
const iconeLecture = document.getElementById('icone-lecture');
boutonAudio.addEventListener('click', () => {
  audio.paused ? audio.play() : audio.pause();
  iconeLecture.textContent = audio.paused ? '▶' : '⏸';
});

audio.addEventListener('timeupdate', () => {
  const pourcent = (audio.currentTime / audio.duration) * 100;
  document.getElementById('remplissage-progres').style.width = pourcent + '%';
});

const boutonVolume = document.getElementById('bouton-volume');
const iconeVolume = document.getElementById('icone-volume');
const curseurVolume = document.getElementById('curseur-volume');

if (boutonVolume && curseurVolume) {
  curseurVolume.value = audio.volume;

  curseurVolume.addEventListener('input', () => {
    audio.muted = false;
    audio.volume = Number(curseurVolume.value);
    iconeVolume.textContent = audio.volume === 0 ? '🔇' : '🔊';
  });

  boutonVolume.addEventListener('click', () => {
    audio.muted = !audio.muted;
    iconeVolume.textContent = audio.muted ? '🔇' : '🔊';
  });
}

const barreNav = document.querySelector('.navigation');
const navCurseur = document.getElementById('nav-curseur');
const liensNav = document.querySelectorAll('.lien-nav');
const sections = document.querySelectorAll('section[id]');

function placerCurseurNav(lien) {
  if (!barreNav || !navCurseur || !lien) return;
  const rectNav = barreNav.getBoundingClientRect();
  const rectLien = lien.getBoundingClientRect();
  navCurseur.style.width = `${rectLien.width}px`;
  navCurseur.style.height = `${rectLien.height}px`;
  navCurseur.style.transform = `translate(${rectLien.left - rectNav.left}px, ${rectLien.top - rectNav.top}px)`;
}

function lienActif() {
  return document.querySelector('.lien-nav.actif') || liensNav[0];
}

function defilementFluide(cible) {
  const decalage = barreNav ? barreNav.offsetHeight + 40 : 0;
  const depart = window.pageYOffset;
  const arrivee = cible.getBoundingClientRect().top + depart - decalage;
  const distance = arrivee - depart;
  const duree = 800;
  let debut = null;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function etape(horodatage) {
    if (debut === null) debut = horodatage;
    const ecoule = horodatage - debut;
    const progression = Math.min(ecoule / duree, 1);
    window.scrollTo(0, depart + distance * easeInOutCubic(progression));
    if (ecoule < duree) requestAnimationFrame(etape);
  }

  requestAnimationFrame(etape);
}

if (barreNav && navCurseur && liensNav.length) {
  window.addEventListener('load', () => placerCurseurNav(lienActif()));
  window.addEventListener('resize', () => placerCurseurNav(lienActif()));

  liensNav.forEach((lien) => {
    lien.addEventListener('mouseenter', () => placerCurseurNav(lien));

    lien.addEventListener('click', (e) => {
      const cible = document.querySelector(lien.getAttribute('href'));
      if (cible) {
        e.preventDefault();
        defilementFluide(cible);
      }
    });
  });

  barreNav.addEventListener('mouseleave', () => placerCurseurNav(lienActif()));
}

const lienHaut = document.querySelector('.lien-haut');
if (lienHaut) {
  lienHaut.addEventListener('click', (e) => {
    const cible = document.querySelector(lienHaut.getAttribute('href'));
    if (cible) {
      e.preventDefault();
      defilementFluide(cible);
    }
  });
}

if (liensNav.length && sections.length) {
  const observateur = new IntersectionObserver((entrees) => {
    entrees.forEach((entree) => {
      if (entree.isIntersecting) {
        liensNav.forEach((lien) => {
          const estActif = lien.getAttribute('href') === `#${entree.target.id}`;
          lien.classList.toggle('actif', estActif);
          if (estActif) placerCurseurNav(lien);
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach((section) => observateur.observe(section));
}

const formulaireContact = document.getElementById('formulaire-contact');
const messageEnvoi = document.getElementById('message-envoi');

if (formulaireContact) {
  formulaireContact.addEventListener('submit', (e) => {
    e.preventDefault();
    messageEnvoi.textContent = 'Merci, votre message a bien été envoyé !';
    messageEnvoi.classList.add('visible');
    formulaireContact.reset();
  });
}