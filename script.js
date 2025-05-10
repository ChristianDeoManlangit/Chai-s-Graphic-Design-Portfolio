// Content protection
document.addEventListener('keydown', function(e) {
  if (
    e.keyCode === 123 || 
    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
    (e.ctrlKey && e.keyCode === 85)
  ) {
    e.preventDefault();
    return false;
  }
});

// Dark mode toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const moonIcon = themeToggleBtn.querySelector('i');

function setTheme(theme) {
  const body = document.body;
  if (theme === 'dark') {
    body.classList.add('dark');
    body.classList.remove('light');
    moonIcon.classList.remove('fa-moon');
    moonIcon.classList.add('fa-sun');
  } else {
    body.classList.add('light');
    body.classList.remove('dark');
    moonIcon.classList.remove('fa-sun');
    moonIcon.classList.add('fa-moon');
  }
}

// Set default theme to dark and add transition class
document.body.classList.add('theme-transition');
setTheme('dark');
// Check local storage for theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
});

// Tabs functionality
const tabs = document.querySelectorAll('#tabs li');
const tabContents = {
  TAB1: document.getElementById('posts'),
  TAB2: document.getElementById('igtv'),
  TAB3: document.getElementById('saved'),
  tagged: document.getElementById('tagged'),
};

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => {
      t.classList.remove('border-t-2', 'border-black', 'dark:border-white');
      t.classList.add('hover:text-gray-900', 'dark:hover:text-white');
    });
    Object.values(tabContents).forEach(content => content.classList.add('hidden'));
    tab.classList.add('border-t-2');
    
    // Remove any existing border colors
    tab.classList.remove('border-black', 'border-white');
    
    // Add appropriate border color based on theme
    if (document.body.classList.contains('light')) {
      tab.classList.add('border-black');
    } else {
      tab.classList.add('border-white');
    }
    tab.classList.remove('hover:text-gray-900', 'dark:hover:text-white');
    currentTab = tab.getAttribute('data-tab');
    tabContents[currentTab].classList.remove('hidden');
    updateGalleryImages();
    attachImageListeners();
  });
});

const modal = document.getElementById('modalOverlay');
const desktopModal = document.getElementById('modalContent');
const mobileModal = document.getElementById('mobileModalContent');
const modalImage = document.getElementById('modalImage');
const mobileModalImage = document.getElementById('mobileModalImage');
const modalUsername = document.getElementById('modalUsername');
const mobileUsername = document.getElementById('mobileUsername');
const modalTime = document.getElementById('modalTime');
const mobileTime = document.getElementById('mobileTime');
const modalTitle = document.getElementById('modalTitle');
const mobileModalTitle = document.getElementById('mobileModalTitle');
const modalDescription = document.getElementById('modalDescription');
const mobileModalDescription = document.getElementById('mobileModalDescription');
const modalUserAvatar = document.getElementById('modalUserAvatar');
const mobileUserAvatar = document.getElementById('mobileUserAvatar');
const modalClose = document.getElementById('modalClose');
const mobileModalClose = document.getElementById('mobileModalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const mobilePrev = document.getElementById('mobilePrev');
const mobileNext = document.getElementById('mobileNext');

let currentTab = 'TAB1';
let galleryImages = [];
let currentImageIndex = 0;

function updateGalleryImages() {
  const tabContent = tabContents[currentTab];
  if (tabContent) {
    galleryImages = Array.from(tabContent.querySelectorAll('.image-hover'));
  }
}

function attachImageListeners() {
  galleryImages.forEach((img) => {
    img.addEventListener('click', () => {
      const index = galleryImages.indexOf(img);
      if (index !== -1) {
        openModal(img, index);
      }
    });
  });
}

// Initialize gallery images and attach listeners
updateGalleryImages();
attachImageListeners();

async function openModal(img, index) {
  currentImageIndex = index;
  modalImage.style.opacity = '0.5';
  mobileModalImage.style.opacity = '0.5';
  
  // Show thumbnail immediately
  modalImage.src = img.src;
  mobileModalImage.src = img.src;
  
  try {
    // Load full resolution image in background
    const fullResUrl = await loadFullResImage(img.src);
    modalImage.src = fullResUrl;
    mobileModalImage.src = fullResUrl;
    modalImage.style.opacity = '1';
    mobileModalImage.style.opacity = '1';
  } catch (error) {
    console.error('Error loading full resolution image:', error);
    modalImage.src = img.src;
    mobileModalImage.src = img.src;
    modalImage.style.opacity = '1';
    mobileModalImage.style.opacity = '1';
  }

  modalUsername.textContent = img.dataset.username || 'username';
  mobileUsername.textContent = img.dataset.username || 'username';
  modalTime.textContent = img.dataset.time || '1 day ago';
  mobileTime.textContent = img.dataset.time || '1 day ago';
  modalTitle.textContent = img.alt || 'Gallery Image';
  mobileModalTitle.textContent = img.alt || 'Gallery Image';
  modalDescription.textContent = img.dataset.description || '';
  mobileModalDescription.textContent = img.dataset.description || '';

  const avatarUrl = 'https://github.com/ChristianDeoManlangit/ImageSources/blob/main/profile.jpg?raw=true';
  modalUserAvatar.src = avatarUrl;
  mobileUserAvatar.src = avatarUrl;

  updateNavButtons();
  checkScreenSize();
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', handleKeyDown);
}

function checkScreenSize() {
  if (window.innerWidth <= 768) {
    desktopModal.classList.add('hidden');
    mobileModal.classList.remove('hidden');
    mobileModal.classList.add('flex');
    modalPrev.classList.add('hidden');
    modalNext.classList.add('hidden');
  } else {
    desktopModal.classList.remove('hidden');
    mobileModal.classList.add('hidden');
    mobileModal.classList.remove('flex');
    modalPrev.classList.remove('hidden');
    modalNext.classList.remove('hidden');
  }
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleKeyDown);
}

