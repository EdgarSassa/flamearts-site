document.addEventListener("DOMContentLoaded", () => {
  // Loader de carregamento: quando a página carregar, faz fade-out do loader
  window.addEventListener("load", () => {
    const loader = document.getElementById("page-loader");
    if (loader) {
      loader.style.opacity = 0;
      setTimeout(() => {
        loader.style.display = "none";
      }, 500);
    }
  });

  // Transição entre páginas: exibe o loader imediatamente ao clicar em links internos
  document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href !== "#" && !href.startsWith("http") && !href.startsWith("#")) {
        e.preventDefault();
        const loader = document.getElementById("page-loader");
        if (loader) {
          loader.style.display = "block";
          loader.style.opacity = 1;
        }
        // Aplica fade-out no body
        document.body.style.opacity = 0;
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  });

  // Toggle do menu mobile
  const menuToggle = document.getElementById("menu-toggle");
  const menuList = document.getElementById("menu-list");
  if (menuToggle && menuList) {
    menuToggle.addEventListener("click", () => {
      menuList.classList.toggle("active");
    });
  }

  // Modal para o Portfólio (portfolio.html)
  if (document.getElementById("portfolio-grid")) {
    fetch('assets/gallery/gallery.json')
      .then(response => response.json())
      .then(data => {
        const photos = data.photos || [];
        const videos = data.videos || [];
        const portfolioGrid = document.getElementById("portfolio-grid");
        let portfolioItems = [];

        photos.forEach((photo) => {
          const itemDiv = document.createElement("div");
          itemDiv.classList.add("portfolio-item");
          itemDiv.dataset.type = "photo";
          itemDiv.dataset.file = photo.file;
          itemDiv.dataset.alt = photo.alt || "Imagem do portfólio";
          itemDiv.dataset.index = portfolioItems.length;
          const img = document.createElement("img");
          img.src = `assets/gallery/${photo.file}`;
          img.alt = photo.alt;
          itemDiv.appendChild(img);
          portfolioGrid.appendChild(itemDiv);
          portfolioItems.push(itemDiv);
        });

        videos.forEach((video) => {
          const itemDiv = document.createElement("div");
          itemDiv.classList.add("portfolio-item");
          itemDiv.dataset.type = "video";
          itemDiv.dataset.file = video.file;
          itemDiv.dataset.alt = video.alt || "Vídeo do portfólio";
          itemDiv.dataset.index = portfolioItems.length;
          const vid = document.createElement("video");
          vid.src = `assets/gallery/${video.file}`;
          vid.muted = true;
          vid.loop = true;
          vid.autoplay = true;
          vid.playsInline = true;
          itemDiv.appendChild(vid);
          portfolioGrid.appendChild(itemDiv);
          portfolioItems.push(itemDiv);
        });

        const modal = document.getElementById("modal");
        const modalMedia = document.getElementById("modal-media");
        const modalTitle = document.getElementById("modal-title");
        const modalDescription = document.getElementById("modal-description");
        const modalClose = document.getElementById("modal-close");
        const modalPrev = document.getElementById("modal-prev");
        const modalNext = document.getElementById("modal-next");
        let currentIndex = 0;

        function openModal(index) {
          currentIndex = index;
          updateModalContent();
          modal.style.display = "block";
        }
        function closeModal() {
          modal.style.display = "none";
          modalMedia.innerHTML = "";
          modalTitle.textContent = "";
          modalDescription.textContent = "";
        }
        function updateModalContent() {
          const item = portfolioItems[currentIndex];
          modalMedia.innerHTML = "";
          if (item.dataset.type === "photo") {
            const img = document.createElement("img");
            img.src = `assets/gallery/${item.dataset.file}`;
            img.alt = item.dataset.alt;
            modalMedia.appendChild(img);
          } else if (item.dataset.type === "video") {
            const video = document.createElement("video");
            video.src = `assets/gallery/${item.dataset.file}`;
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            modalMedia.appendChild(video);
          }
          modalTitle.textContent = item.dataset.alt;
          modalDescription.textContent = "Descrição do item " + (parseInt(item.dataset.index) + 1);
        }

        portfolioItems.forEach((item, idx) => {
          item.addEventListener("click", () => {
            openModal(idx);
          });
        });

        modalClose.addEventListener("click", closeModal);
        modalPrev.addEventListener("click", () => {
          currentIndex = (currentIndex - 1 + portfolioItems.length) % portfolioItems.length;
          updateModalContent();
        });
        modalNext.addEventListener("click", () => {
          currentIndex = (currentIndex + 1) % portfolioItems.length;
          updateModalContent();
        });

        window.addEventListener("click", (e) => {
          if (e.target === modal) {
            closeModal();
          }
        });
      })
      .catch(error => console.error('Erro ao carregar o portfólio:', error));
  }

  // -------------------------------------------------------------------
  // Efeito glow interativo: aplica somente em telas maiores que 768px para preservar desempenho em mobile
  // -------------------------------------------------------------------
  if (window.innerWidth > 768) {
    document.querySelectorAll('.gradient-border').forEach(container => {
      container.addEventListener('mousemove', e => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const distanceToLeft   = x;
        const distanceToRight  = rect.width - x;
        const distanceToTop    = y;
        const distanceToBottom = rect.height - y;
        const distanceToEdge   = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);
        
        const threshold = 0.4 * Math.min(rect.width, rect.height);
        let intensity = (distanceToEdge < threshold) ? (1 - (distanceToEdge / threshold)) : 0;
        
        const adjustedIntensity = Math.min(1, intensity * 1.3);
        
        let glowX = "50%";
        let glowY = "50%";
        if (distanceToEdge === distanceToLeft) {
          glowX = "0%";
          glowY = (y / rect.height * 100) + "%";
        } else if (distanceToEdge === distanceToRight) {
          glowX = "100%";
          glowY = (y / rect.height * 100) + "%";
        } else if (distanceToEdge === distanceToTop) {
          glowX = (x / rect.width * 100) + "%";
          glowY = "0%";
        } else if (distanceToEdge === distanceToBottom) {
          glowX = (x / rect.width * 100) + "%";
          glowY = "100%";
        }
        
        container.style.setProperty("--glowOpacity", adjustedIntensity.toString());
        container.style.setProperty("--glowX", glowX);
        container.style.setProperty("--glowY", glowY);
      });
  
      container.addEventListener('mouseleave', () => {
        container.style.setProperty("--glowOpacity", "0");
      });
    });
  }
});
