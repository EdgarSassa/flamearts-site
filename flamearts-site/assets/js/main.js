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

    // Cria os elementos do slider e os armazena em um array
    const sliderItems = [];
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
        // Permite clicar para pausar/retomar o vídeo
        video.addEventListener("click", () => {
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        });
        itemDiv.appendChild(video);
      }

      sliderTrack.appendChild(itemDiv);
      sliderItems.push(itemDiv);
    });

    // Define o índice ativo inicial – de forma que haja 2 itens anteriores e 2 posteriores
    let activeIndex = 2;
    if (activeIndex >= sliderItems.length) {
      activeIndex = 0;
    }

    // Função para atualizar a classe "active" nos itens
    function updateActiveClass() {
      sliderItems.forEach((item, idx) => {
        if (idx === activeIndex) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }

    // Calcula e atualiza a posição do slider para centralizar o item ativo
    function updateSliderPosition() {
      const sliderContainer = document.querySelector(".slider-container");
      const containerWidth = sliderContainer.offsetWidth;
      let offset = 0;
      
      /* 
         Cada item não ativo: 260px de largura + 20px (10px em cada lado) = 280px.
         O item ativo: 520px + 20px = 540px.
         Para centralizar o item ativo, calculamos a soma das larguras de todos os itens anteriores 
         e adicionamos metade da largura do item ativo.
      */
      let sumWidth = 0;
      for (let i = 0; i < activeIndex; i++) {
        sumWidth += 280;
      }
      const activeItemCenter = sumWidth + 540 / 2;
      offset = containerWidth / 2 - activeItemCenter;
      sliderTrack.style.transform = `translateX(${offset}px)`;
    }

    // Função para ir a um slide específico (com wrap-around)
    function goToSlide(index) {
      if (index < 0) {
        activeIndex = sliderItems.length - 1;
      } else if (index >= sliderItems.length) {
        activeIndex = 0;
      } else {
        activeIndex = index;
      }
      updateActiveClass();
      updateSliderPosition();
    }

    // Configura o estado inicial do slider
    updateActiveClass();
    updateSliderPosition();

    // Configura os botões de navegação
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

    // Configura o auto slide: troca de slide a cada 8 segundos
    let autoSlideInterval = setInterval(() => {
      goToSlide(activeIndex + 1);
    }, 8000);

    // Função para reiniciar o temporizador do auto slide após clique
    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => {
        goToSlide(activeIndex + 1);
      }, 8000);
    }

    // Atualiza a posição do slider se a janela for redimensionada
    window.addEventListener("resize", updateSliderPosition);

  } catch (error) {
    console.error('Erro ao carregar a galeria:', error);
  }
});