function navigatePrev() {
  if (currentImageIndex > 0) {
    currentImageIndex--;
    const prevImg = galleryImages[currentImageIndex];
    modalImage.src = prevImg.src;
    mobileModalImage.src = prevImg.src;
    modalTitle.textContent = prevImg.alt || 'Gallery Image';
    mobileModalTitle.textContent = prevImg.alt || 'Gallery Image';
    modalDescription.textContent = prevImg.dataset.description || '';
    mobileModalDescription.textContent = prevImg.dataset.description || '';
    modalTime.textContent = prevImg.dataset.time || '';
    mobileTime.textContent = prevImg.dataset.time || '';
    updateNavButtons();
  }
}

function navigateNext() {
  if (currentImageIndex < galleryImages.length - 1) {
    currentImageIndex++;
    const nextImg = galleryImages[currentImageIndex];
    modalImage.src = nextImg.src;
    mobileModalImage.src = nextImg.src;
    modalTitle.textContent = nextImg.alt || 'Gallery Image';
    mobileModalTitle.textContent = nextImg.alt || 'Gallery Image';
    modalDescription.textContent = nextImg.dataset.description || '';
    mobileModalDescription.textContent = nextImg.dataset.description || '';
    modalTime.textContent = nextImg.dataset.time || '';
    mobileTime.textContent = nextImg.dataset.time || '';
    updateNavButtons();
  }
}

function updateNavButtons() {
  if (currentImageIndex === 0) {
    modalPrev.classList.add('opacity-50', 'cursor-not-allowed');
    modalPrev.disabled = true;
    mobilePrev.classList.add('opacity-50', 'cursor-not-allowed');
    mobilePrev.disabled = true;
  } else {
    modalPrev.classList.remove('opacity-50', 'cursor-not-allowed');
    modalPrev.disabled = false;
    mobilePrev.classList.remove('opacity-50', 'cursor-not-allowed');
    mobilePrev.disabled = false;
  }

  if (currentImageIndex === galleryImages.length - 1) {
    modalNext.classList.add('opacity-50', 'cursor-not-allowed');
    modalNext.disabled = true;
    mobileNext.classList.add('opacity-50', 'cursor-not-allowed');
    mobileNext.disabled = true;
  } else {
    modalNext.classList.remove('opacity-50', 'cursor-not-allowed');
    modalNext.disabled = false;
    mobileNext.classList.remove('opacity-50', 'cursor-not-allowed');
    mobileNext.disabled = false;
  }
}

function handleKeyDown(e) {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') navigatePrev();
  if (e.key === 'ArrowRight') navigateNext();
}

modalClose.addEventListener('click', closeModal);
mobileModalClose.addEventListener('click', closeModal);
modalPrev.addEventListener('click', () => {
  if (!modalPrev.disabled) navigatePrev();
});
modalNext.addEventListener('click', () => {
  if (!modalNext.disabled) navigateNext();
});
mobilePrev.addEventListener('click', () => {
  if (!mobilePrev.disabled) navigatePrev();
});
mobileNext.addEventListener('click', () => {
  if (!mobileNext.disabled) navigateNext();
});
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

window.addEventListener('resize', checkScreenSize);

function getFullResUrl(url) {
  // Remove any size parameters and get full resolution URL
  return url.replace(/[?&]s=\d+/, '').replace(/[?&]w=\d+/, '');
}

function getThumbnailUrl(url) {
  // Add size parameter for thumbnails (300px width)
  const baseUrl = url.split('?')[0];
  return `${baseUrl}?w=300`;
}

function loadFullResImage(thumbnailUrl) {
  return new Promise((resolve, reject) => {
    const fullResUrl = getFullResUrl(thumbnailUrl);
    const img = new Image();
    img.onload = () => resolve(fullResUrl);
    img.onerror = reject;
    img.src = fullResUrl;
  });
}

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

