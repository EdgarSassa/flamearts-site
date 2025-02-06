document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Busca o arquivo JSON com os dados da galeria
    const response = await fetch('assets/gallery/gallery.json');
    if (!response.ok) {
      throw new Error('Erro na requisição do JSON: ' + response.statusText);
    }
    const data = await response.json();

    // Seleciona o elemento onde os itens serão inseridos
    const galleryGrid = document.getElementById("gallery-grid");
    if (!galleryGrid) {
      console.error('Elemento #gallery-grid não encontrado.');
      return;
    }

    const photos = data.photos || [];
    const videos = data.videos || [];
    const total = Math.min(photos.length, videos.length);

    // Intercala os itens: foto, vídeo, foto, vídeo...
    for (let i = 0; i < total; i++) {
      // Cria e insere o item de foto
      const photoItem = document.createElement("div");
      photoItem.classList.add("gallery-item");
      const img = document.createElement("img");
      img.src = `assets/gallery/${photos[i].file}`;
      img.alt = photos[i].alt || "Imagem da galeria";
      photoItem.appendChild(img);
      galleryGrid.appendChild(photoItem);

      // Cria e insere o item de vídeo
      const videoItem = document.createElement("div");
      videoItem.classList.add("gallery-item");
      const video = document.createElement("video");
      video.src = `assets/gallery/${videos[i].file}`;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";
      video.load();  // Garante que o vídeo será carregado para exibição mesmo sem autoplay

      // Em desktop, toca ao passar o mouse; em mobile, toca/pausa com o toque
      videoItem.addEventListener("mouseenter", () => {
        video.play();
      });
      videoItem.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
      });
      videoItem.addEventListener("click", () => {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });

      videoItem.appendChild(video);
      galleryGrid.appendChild(videoItem);
    }
  } catch (error) {
    console.error('Erro ao carregar a galeria:', error);
  }
});
