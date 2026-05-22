
/* =========================================================
   CESINF - SCRIPT PRINCIPAL
   ========================================================= */

/* =========================
   ACTIVATION DU MODE JS
   ========================= */

/* Permet d'ajouter la classe "js" au document HTML */
document.documentElement.classList.add("js");

/* =========================
   ATTENTE DU CHARGEMENT HTML
   ========================= */

document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     MISE À JOUR AUTOMATIQUE DE L'ANNÉE
     ========================= */

  const yearSpan = document.getElementById("year");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

    /* =========================
     NAVIGATION CONTRÔLÉE DU MENU
     ========================= */

  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (!targetSection) return;

      const offset = 0;
      const targetPosition =
        targetSection.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });


   /* =========================
     GESTION CENTRALISÉE DES AUDIOS
     ========================= */

  const audioMap = {
    "btn-audio1": "audio1",
    "btn-audio2": "audio2",
    "btn-audio3": "audio3",
    "btn-audio4": "audio4",
    "btn-audio5": "audio5"
  };

  let currentAudio = null;
  let currentButton = null;

  Object.keys(audioMap).forEach((btnId) => {
    const button = document.getElementById(btnId);
    const audio = document.getElementById(audioMap[btnId]);

    if (!button || !audio) return;

    const labelPlay = button.dataset.label || button.textContent.trim() || "audio";
    const labelPause = button.dataset.labelPause || "pause audio";

    button.dataset.label = labelPlay;
    button.dataset.labelPause = labelPause;
    button.textContent = labelPlay;

    button.addEventListener("click", () => {

      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();

        if (currentButton) {
          currentButton.textContent = currentButton.dataset.label;
        }

        currentAudio = null;
        currentButton = null;
      }

      if (audio.paused) {
        audio.play()
          .then(() => {
            currentAudio = audio;
            currentButton = button;
            button.textContent = button.dataset.labelPause;
          })
          .catch((error) => {
            console.error("Erreur lors de la lecture audio :", error);
            alert("Impossible de lire le fichier audio.\nVérifiez le fichier .mp3 et les paramètres du navigateur.");

            button.textContent = button.dataset.label;
            currentAudio = null;
            currentButton = null;
          });
      } else {
        audio.pause();
        button.textContent = button.dataset.label;

        if (currentAudio === audio) {
          currentAudio = null;
          currentButton = null;
        }
      }
    });

    audio.addEventListener("ended", () => {
      button.textContent = button.dataset.label;

      if (currentAudio === audio) {
        currentAudio = null;
        currentButton = null;
      }
    });
  });
});


/* =========================
   ANIMATIONS REVEAL
   ========================= */

/* Fonction auto-exécutée */
(function(){

  /* Récupération de tous les éléments ayant la classe reveal */
  const els = document.querySelectorAll(".reveal");

  /* Vérification du support du navigateur */
  if (!("IntersectionObserver" in window)) {

    /* Si le navigateur ne supporte pas IntersectionObserver,
       on affiche directement tous les éléments */
    els.forEach(el => el.classList.add("is-visible"));

    return;
  }

  /* Création de l'observateur */
  const obs = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      /* Si l'élément entre dans la zone visible */
      if (entry.isIntersecting) {

        /* Ajout de la classe d'animation */
        entry.target.classList.add("is-visible");

        /* On arrête ensuite d'observer cet élément */
        obs.unobserve(entry.target);
      }
    });

  }, {
    threshold:0.12
  });

  /* On surveille tous les éléments reveal */
  els.forEach(el => obs.observe(el));

})();

