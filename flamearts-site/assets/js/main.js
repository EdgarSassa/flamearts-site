document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Busca o arquivo JSON com os dados da galeria
    const response = await fetch('assets/gallery/gallery.json');
    if (!response.ok) {
      throw new Error('Erro na requisição do JSON: ' + response.statusText);
    }
    const data = await response.json();
    const photos = data.photos || [];
    const videos = data.videos || [];
    const total = Math.min(photos.length, videos.length);

    // Cria um array intercalado de itens: foto, vídeo, foto, vídeo...
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

    // Cria os elementos originais do slider e armazena em um array
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
        // Permite clique para pausar/retomar o vídeo
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

    // Para rolagem infinita, clonamos os últimos 2 itens e os inserimos no início,
    // e clonamos os 2 primeiros itens e os inserimos no final.
    const clonesCount = 2;
    const originalCount = originalItems.length;
    // Array que conterá todos os itens (originais + clones)
    let sliderItems = [...originalItems];

    // Clonar e inserir no início (clones dos últimos clonesCount itens)
    for (let i = originalCount - clonesCount; i < originalCount; i++) {
      const clone = originalItems[i].cloneNode(true);
      clone.classList.add("clone");
      sliderTrack.insertBefore(clone, sliderTrack.firstChild);
      sliderItems.unshift(clone);
    }

    // Clonar e inserir no final (clones dos primeiros clonesCount itens)
    for (let i = 0; i < clonesCount; i++) {
      const clone = originalItems[i].cloneNode(true);
      clone.classList.add("clone");
      sliderTrack.appendChild(clone);
      sliderItems.push(clone);
    }

    /* 
      Cálculo dos deslocamentos:
      - Cada item não ativo possui largura base de 260px + 20px de margem = 280px.
      - O item ativo possui largura de 520px + 20px de margem = 540px.
      Para centralizar o item ativo, soma-se a largura efetiva de todos os itens anteriores
      e acrescenta-se metade da largura efetiva do item ativo (540/2 = 270px).
    */
    // Definindo o índice ativo inicial:
    // Queremos que, inicialmente, o 3º item original seja ativo.
    // Como há 2 clones no início, activeIndex = clonesCount + 2.
    let activeIndex = clonesCount + 2;

    // Atualiza a classe "active" dos itens
    function updateActiveClass() {
      sliderItems.forEach((item, idx) => {
        if (idx === activeIndex) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }

    // Atualiza a posição do slider (movimento somente no eixo X)
    function updateSliderPosition() {
      const sliderContainer = document.querySelector(".slider-container");
      const containerWidth = sliderContainer.offsetWidth;
      let sumWidth = 0;
      // Soma a largura efetiva (280px para itens não ativos) de todos os itens anteriores
      for (let i = 0; i < activeIndex; i++) {
        sumWidth += 280;
      }
      // Adiciona metade da largura efetiva do item ativo (540/2 = 270px)
      const activeItemCenter = sumWidth + 270;
      const offset = containerWidth / 2 - activeItemCenter;
      // Aplica apenas translateX para evitar movimentação vertical
      sliderTrack.style.transform = `translateX(${offset}px)`;
    }

    // Função para ir a um slide específico
    function goToSlide(index) {
      activeIndex = index;
      updateActiveClass();
      updateSliderPosition();
    }

    // Evento para tratar o final da transição e ajustar o índice para rolagem infinita
    sliderTrack.addEventListener("transitionend", () => {
      // Se estivermos nos clones do início, saltamos para a parte original correspondente
      if (activeIndex < clonesCount) {
        activeIndex = activeIndex + originalCount;
        sliderTrack.style.transition = "none";
        updateActiveClass();
        updateSliderPosition();
        sliderTrack.offsetHeight; // força reflow
        sliderTrack.style.transition = "transform 0.2s ease-in-out";
      }
      // Se estivermos nos clones do final, saltamos para a parte original correspondente
      else if (activeIndex >= clonesCount + originalCount) {
        activeIndex = activeIndex - originalCount;
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

    // Reinicia o auto slide após interação do usuário
    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => {
        goToSlide(activeIndex + 1);
      }, 8000);
    }

    // Atualiza a posição do slider em caso de redimensionamento da janela
    window.addEventListener("resize", updateSliderPosition);

  } catch (error) {
    console.error('Erro ao carregar a galeria:', error);
  }
});
