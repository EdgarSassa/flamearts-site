document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Busca o JSON com os dados da galeria
    const response = await fetch('assets/gallery/gallery.json');
    if (!response.ok) {
      throw new Error('Erro na requisição do JSON: ' + response.statusText);
    }
    const data = await response.json();
    const photos = data.photos || [];
    const videos = data.videos || [];
    const total = Math.min(photos.length, videos.length);

    // Cria um array intercalado: foto, vídeo, foto, vídeo, …
    const itemsData = [];
    for (let i = 0; i < total; i++) {
      itemsData.push({ type: 'photo', file: photos[i].file, alt: photos[i].alt || "Imagem da galeria" });
      itemsData.push({ type: 'video', file: videos[i].file, alt: videos[i].alt || "Vídeo da galeria" });
    }

    // Seleciona o contêiner do slider
    const sliderTrack = document.getElementById("slider-track");
    if (!sliderTrack) {
      console.error('Elemento #slider-track não encontrado.');
      return;
    }

    // Cria os elementos originais do slider
    const originalItems = [];
    itemsData.forEach((itemData) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("slider-item");
      if (itemData.type === 'photo') {
        const img = document.createElement("img");
        img.src = `assets/gallery/${itemData.file}`;
        img.alt = itemData.alt;
        itemDiv.appendChild(img);
      } else if (itemData.type === 'video') {
        const video = document.createElement("video");
        video.src = `assets/gallery/${itemData.file}`;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";
        video.autoplay = true;
        video.addEventListener("loadeddata", () => {
          video.play().catch(() => {});
        });
        itemDiv.appendChild(video);
      }
      originalItems.push(itemDiv);
      sliderTrack.appendChild(itemDiv);
    });

    // Para rolamento infinito: clonar os 2 últimos itens para o início e os 2 primeiros para o final.
    const clonesCount = 2;
    const originalCount = originalItems.length;
    let sliderItems = [...originalItems];

    // Clonar e inserir no início (mantendo a mesma ordem dos últimos clonesCount itens)
    for (let i = originalCount - clonesCount; i < originalCount; i++) {
      const clone = originalItems[i].cloneNode(true);
      clone.classList.add("clone");
      sliderTrack.insertBefore(clone, sliderTrack.firstChild);
      sliderItems.unshift(clone);
    }
    // Clonar e inserir no final (na ordem normal)
    for (let i = 0; i < clonesCount; i++) {
      const clone = originalItems[i].cloneNode(true);
      clone.classList.add("clone");
      sliderTrack.appendChild(clone);
      sliderItems.push(clone);
    }

    /*  
      Cálculo dos deslocamentos:
      Cada item não ativo ocupa 260px de largura + 10px de margem total = 270px.
      O item ativo ocupa 520px + 10px = 530px; sua "metade" equivale a 265px.
      Assim, para centralizar, o offset = containerWidth/2 – (activeIndex * 270 + 265)
    */
    let activeIndex = clonesCount + 2;  // inicia com o 3º item original
    let isTransitioning = false;

    function updateActiveClass() {
      sliderItems.forEach((item, idx) => {
        if (idx === activeIndex) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }

    function updateSliderPosition() {
      const sliderContainer = document.querySelector(".slider-container");
      const containerWidth = sliderContainer.offsetWidth;
      let sumWidth = 0;
      for (let i = 0; i < activeIndex; i++) {
        sumWidth += 270;
      }
      const activeCenter = sumWidth + 265;
      const offset = containerWidth / 2 - activeCenter;
      sliderTrack.style.transform = `translateX(${offset}px) translateY(0)`;
    }

    function goToSlide(index, transitionDuration = 0.35) {
      if (isTransitioning) return;
      isTransitioning = true;
      activeIndex = index;
      sliderTrack.style.transition = `transform ${transitionDuration}s ease-in-out`;
      updateActiveClass();
      updateSliderPosition();
    }

    sliderTrack.addEventListener("transitionend", (e) => {
      if (e.propertyName !== "transform") return;
      // Se o índice ativo for menor que clonesCount, reajusta para o final
      if (activeIndex < clonesCount) {
        activeIndex += originalCount;
        sliderTrack.style.transition = "none";
        updateActiveClass();
        updateSliderPosition();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            sliderTrack.style.transition = "transform 0.35s ease-in-out";
            isTransitioning = false;
          });
        });
      }
      // Se o índice ativo for maior ou igual a clonesCount + originalCount, reajusta para o início
      else if (activeIndex >= clonesCount + originalCount) {
        activeIndex -= originalCount;
        sliderTrack.style.transition = "none";
        updateActiveClass();
        updateSliderPosition();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            sliderTrack.style.transition = "transform 0.35s ease-in-out";
            isTransitioning = false;
          });
        });
      } else {
        isTransitioning = false;
      }
    });

    // Permite selecionar um item via clique (transição de 0.4s)
    sliderItems.forEach((item, idx) => {
      item.addEventListener("click", () => {
        if (isTransitioning) return;
        if (idx === activeIndex) return;
        goToSlide(idx, 0.4);
        resetAutoSlide();
      });
    });

    // Estado inicial
    updateActiveClass();
    updateSliderPosition();

    // Botões de navegação
    const btnPrev = document.getElementById("slider-btn-prev");
    const btnNext = document.getElementById("slider-btn-next");
    btnPrev.addEventListener("click", () => {
      if (isTransitioning) return;
      goToSlide(activeIndex - 1);
      resetAutoSlide();
    });
    btnNext.addEventListener("click", () => {
      if (isTransitioning) return;
      goToSlide(activeIndex + 1);
      resetAutoSlide();
    });

    // Auto slide a cada 8 segundos
    let autoSlideInterval = setInterval(() => {
      goToSlide(activeIndex + 1);
    }, 8000);

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => {
        goToSlide(activeIndex + 1);
      }, 8000);
    }

    window.addEventListener("resize", updateSliderPosition);

  } catch (error) {
    console.error('Erro ao carregar a galeria:', error);
  }
});
