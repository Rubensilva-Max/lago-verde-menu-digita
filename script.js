(() => {
  "use strict";

  const video = document.getElementById("fishVideo");
  const hero = document.querySelector(".hero");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  // Scroll-driven video: descendo avança; subindo retrocede.
  let metadataReady = false;
  let framePending = false;
  let lastTarget = -1;

  function updateScrollVideo() {
    framePending = false;
    if (!video || !hero || !metadataReady || !Number.isFinite(video.duration)) return;

    const rect = hero.getBoundingClientRect();
    const scrollRange = Math.max(1, hero.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / scrollRange));
    const target = progress * Math.max(0, video.duration - 0.04);

    // Evita buscas repetidas para diferenças minúsculas de tempo.
    if (Math.abs(target - lastTarget) < 0.012) return;
    lastTarget = target;

    try {
      video.pause();
      video.currentTime = target;
    } catch (error) {
      // O navegador pode ainda estar preparando o primeiro quadro.
    }
  }

  function requestVideoUpdate() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(updateScrollVideo);
  }

  if (video && hero) {
    video.pause();
    video.addEventListener("loadedmetadata", () => {
      metadataReady = true;
      requestVideoUpdate();
    });
    video.addEventListener("loadeddata", requestVideoUpdate);
    video.addEventListener("seeked", () => {
      // Mantém o vídeo pausado: quem controla o quadro é a rolagem.
      if (!video.paused) video.pause();
    });
    window.addEventListener("scroll", requestVideoUpdate, { passive: true });
    window.addEventListener("resize", requestVideoUpdate);
    window.addEventListener("pageshow", requestVideoUpdate);
  }

  // Menu mobile.
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Seleção de itens e envio do pedido pelo WhatsApp.
  const cart = [];
  const count = document.getElementById("cartCount");
  const float = document.getElementById("cartFloat");
  const toast = document.getElementById("toast");
  const sendOrder = document.getElementById("sendOrder");
  let toastTimer;

  document.querySelectorAll(".add-item").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.dataset.item;
      if (!item) return;
      cart.push(item);
      if (count) count.textContent = String(cart.length);
      if (float) float.classList.add("visible");
      if (toast) {
        toast.textContent = item + " adicionado";
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 1500);
      }
    });
  });

  if (sendOrder) {
    sendOrder.addEventListener("click", () => {
      if (!cart.length) return;
      const grouped = {};
      cart.forEach(item => grouped[item] = (grouped[item] || 0) + 1);
      const lines = Object.entries(grouped)
        .map(([name, quantity]) => `${quantity}x ${name}`)
        .join("\n");
      const message = `Olá! Gostaria de consultar valores e disponibilidade para:\n${lines}\n\nPodem me ajudar?`;
      window.open(
        "https://wa.me/5585982218119?text=" + encodeURIComponent(message),
        "_blank",
        "noopener"
      );
    });
  }

  // Filtros do cardápio.
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(item => item.classList.remove("active"));
      tab.classList.add("active");
      const filter = tab.dataset.filter;
      document.querySelectorAll(".menu-group").forEach(group => {
        group.hidden = filter !== "todos" && group.dataset.category !== filter;
      });
    });
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
