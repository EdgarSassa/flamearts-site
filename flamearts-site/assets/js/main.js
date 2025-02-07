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

    // Configuração de clones para rolamento infinito
    const clonesCount = 2;
    const originalCount = originalItems.length;
    let sliderItems = [...originalItems];

    // Cria clones para o início: clones dos últimos clonesCount itens na ordem original
    let beginningClones = [];
    for (let i = originalCount - clonesCount; i < originalCount; i++) {
      const clone = originalItems[i].cloneNode(true);
      clone.classList.add("clone");
      beginningClones.push(clone);
    }
    // Insere os clones no início (na ordem desejada)
    beginningClones.reverse().forEach(clone => {
      sliderTrack.insertBefore(clone, sliderTrack.firstChild);
      sliderItems.unshift(clone);
    });

    // Cria clones para o final: clones dos primeiros clonesCount itens (na ordem normal)
    for (let i = 0; i < clonesCount; i++) {
      const clone = originalItems[i].cloneNode(true);
      clone.classList.add("clone");
      sliderTrack.appendChild(clone);
      sliderItems.push(clone);
    }

    // Define o índice ativo inicial: o primeiro item original está logo após os clones do início
    let activeIndex = clonesCount;
    let isTransitioning = false;

    // Função para atualizar a classe "active"
    function updateActiveClass() {
      sliderItems.forEach((item, idx) => {
        if (idx === activeIndex) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }

    // Calcula o deslocamento: cada item não ativo tem 270px; o item ativo tem 530px (metade = 265)
    function updateSliderPosition() {
      const containerWidth = document.querySelector(".slider-container").offsetWidth;
      let offset = containerWidth / 2 - (activeIndex * 270 + 265);
      sliderTrack.style.transform = `translateX(${offset}px) translateY(0)`;
    }

    // Função para ir para um slide (com duração configurável)
    function goToSlide(index, duration = 0.35) {
      if (isTransitioning) return;
      isTransitioning = true;
      activeIndex = index;
      sliderTrack.style.transition = `transform ${duration}s ease-in-out`;
      updateActiveClass();
      updateSliderPosition();
    }

    // Ouvinte de transitionend (apenas para a propriedade "transform")
    sliderTrack.addEventListener("transitionend", (e) => {
      if (e.propertyName !== "transform") return;
      // Se o índice ativo estiver no final dos clones (à direita)
      if (activeIndex >= clonesCount + originalCount) {
        activeIndex -= originalCount;
        sliderTrack.style.transition = "none";
        updateActiveClass();
        updateSliderPosition();
      }
      // Se o índice ativo estiver antes dos clones do início (à esquerda)
      else if (activeIndex < clonesCount) {
        activeIndex += originalCount;
        sliderTrack.style.transition = "none";
        updateActiveClass();
        updateSliderPosition();
      }
      // Força reflow para reiniciar a transição e desbloqueia cliques
      void sliderTrack.offsetWidth;
      sliderTrack.style.transition = "transform 0.35s ease-in-out";
      isTransitioning = false;
    });

    // Permite selecionar um item via clique – transição de 0.4s
    sliderItems.forEach((item, idx) => {
      item.addEventListener("click", () => {
        if (isTransitioning) return;
        if (idx === activeIndex) return;
        goToSlide(idx, 0.4);
        resetAutoSlide();
      });
    });

    // Botões de navegação
    document.getElementById("slider-btn-prev").addEventListener("click", () => {
      if (isTransitioning) return;
      goToSlide(activeIndex - 1);
      resetAutoSlide();
    });
    document.getElementById("slider-btn-next").addEventListener("click", () => {
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
    updateActiveClass();
    updateSliderPosition();

  } catch (error) {
    console.error('Erro ao carregar a galeria:', error);
  }
});
