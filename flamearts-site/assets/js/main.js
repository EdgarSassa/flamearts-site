document.addEventListener("DOMContentLoaded", () => {
  // Mapeamento dos títulos para cada seção da SPA
  const pageTitles = {
    "inicio": "Flamearts - Comunicação e Marketing",
    "services": "Flamearts - Serviços",
    "portfolio": "Flamearts - Portfólio",
    "about": "Flamearts - Sobre",
    "budget": "Flamearts - Orçamento"
  };

  // Loader: remove o loader assim que a página for carregada
  window.addEventListener("load", () => {
    const loader = document.getElementById("page-loader");
    if (loader) {
      loader.style.opacity = "0"; // inicia o fade out
      setTimeout(() => {
        loader.style.display = "none"; // remove após 0.5s
      }, 500);
    }
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.classList.remove("pre-animate");
    }
  });

  // Toggle do menu mobile
  const menuToggle = document.getElementById("menu-toggle");
  const menuList = document.getElementById("menu-list");
  if (menuToggle && menuList) {
    menuToggle.addEventListener("click", () => {
      menuList.classList.toggle("active");
    });
  }

  // Ordem das páginas conforme o menu
  const pagesOrder = ["inicio", "services", "portfolio", "about", "budget"];

  // Função para transição entre seções com efeito de slide (0.4s)
  function navigateTo(sectionId) {
    const current = document.querySelector(".page-section.active");
    const target = document.getElementById(sectionId);
    if (!target || current === target) return;
    
    const currentIndex = pagesOrder.indexOf(current.id);
    const targetIndex = pagesOrder.indexOf(target.id);
    let outClass, inClass;
    
    current.classList.remove("slide-out", "slide-out-reverse");
    target.classList.remove("slide-in", "slide-in-reverse");
    
    target.style.display = "block";
    
    if (targetIndex > currentIndex) {
      outClass = "slide-out";
      inClass = "slide-in";
    } else {
      outClass = "slide-out-reverse";
      inClass = "slide-in-reverse";
    }
    
    target.style.zIndex = "2";
    current.style.zIndex = "1";
    
    current.classList.add(outClass);
    target.classList.add(inClass, "active");
    
    setTimeout(() => {
      current.classList.remove("active", outClass);
      current.style.display = "none";
      target.classList.remove(inClass);
      target.style.zIndex = "";
      current.style.zIndex = "";
    }, 400);
    
    document.querySelectorAll("#menu-list a").forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + sectionId) {
        link.classList.add("active");
      }
    });
    
    history.pushState(null, "", "#" + sectionId);
    // Atualiza o título da aba de acordo com a seção atual
    if(pageTitles[sectionId]){
      document.title = pageTitles[sectionId];
    }
    window.scrollTo(0, 0);
  }
  
  window.navigateTo = navigateTo;
  
  document.querySelectorAll("#menu-list a").forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute("href").substring(1);
      navigateTo(sectionId);
      if (menuList.classList.contains("active")) {
        menuList.classList.remove("active");
      }
    });
  });
  
  window.addEventListener("popstate", () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      navigateTo(hash);
    } else {
      navigateTo("inicio");
    }
  });
  
  const initialHash = window.location.hash.substring(1);
  if (initialHash) {
    navigateTo(initialHash);
  } else {
    navigateTo("inicio");
  }
  
  /* -----------------------------------------------------------------
     Efeito interativo de reflexo para todos os containers
  ------------------------------------------------------------------ */
  const containers = document.querySelectorAll('.container');
  containers.forEach(container => {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const posX = (x / rect.width) * 100;
      const posY = (y / rect.height) * 100;
      container.style.setProperty('--mouse-x', `${posX}%`);
      container.style.setProperty('--mouse-y', `${posY}%`);
      container.classList.add('reflect-active');
    });
    container.addEventListener('mouseleave', () => {
      container.classList.remove('reflect-active');
    });
  });
  
  /* -----------------------------------------------------------------
     Renderização dos itens do portfólio com a nova estrutura e visual.
  ------------------------------------------------------------------ */
  const portfolioData = [
    {
      type: 'image',
      file: 'assets/gallery/image1.jpg',
      title: 'Cartaz de Natal – Céu Professional',
      description: 'Criamos um cartaz natalino que equilibra elementos clássicos e contemporâneos, destacando a identidade da Céu Professional. Com um design limpo e uma tipografia refinada.'
    },
    {
      type: 'image',
      file: 'assets/gallery/image2.jpg',
      title: 'Cartaz Professional Creme Clareador',
      description: 'Desenvolvemos um cartaz para o Creme Clareador, ressaltando sua eficácia e sofisticação. A peça alia uma estética clean a uma mensagem objetiva, transmitindo confiança e modernidade para um público exigente.'
    },
    {
      type: 'image',
      file: 'assets/gallery/image3.jpg',
      title: 'Cartaz Flamearts',
      description: 'No cartaz de autopromoção da Flamearts, evidenciamos nossa expertise e trajetória de sucesso em campanhas publicitárias. Com uma identidade visual marcante e design contemporâneo, a peça reforça nosso posicionamento como referência em inovação e criatividade.'
    },
    {
      type: 'image',
      file: 'assets/gallery/image4.jpg',
      title: 'Cartaz Comemorativo 68 anos Porto do Namibe',
      description: 'Para celebrar os 68 anos do Porto do Namibe, criamos um cartaz que une tradição e modernidade. A peça destaca a importância histórica e cultural do porto, transmitindo orgulho e reconhecimento por meio de uma estética elegante e simbólica.'
    },
    {
      type: 'image',
      file: 'assets/gallery/image5.jpg',
      title: 'Cartaz Ambientador Desinfectante Coral – Limão',
      description: 'Desenvolvemos um cartaz para o Ambientador Desinfectante Coral com aroma de limão, que ressalta a pureza e a eficácia do produto. A comunicação visual impactante enfatiza o frescor e a renovação, alinhando-se à proposta inovadora da marca.'
    },
    {
      type: 'image',
      file: 'assets/gallery/image6.jpg',
      title: 'Cartaz Pasta de Dentes Dental-C – Céu',
      description: 'Elaboramos um cartaz para a linha Dental-C que enfatiza a saúde bucal e a inovação. A composição utiliza cores vibrantes e uma abordagem minimalista para destacar os atributos do produto, reforçando o compromisso com a qualidade e o bem-estar.'
    },
    {
      type: 'video',
      file: 'assets/gallery/video1.mp4',
      title: 'Postal de Natal – Céu Professional',
      description: 'Desenvolvemos um postal de Natal em vídeo que une a magia das festas com uma narrativa envolvente. A produção reflete a sofisticação e o espírito festivo da marca, transmitindo mensagens de união, renovação e tradição com recursos visuais modernos e impactantes.'
    },
    {
      type: 'video',
      file: 'assets/gallery/video2.mp4',
      title: 'Céu Professional Creme Clareador',
      description: 'Produzimos um vídeo promocional que destaca os diferenciais do Creme Clareador, por meio de uma narrativa dinâmica e recursos de motion graphics. A peça comunica de maneira envolvente os benefícios do produto, elevando sua presença no mercado.'
    },
    {
      type: 'video',
      file: 'assets/gallery/video3.mp4',
      title: 'Reel 2023',
      description: 'O Reel 2023 é uma compilação dinâmica dos nossos melhores projetos ao longo do ano. Com uma curadoria cuidadosa das peças, o vídeo reflete nossa versatilidade e excelência, celebrando conquistas e inspirando novos desafios para a Flamearts.'
    },
    {
      type: 'video',
      file: 'assets/gallery/video4.mp4',
      title: 'Gel Estilizante Preto – Céu Professional',
      description: 'Criamos um vídeo publicitário para o Gel Estilizante Preto, enfatizando sua capacidade de modelar e definir estilos com precisão. A peça utiliza recursos audiovisuais modernos para reforçar a identidade inovadora do produto e atrair um público contemporâneo.'
    },
    {
      type: 'video',
      file: 'assets/gallery/video5.mp4',
      title: 'Céu Professional Spray Fixador',
      description: 'Produzimos um vídeo que destaca o Spray Fixador com uma narrativa fluida e produção de alta qualidade. A peça evidencia a performance e a versatilidade do produto, comunicando seus benefícios de forma clara e envolvente para o público.'
    },
    {
      type: 'video',
      file: 'assets/gallery/video6.mp4',
      title: 'Mahjong Monster Arena',
      description: 'Para o game Mahjong Monster Arena, desenvolvemos uma peça publicitária em vídeo que combina ação, mistério e interatividade. Com efeitos dinâmicos e cenários imersivos, a narrativa visual foi pensada para engajar jogadores e destacar a identidade única do universo digital do game.'
    }
  ];
  
  function renderPortfolioItems() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    portfolioData.forEach((item, index) => {
      // Cria o item com a nova estrutura
      const portfolioItem = document.createElement('div');
      portfolioItem.classList.add('portfolio-item');
      
      const contentWrapper = document.createElement('div');
      contentWrapper.classList.add('portfolio-content');
      
      if (item.type === 'image') {
        const img = document.createElement('img');
        img.src = item.file;
        img.alt = item.title;
        contentWrapper.appendChild(img);
      } else if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.file;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.controls = false;
        contentWrapper.appendChild(video);
        portfolioItem.addEventListener('mouseenter', () => {
          video.play();
        });
        portfolioItem.addEventListener('mouseleave', () => {
          video.pause();
          video.currentTime = 0;
        });
      }
      
      portfolioItem.appendChild(contentWrapper);
      
      // Cria o overlay: por padrão, cobre totalmente com fundo preto 40%
      const overlay = document.createElement('div');
      overlay.classList.add('portfolio-overlay');
      
      // Cria o container para o título (apenas exibido em hover)
      const textWrapper = document.createElement('div');
      textWrapper.classList.add('portfolio-text');
      
      const titleEl = document.createElement('h3');
      titleEl.textContent = item.title;
      
      textWrapper.appendChild(titleEl);
      overlay.appendChild(textWrapper);
      portfolioItem.appendChild(overlay);
      
      // Adiciona evento de clique para abrir a aba flutuante (modal)
      portfolioItem.addEventListener('click', () => {
        openModal(index);
      });
      
      grid.appendChild(portfolioItem);
    });
  }
  
  renderPortfolioItems();
  
  /* Modal functionality */
  let currentPortfolioIndex = 0;
  
  function openModal(index) {
    currentPortfolioIndex = index;
    updateModal();
    document.getElementById('modal').style.display = 'block';
  }
  
  function updateModal() {
    const item = portfolioData[currentPortfolioIndex];
    const modalMedia = document.getElementById('modal-media');
    modalMedia.innerHTML = '';
    if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.file;
      img.alt = item.title;
      modalMedia.appendChild(img);
    } else if (item.type === 'video') {
      const video = document.createElement('video');
      video.src = item.file;
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      modalMedia.appendChild(video);
    }
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-description').textContent = item.description;
  }
  
  document.getElementById('modal-close').addEventListener('click', () => {
    const modalMedia = document.getElementById('modal-media');
    const video = modalMedia.querySelector('video');
    if(video) {
      video.pause();
      video.currentTime = 0;
    }
    document.getElementById('modal').style.display = 'none';
  });
  
  document.getElementById('modal-prev').addEventListener('click', () => {
    currentPortfolioIndex = (currentPortfolioIndex - 1 + portfolioData.length) % portfolioData.length;
    updateModal();
  });
  
  document.getElementById('modal-next').addEventListener('click', () => {
    currentPortfolioIndex = (currentPortfolioIndex + 1) % portfolioData.length;
    updateModal();
  });
  
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
      const modalMedia = document.getElementById('modal-media');
      const video = modalMedia.querySelector('video');
      if(video) {
        video.pause();
        video.currentTime = 0;
      }
      modal.style.display = 'none';
    }
  });
});