// === GSAP Animations ===
window.addEventListener('DOMContentLoaded', () => {
  // Startup animation
  const mainContainer = document.querySelector('.max-w-6xl');
  mainContainer.setAttribute('id', 'startup-anim');
  gsap.to(mainContainer, {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    duration: 3,
    ease: 'power3.out',
    onStart: () => {
      mainContainer.style.filter = 'blur(32px)';
      mainContainer.style.opacity = '0';
      mainContainer.style.transform = 'translateY(-80px)';
    },
    onComplete: () => {
      mainContainer.removeAttribute('id');
      mainContainer.style.filter = '';
      mainContainer.style.opacity = '';
      mainContainer.style.transform = '';
    }
  });

  // Logo tilt on hover
  const logo = document.querySelector('header img[alt="Logo"]');
  logo.classList.add('logo-tilt');
  logo.addEventListener('mouseenter', () => {
    gsap.to(logo, { rotateZ: -10, duration: 0.3, ease: 'power2.out' });
  });
  logo.addEventListener('mouseleave', () => {
    gsap.to(logo, { rotateZ: 0, duration: 0.3, ease: 'power2.out' });
  });

  // Theme toggle animation
  const body = document.body;
  function animateThemeChange() {
    body.classList.add('theme-anim');
    setTimeout(() => body.classList.remove('theme-anim'), 700);
  }
  themeToggleBtn.addEventListener('click', animateThemeChange);

  // Blur transition for tab switch
  const tabContentsEls = Object.values(tabContents);
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const currentGrid = tabContents[currentTab];
      if (currentGrid) {
        currentGrid.classList.add('grid-blur');
        setTimeout(() => {
          currentGrid.classList.remove('grid-blur');
        }, 500);
      }
      setTimeout(() => {
        const newGrid = tabContents[tab.getAttribute('data-tab')];
        if (newGrid) {
          newGrid.classList.add('grid-blur');
          setTimeout(() => newGrid.classList.add('active'), 10);
          setTimeout(() => newGrid.classList.remove('grid-blur', 'active'), 600);
        }
      }, 10);
    });
  });

  // Modal scale up and blur out
  function animateModalOpen(modalEl) {
    modalEl.classList.add('modal-scale');
    setTimeout(() => modalEl.classList.add('active'), 10);
    setTimeout(() => modalEl.classList.remove('modal-scale', 'active'), 600);
  }
  function animateModalClose(modalEl, cb) {
    modalEl.classList.add('modal-blur-out');
    setTimeout(() => {
      modalEl.classList.remove('modal-blur-out');
      if (cb) cb();
    }, 500);
  }
  // Patch openModal and closeModal
  const origOpenModal = window.openModal;
  window.openModal = async function(img, index) {
    await origOpenModal(img, index);
    if (window.innerWidth <= 768) {
      animateModalOpen(mobileModal);
    } else {
      animateModalOpen(desktopModal);
    }
  };
  function patchedCloseModal() {
    const modalEl = window.innerWidth <= 768 ? mobileModal : desktopModal;
    animateModalClose(modalEl, () => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    });
  }
  modalClose.removeEventListener('click', closeModal);
  mobileModalClose.removeEventListener('click', closeModal);
  modalClose.addEventListener('click', patchedCloseModal);
  mobileModalClose.addEventListener('click', patchedCloseModal);

  // === Lazy load images with blur-in ===
  function lazyLoadGridImages(gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const imgs = Array.from(grid.querySelectorAll('img'));
    imgs.forEach(img => {
      img.classList.add('lazy-blur');
    });
    let loaded = 0;
    function revealImage(img) {
      if (!img.classList.contains('loaded')) {
        img.src = img.src; // trigger load
        img.onload = () => {
          img.classList.add('loaded');
          // Smooth slow blur-in animation using GSAP
          gsap.fromTo(img, {
            filter: 'blur(32px)',
            opacity: 0,
            scale: 0.92
          }, {
            filter: 'blur(0px)',
            opacity: 1,
            scale: 1,
            duration: 1.1,
            ease: 'power2.out',
            onComplete: () => {
              img.style.transform = '';
            }
          });
        };
      }
    }
    // Use IntersectionObserver for 1-by-1 reveal
    let i = 0;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            revealImage(entry.target);
          }, i * 120);
          i++;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    imgs.forEach(img => observer.observe(img));
  }
  ['posts', 'igtv', 'saved'].forEach(lazyLoadGridImages);
});

// Animate modal image blur in
function animateModalImageBlur(modalImg) {
  gsap.fromTo(modalImg, {
    filter: 'blur(32px)',
    opacity: 0
  }, {
    filter: 'blur(0px)',
    opacity: 1,
    duration: 0.5,
    ease: 'power2.out'
  });
}
