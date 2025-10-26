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
const mobileModal = document.getElementById('mobileModalContent');
const mobileModalImage = document.getElementById('mobileModalImage');
const mobileUsername = document.getElementById('mobileUsername');
const mobileTime = document.getElementById('mobileTime');
const mobileModalTitle = document.getElementById('mobileModalTitle');
const mobileModalDescription = document.getElementById('mobileModalDescription');
const mobileUserAvatar = document.getElementById('mobileUserAvatar');
const mobileModalClose = document.getElementById('mobileModalClose');
const mobilePrev = document.getElementById('mobilePrev');
const mobileNext = document.getElementById('mobileNext');

// Ensure modal is always hidden on load
if (modal && !modal.classList.contains('hidden')) {
  modal.classList.add('hidden');
}
document.body.style.overflow = '';

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
        if (img.dataset.video) {
          openVideoModal(img, index);
        } else {
          openModal(img, index);
        }
      }
    });
  });
}

function showModal() {
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function hideModal() {
  modal.classList.add('hidden');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Format modal description to show only one proponent per line
function formatDescription(desc) {
  if (!desc) return '';
  // Only split on explicit \n, not on & | , or other characters
  return desc.replace(/\\n/g, '\n').trim();
}

function openVideoModal(img, index) {
  currentImageIndex = index;
  // Show video in mobile modal
  mobileModalImage.style.display = 'none';
  document.getElementById('mobileImageContainer').innerHTML = `<iframe src='${img.dataset.video}' class='rounded-lg shadow-lg' style='width:100%;height:auto;aspect-ratio:16/9;max-width:100vw;' frameborder='0' allowfullscreen></iframe>`;

  // Set info
  mobileUsername.textContent = img.dataset.username || 'Chai';
  mobileTime.textContent = img.dataset.time || 'August 2025';
  mobileModalTitle.textContent = img.alt || 'Video';
  mobileModalDescription.textContent = formatDescription(img.dataset.description || '');
  const avatarUrl = 'https://github.com/ChristianDeoManlangit/ImageSources/blob/main/profile.jpg?raw=true';
  mobileUserAvatar.src = avatarUrl;

  updateNavButtons();
  showModal();
  document.addEventListener('keydown', handleKeyDown);
}

// Initialize gallery images and attach listeners
updateGalleryImages();
attachImageListeners();

async function openModal(img, index) {
  currentImageIndex = index;
  mobileModalImage.style.opacity = '0.5';
  // Show thumbnail immediately
  mobileModalImage.src = img.src;
  mobileModalImage.style.display = '';
  document.getElementById('mobileImageContainer').innerHTML = '';
  document.getElementById('mobileImageContainer').appendChild(mobileModalImage);
  try {
    // Load full resolution image in background
    const fullResUrl = await loadFullResImage(img.src);
    mobileModalImage.src = fullResUrl;
    mobileModalImage.style.opacity = '1';
  } catch (error) {
    console.error('Error loading full resolution image:', error);
    mobileModalImage.src = img.src;
    mobileModalImage.style.opacity = '1';
  }
  mobileUsername.textContent = img.dataset.username || 'username';
  mobileTime.textContent = img.dataset.time || '1 day ago';
  mobileModalTitle.textContent = img.alt || 'Gallery Image';
  mobileModalDescription.textContent = formatDescription(img.dataset.description || '');
  const avatarUrl = 'https://github.com/ChristianDeoManlangit/ImageSources/blob/main/profile.jpg?raw=true';
  mobileUserAvatar.src = avatarUrl;
  updateNavButtons();
  showModal();
  document.addEventListener('keydown', handleKeyDown);
}

function closeModal() {
  document.getElementById('mobileImageContainer').innerHTML = '<img id="mobileModalImage" src="" alt="Expanded Image" class="w-full object-contain">';
  // Re-attach close event listener in case the button was replaced
  const closeBtn = document.getElementById('mobileModalClose');
  if (closeBtn) {
    closeBtn.onclick = null;
    closeBtn.addEventListener('click', closeModal);
  }
  hideModal();
  document.removeEventListener('keydown', handleKeyDown);
}

function navigatePrev() {
  if (currentImageIndex > 0) {
    currentImageIndex--;
    const prevImg = galleryImages[currentImageIndex];
    if (prevImg.dataset.video) {
      openVideoModal(prevImg, currentImageIndex);
    } else {
      openModal(prevImg, currentImageIndex);
    }
    updateNavButtons();
  }
}

function navigateNext() {
  if (currentImageIndex < galleryImages.length - 1) {
    currentImageIndex++;
    const nextImg = galleryImages[currentImageIndex];
    if (nextImg.dataset.video) {
      openVideoModal(nextImg, currentImageIndex);
    } else {
      openModal(nextImg, currentImageIndex);
    }
    updateNavButtons();
  }
}

function updateNavButtons() {
  if (currentImageIndex === 0) {
    mobilePrev.classList.add('opacity-50', 'cursor-not-allowed');
    mobilePrev.disabled = true;
  } else {
    mobilePrev.classList.remove('opacity-50', 'cursor-not-allowed');
    mobilePrev.disabled = false;
  }
  if (currentImageIndex === galleryImages.length - 1) {
    mobileNext.classList.add('opacity-50', 'cursor-not-allowed');
    mobileNext.disabled = true;
  } else {
    mobileNext.classList.remove('opacity-50', 'cursor-not-allowed');
    mobileNext.disabled = false;
  }
}

function handleKeyDown(e) {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') navigatePrev();
  if (e.key === 'ArrowRight') navigateNext();
}

mobileModalClose.addEventListener('click', closeModal);
mobilePrev.addEventListener('click', () => {
  if (!mobilePrev.disabled) navigatePrev();
});
mobileNext.addEventListener('click', () => {
  if (!mobileNext.disabled) navigateNext();
});
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

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
  // Ensure modal is hidden on DOMContentLoaded (in case script runs before DOM is ready)
  const modal = document.getElementById('modalOverlay');
  if (modal && !modal.classList.contains('hidden')) {
    modal.classList.add('hidden');
  }
  document.body.style.overflow = '';

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

  // Ensure close button is always attached after DOMContentLoaded
  const closeBtn = document.getElementById('mobileModalClose');
  if (closeBtn) {
    closeBtn.onclick = null;
    closeBtn.addEventListener('click', closeModal);
  }

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
