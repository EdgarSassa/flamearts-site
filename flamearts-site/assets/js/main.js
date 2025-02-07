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
        video.addEventListener("click", () => {
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        });
        itemDiv.appendChild(video);
      }
      originalItems.push(itemDiv);
      sliderTrack.appendChild(itemDiv);
    });

    // Para rolagem infinita, clona os dois últimos itens para o início e os dois primeiros para o final.
    const clonesCount = 2;
    const originalCount = originalItems.length;
    let sliderItems = [...originalItems];

    // Clones no início
    for (let i = originalCount - clonesCount; i < originalCount; i++) {
      const clone = originalItems[i].cloneNode(true);
      clone.classList.add("clone");
      sliderTrack.insertBefore(clone, sliderTrack.firstChild);
      sliderItems.unshift(clone);
    }
    // Clones no final
    for (let i = 0; i < clonesCount; i++) {
      const clone = originalItems[i].cloneNode(true);
      clone.classList.add("clone");
      sliderTrack.appendChild(clone);
      sliderItems.push(clone);
    }

    /*  
      Cálculo dos deslocamentos:
      - Itens não ativos: 260px de largura + 10px (5px de cada lado) = 270px.
      - Item ativo: 520px + 10px = 530px.
      Para centralizar, a soma das larguras dos itens anteriores é:
         activeIndex * 270   (pois todos antes do ativo são não ativos)
      E o centro do item ativo é 530/2 = 265px.
      Logo, deslocamento = containerWidth/2 - (activeIndex * 270 + 265)
    */
    let activeIndex = clonesCount + 2;  // inicia com o 3º item original

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
      // Itens anteriores: cada um ocupa 270px (não ativos)
      for (let i = 0; i < activeIndex; i++) {
        sumWidth += 270;
      }
      const activeCenter = sumWidth + 265; // 265 = 530/2
      const offset = containerWidth / 2 - activeCenter;
      // Aplica apenas translateX (nenhum movimento vertical)
      sliderTrack.style.transform = `translateX(${offset}px)`;
    }

    function goToSlide(index) {
      activeIndex = index;
      updateActiveClass();
      updateSliderPosition();
    }

    // Ajuste para rolagem infinita após transição
    sliderTrack.addEventListener("transitionend", () => {
      if (activeIndex < clonesCount) {
        activeIndex += originalCount;
        sliderTrack.style.transition = "none";
        updateActiveClass();
        updateSliderPosition();
        sliderTrack.offsetHeight; // força reflow
        sliderTrack.style.transition = "transform 0.2s ease-in-out";
      } else if (activeIndex >= clonesCount + originalCount) {
        activeIndex -= originalCount;
        sliderTrack.style.transition = "none";
        updateActiveClass();
        updateSliderPosition();
        sliderTrack.offsetHeight;
        sliderTrack.style.transition = "transform 0.2s ease-in-out";
      }
    });

    // Estado inicial
    updateActiveClass();
    updateSliderPosition();

    // Botões de navegação
    const btnPrev = document.getElementById("slider-btn-prev");
    const btnNext = document.getElementById("slider-btn-next");
    btnPrev.addEventListener("click", () => {
      goToSlide(activeIndex - 1);
      resetAutoSlide();
    });
    btnNext.addEventListener("click", () => {
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
