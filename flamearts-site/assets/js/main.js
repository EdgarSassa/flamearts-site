document.addEventListener("DOMContentLoaded", () => {
  // Loader: remove o loader assim que a página for carregada
  window.addEventListener("load", () => {
    const loader = document.getElementById("page-loader");
    if (loader) {
      loader.style.opacity = 0;
      setTimeout(() => {
        loader.style.display = "none";
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

  // Função para realizar a transição entre seções com efeito de slide (0.4s)
  function navigateTo(sectionId) {
    const current = document.querySelector(".page-section.active");
    const target = document.getElementById(sectionId);
    if (!target || current === target) return;
    
    // Determina a direção da transição com base na ordem das páginas
    const currentIndex = pagesOrder.indexOf(current.id);
    const targetIndex = pagesOrder.indexOf(target.id);
    let outClass, inClass;
    
    if (targetIndex > currentIndex) {
      outClass = "slide-out";
      inClass = "slide-in";
    } else {
      outClass = "slide-out-reverse";
      inClass = "slide-in-reverse";
    }
    
    current.classList.add(outClass);
    target.classList.add("active", inClass);
    
    setTimeout(() => {
      current.classList.remove("active", outClass);
      target.classList.remove(inClass);
    }, 400);

    // Atualiza o item ativo do menu
    document.querySelectorAll("#menu-list a").forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + sectionId) {
        link.classList.add("active");
      }
    });

    // Atualiza o hash na URL sem recarregar a página
    history.pushState(null, "", "#" + sectionId);
    window.scrollTo(0, 0);
  }

  // Torna a função navigateTo acessível globalmente para os atributos onclick
  window.navigateTo = navigateTo;

  // Vincula os cliques dos links do menu para navegação interna
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

  // Suporte à navegação com os botões "voltar/avançar" do navegador
  window.addEventListener("popstate", () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      navigateTo(hash);
    } else {
      navigateTo("inicio");
    }
  });

  // Ao carregar a página, navega para a seção indicada pelo hash ou para "inicio"
  const initialHash = window.location.hash.substring(1);
  if (initialHash) {
    navigateTo(initialHash);
  } else {
    navigateTo("inicio");
  }

  /* -----------------------------------------------------------------
     Efeito interativo de reflexo para todos os containers do site.
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
     Renderização dos itens do portfólio com os caminhos, títulos e descrições.
     Os nomes dos arquivos permanecem os originais, como "image1.jpg" etc.
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
      file: 'flamearts-site/assets/gallery/video6.mp4',
      title: 'Mahjong Monster Arena',
      description: 'Para o game Mahjong Monster Arena, desenvolvemos uma peça publicitária em vídeo que combina ação, mistério e interatividade. Com efeitos dinâmicos e cenários imersivos, a narrativa visual foi pensada para engajar jogadores e destacar a identidade única do universo digital do game.'
    }
  ];

  function renderPortfolioItems() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    portfolioData.forEach(item => {
      const portfolioItem = document.createElement('div');
      portfolioItem.classList.add('portfolio-item');

      // Se for imagem, cria <img>; se for vídeo, cria <video>
      if (item.type === 'image') {
        const img = document.createElement('img');
        // Aqui definimos o caminho real do arquivo
        img.src = item.file;
        // O alt é apenas o título
        img.alt = item.title;
        portfolioItem.appendChild(img);
      } else if (item.type === 'video') {
        const video = document.createElement('video');
        // Aqui definimos o caminho real do arquivo
        video.src = item.file;
        video.controls = true;
        portfolioItem.appendChild(video);
      }

      // Título (h3)
      const itemTitle = document.createElement('h3');
      itemTitle.textContent = item.title;
      portfolioItem.appendChild(itemTitle);

      // Descrição (p)
      const itemDesc = document.createElement('p');
      itemDesc.textContent = item.description;
      portfolioItem.appendChild(itemDesc);

      // Adiciona o item no grid
      grid.appendChild(portfolioItem);
    });
  }

  // Chama a função de renderização ao carregar
  renderPortfolioItems();
});
