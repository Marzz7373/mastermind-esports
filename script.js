// !!! PASTE YOUR DEPLOYED WEB APP URL HERE !!!
const API_URL = "https://script.google.com/macros/s/AKfycbzJ7kANQFFX0c7HlG9wljNm06wMhUbRyPmpC-IxZ67SkXXBeJixpFAELJEZQJcfXOTZ/exec"; // <--- PASTE YOUR URL HERE

const WHATSAPP_NUMBER = '60147433177';
const ID_ALERT_MESSAGE = "Please enter your Player ID before clicking 'Order Instantly'.";

// =================================================================
// 1. PACKAGE DATA (Contains all package details, easy to update!)
// =================================================================

const pubgPackages = [
    { uc: '325 UC', price: 'RM22' },
    { uc: '660 UC', price: 'RM43' },
    { uc: '1,320 UC', price: 'RM85' },
    { uc: '1,800 UC', price: 'RM103' },
    { uc: '2,125 UC', price: 'RM125' },
    { uc: '2,460 UC', price: 'RM145' },
    { uc: '2,760 UC', price: 'RM166', badge: 'BEST SELLER', highlight: true, demand: 75 },
    { uc: '3,850 UC', price: 'RM200' },
    { uc: '4,510 UC', price: 'RM241' },
    { uc: '5,170 UC', price: 'RM282' },
    { uc: '5,650 UC', price: 'RM300' },
    { uc: '8,100 UC', price: 'RM390' },
    { uc: '8,400 UC', price: 'RM413' },
    { uc: '9,060 UC', price: 'RM454' },
    { uc: '9,900 UC', price: 'RM490' },
    { uc: '10,200 UC', price: 'RM512' },
    { uc: '10,560 UC', price: 'RM531' },
    { uc: '10,860 UC', price: 'RM552' },
    { uc: '11,950 UC', price: 'RM586' },
    { uc: '12,250 UC', price: 'RM608' },
    { uc: '12,910 UC', price: 'RM649' },
    { uc: '13,750 UC', price: 'RM685' },
    { uc: '16,200 UC', price: 'RM777' },
    { uc: '18,000 UC', price: 'RM875' },
    { uc: '20,050 UC', price: 'RM974' },
    { uc: '24,300 UC', price: 'RM1,164' },
    { uc: '32,400 UC', price: 'RM1,549' },
    { uc: '40,500 UC', price: 'RM1,935' },
    { uc: '44,350 UC', price: 'RM2,127' },
    { uc: '48,600 UC', price: 'RM2,316' },
    { uc: '50,400 UC', price: 'RM2,418' },
    { uc: '56,700 UC', price: 'RM2,702' },
    { uc: '60,550 UC', price: 'RM2,899' },
    { uc: '64,800 UC', price: 'RM3,088' },
    { uc: '72,900 UC', price: 'RM3,474' },
    { uc: '81,000 UC', price: 'RM3,850' },
    { uc: '97,200 UC', price: 'RM4,622' },
    { uc: '105,300 UC', price: 'RM5,013' },
];

const mlbbPackages = [
    { diamonds: '70 💎', price: 'RM6' },
    { diamonds: '140 💎', price: 'RM12' },
    { diamonds: '284 💎', price: 'RM23' },
    { diamonds: '355 💎', price: 'RM30' },
    { diamonds: '429 💎', price: 'RM35' },
    { diamonds: '565 💎', price: 'RM45' },
    { diamonds: '639 💎', price: 'RM50' },
    { diamonds: '716 💎', price: 'RM55' },
    { diamonds: '870 💎', price: 'RM65' },
    { diamonds: '1060 💎', price: 'RM75' },
    { diamonds: '1145 💎', price: 'RM80' },
    { diamonds: '1285 💎', price: 'RM90' },
    { diamonds: '1446 💎', price: 'RM100' },
    { diamonds: '1586 💎', price: 'RM110' },
    { diamonds: '1712 💎', price: 'RM115' },
    { diamonds: '2015 💎', price: 'RM145' },
    { diamonds: '2162 💎', price: 'RM155' },
    { diamonds: '2531 💎', price: 'RM180' },
    { diamonds: '2976 💎', price: 'RM200' },
    { diamonds: '3274 💎', price: 'RM215' },
    { diamonds: '3517 💎', price: 'RM230' },
    { diamonds: '4047 💎', price: 'RM260' },
    { diamonds: '4562 💎', price: 'RM300' },
    { diamonds: '5138 💎', price: 'RM335' },
    { diamonds: '5567 💎', price: 'RM360' },
    { diamonds: '6092 💎', price: 'RM390' },
    { diamonds: '6668 💎', price: 'RM430' },
    { diamonds: '4422 💎', price: 'RM310' },
    { diamonds: '7502 💎', price: 'RM490' },
    { diamonds: '8218 💎', price: 'RM515' },
    { diamonds: '9377 💎', price: 'RM600' },
    { diamonds: '10907 💎', price: 'RM690' },
    { diamonds: '12640 💎', price: 'RM810' },
];

const promoPackages = {
    pubg: [
        { title: '1,800 UC', newPrice: 'RM90', oldPrice: 'RM103', badge: 'HOT DEAL' },
        { title: '3,850 UC', newPrice: 'RM170', oldPrice: 'RM200', badge: 'BEST VALUE' },
        { title: '8,100 UC', newPrice: 'RM325', oldPrice: 'RM390', badge: 'MEGA SALE' }
    ],
    mlbb: [
        { title: '1446 💎', newPrice: 'RM88', oldPrice: 'RM100', badge: 'HOT DEAL' },
        { title: '2976 💎', newPrice: 'RM185', oldPrice: 'RM200', badge: 'BEST VALUE' },
        { title: '6092 💎', newPrice: 'RM365', oldPrice: 'RM390', badge: 'MEGA SALE' }
    ]
};

// =================================================================
// 2. CARD GENERATION FUNCTION
// =================================================================

function generatePackageCards(containerId, data, gameType, isPromo = false) {
    const container = document.getElementById(containerId);
    if (!container) return; 
    
    // Add loading state
    container.innerHTML = '<div class="loading-spinner"></div>';
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        let html = '';
        
        data.forEach((pkg, index) => {
            let cardClass = isPromo ? 'card promo-card' : 'card';
            let packageTitle = pkg.uc || pkg.diamonds;
            let packageValue = isPromo ? `${pkg.title}` : packageTitle;
            let price = pkg.price || pkg.newPrice;
            let buttonOrderText = isPromo ? `PROMO ${packageValue}` : packageValue;
            
            if (pkg.highlight) {
                cardClass += ' featured';
            }

            let cardContent = '';

            // Add badge if present
            if (pkg.badge) {
                const badgeClass = isPromo ? 'promo-badge' : (pkg.badge.includes('BEST SELLER') ? 'best-value-badge' : 'promo-badge');
                cardContent += `<div class="${badgeClass} pulse">${pkg.badge}</div>`;
            }

            // Add title
            cardContent += `<h3 class="gradient-text">${packageValue}</h3>`;

            // Add old price for promos
            if (pkg.oldPrice) {
                cardContent += `<div class="old-price">${pkg.oldPrice}</div>`;
            }
            
            // Add highlight text
            if (pkg.highlight && !isPromo) {
                cardContent += `<div style="font-size: 0.9em; color: var(--color-primary-accent); font-weight: 500; margin-bottom: -10px;" class="glow">BEST VALUE</div>`;
            }

            // Add price
            cardContent += `<div class="price gradient-text">${price}</div>`;

            // Add high demand bar
            if (pkg.demand) {
                cardContent += `
                    <div class="high-demand-bar">
                        <p>Selling FAST! Only 12 left this hour.</p>
                        <span class="bar-fill" style="width: ${pkg.demand}%;"></span>
                    </div>`;
            }

            // === MODIFIED BUTTONS ===
            cardContent += `
                <div class="button-group">
                    <button class="buy-btn wallet-btn interactive" onclick="initiateWalletPurchase('${gameType}', '${buttonOrderText}', '${price.replace('RM', '')}', event)">
                        <span style="margin-right: 5px;">💳</span> Pay with Wallet
                    </button>
                    <button class="buy-btn interactive" onclick="initiateWhatsAppOrder('${gameType}', '${buttonOrderText}', '${price}', event)">
                        <span style="margin-right: 5px;">✅</span> Order (WhatsApp)
                    </button>
                </div>`;
            // === END MODIFIED BUTTONS ===

            html += `<div class="${cardClass} fade-in-up" style="animation-delay: ${index * 0.1}s;">${cardContent}</div>`;
        });

        container.innerHTML = html;
        
        // Add intersection observer for scroll animations
        observeCards(container);
    }, 300);
}

// Intersection Observer for scroll animations
function observeCards(container) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px' // Start animation slightly before element is visible
    });

    const cards = container.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Lazy loading for images
function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// =================================================================
// 3. PACKAGE FILTERING LOGIC
// =================================================================

// Debounced search function for better performance
const debouncedFilterPackages = debounce(filterPackages, 300);

function filterPackages() {
    const searchTerm = document.getElementById('package-search').value.toLowerCase().replace(/,/g, '').replace(/💎/g, '').replace(/uc/g, '').trim();
    
    let activeContainerId;
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        activeContainerId = activeSection.id + '-packages';
    } else {
        activeContainerId = 'pubg-packages'; 
    }

    const packageCards = document.getElementById(activeContainerId).querySelectorAll('.card');
    let visibleCount = 0;

    packageCards.forEach(card => {
        const titleElement = card.querySelector('h3');
        if (!titleElement) return;

        const packageTitle = titleElement.textContent.toLowerCase().replace(/,/g, '').replace(/💎/g, '').replace(/uc/g, '').trim();
        
        if (searchTerm === '' || packageTitle.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.opacity = '1';
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });

    // Show "no results" message if needed
    const container = document.getElementById(activeContainerId);
    let noResultsMsg = container.querySelector('.no-results');
    
    if (visibleCount === 0 && searchTerm !== '') {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.innerHTML = '<p>No packages found matching your search.</p>';
            noResultsMsg.style.textAlign = 'center';
            noResultsMsg.style.padding = '2rem';
            noResultsMsg.style.color = 'var(--color-text-muted)';
            container.appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

// =================================================================
// 4. CORE LOGIC (ID, TABS, WHATSAPP, MODAL, TIMER)
// =================================================================

function saveID(game) {
    const inputElement = document.getElementById(`${game}-id`);
    if (inputElement && inputElement.value.trim()) {
        localStorage.setItem(`mastermind_${game}_id`, inputElement.value.trim());
    }
}

function loadID() {
    const pubgID = localStorage.getItem('mastermind_pubg_id');
    const mlbbID = localStorage.getItem('mastermind_mlbb_id');
    
    if (pubgID) {
        document.getElementById('pubg-id').value = pubgID;
    }
    if (mlbbID) {
        document.getElementById('mlbb-id').value = mlbbID;
    }
}

function showTab(tabName, clickedButton) {
    document.getElementById('package-search').value = '';
    
    var sections = document.querySelectorAll('.section');
    sections.forEach(s => s.classList.remove('active'));
    
    const targetSection = document.getElementById(tabName);
    if (targetSection) {
        targetSection.classList.add('active');
    } else {
        document.getElementById('pubg').classList.add('active');
    }

    var buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(b => b.classList.add('inactive'));
    
    if (clickedButton) {
        clickedButton.classList.remove('inactive');
    } else {
        const tabButtonSelector = `.tabs button[onclick*="'${tabName}'"]`;
        const activeBtn = document.querySelector(tabButtonSelector);
        if (activeBtn) {
            activeBtn.classList.remove('inactive');
        }
    }

    document.getElementById('pubg-input-group').style.display = 'none';
    document.getElementById('mlbb-input-group').style.display = 'none';

    if (tabName.includes('pubg')) {
        document.getElementById('pubg-input-group').style.display = 'block';
        document.getElementById('pubg-id').focus();
    } else if (tabName.includes('mlbb')) {
        document.getElementById('mlbb-input-group').style.display = 'block';
        document.getElementById('mlbb-id').focus();
    }
    
    filterPackages(); 
}

function initiateWhatsAppOrder(game, packageValue, price, event) {
    let id, message, idInput;
    
    if (game.includes('pubg')) {
        idInput = document.getElementById('pubg-id');
    } else if (game.includes('mlbb')) {
        idInput = document.getElementById('mlbb-id');
    }

    id = idInput ? idInput.value.trim() : '';

    if (!id) {
        alert(ID_ALERT_MESSAGE);
        
        if (idInput) {
            idInput.style.borderColor = '#ff6b6b'; 
            setTimeout(() => {
                idInput.style.borderColor = '#334155'; 
            }, 800);
            idInput.focus();
        }
        return;
    }
    
    // Validation Logic
    if (game.includes('pubg')) {
        if (!/^\d{9,11}$/.test(id) || id.length > 11) {
            alert("Please enter a valid PUBG Player ID (usually 9 to 11 digits, numbers only). Check the ID Guide.");
            idInput.focus();
            idInput.style.borderColor = '#ff6b6b'; 
            setTimeout(() => { idInput.style.borderColor = '#334155'; }, 800);
            return;
        }
    }
    if (game.includes('mlbb')) {
        if (!/^\d+\s*\(\s*\d+\s*\)$/.test(id)) {
            alert("Please enter your MLBB ID in the correct format: ID(ZONE). Example: 12345678(1234). Check the ID Guide.");
            idInput.focus();
            idInput.style.borderColor = '#ff6b6b'; 
            setTimeout(() => { idInput.style.borderColor = '#334155'; }, 800);
            return;
        }
    }

    saveID(game.includes('pubg') ? 'pubg' : 'mlbb');

    const gameName = game.includes('pubg') ? 'PUBG Player ID' : 'MLBB ID';
    message = `Hi! I'd like to purchase ${packageValue} (${price}). My ${gameName} is: ${id}. Please confirm and send the payment details.`;

    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // Add loading state to button with modern animation
    const clickedButton = event.target.closest('.buy-btn');
    if (clickedButton) {
        const originalText = clickedButton.innerHTML;
        clickedButton.innerHTML = '<span class="loading-spinner" style="margin-right: 8px;"></span> Processing...';
        clickedButton.disabled = true;
        clickedButton.classList.add('shimmer');
        
        // Add success animation after processing
        setTimeout(() => {
            clickedButton.innerHTML = '<span style="margin-right: 5px;">✅</span> Redirecting...';
            clickedButton.classList.remove('shimmer');
            clickedButton.classList.add('bounce');
        }, 1500);
        
        setTimeout(() => {
            clickedButton.innerHTML = originalText;
            clickedButton.disabled = false;
            clickedButton.classList.remove('bounce');
        }, 3000);
    }
    
    try {
        // Track conversion event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase_intent', {
                'event_category': 'ecommerce',
                'event_label': `${game}_${packageValue}`,
                'value': parseFloat(price.replace('RM', ''))
            });
        }
        
        window.open(whatsappLink, '_blank');
    } catch (error) {
        alert('Unable to open WhatsApp. Please copy this message and send it manually: ' + message);
        navigator.clipboard.writeText(message).catch(() => {
            console.log('Clipboard access denied');
        });
    }
}

// =================================================================
// 5. NEW WALLET PURCHASE LOGIC
// =================================================================

async function initiateWalletPurchase(game, packageValue, price, event) {
  const clickedButton = event.target.closest('.buy-btn');
  
  // 1. Check if logged in
  const userPhone = localStorage.getItem('mastermind_user_phone');
  if (!userPhone) {
    alert("You must be logged in to pay with your wallet.\n\nPlease go to the 'My Account' page to log in first.");
    window.location.href = 'account.html'; // Redirect to login page
    return;
  }
  
  // 2. Get and validate Game ID
  let id, idInput;
  const gameType = game.includes('pubg') ? 'pubg' : 'mlbb';
  idInput = document.getElementById(`${gameType}-id`);
  id = idInput ? idInput.value.trim() : '';

  if (!id) {
    alert(ID_ALERT_MESSAGE);
    idInput.focus();
    return;
  }
  
  // (Your existing validation logic from WhatsApp function)
  if (game.includes('pubg')) {
    if (!/^\d{9,11}$/.test(id) || id.length > 11) {
        alert("Please enter a valid PUBG Player ID (usually 9 to 11 digits, numbers only). Check the ID Guide.");
        idInput.focus();
        return;
    }
  }
  if (game.includes('mlbb')) {
      if (!/^\d+\s*\(\s*\d+\s*\)$/.test(id)) {
          alert("Please enter your MLBB ID in the correct format: ID(ZONE). Example: 12345678(1234). Check the ID Guide.");
          idInput.focus();
          return;
      }
  }

  // 3. Confirm Purchase
  const priceNum = parseFloat(price);
  if (confirm(`Are you sure you want to buy ${packageValue} for RM ${priceNum.toFixed(2)} using your wallet?\n\nYour Game ID: ${id}`)) {
    
    // 4. Show loading state
    const originalText = clickedButton.innerHTML;
    clickedButton.innerHTML = '<span style="margin-right: 5px;">⏳</span> Processing...';
    clickedButton.disabled = true;

    try {
      // 5. Call the API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "makeWalletPurchase",
          phone: userPhone,
          game: gameType,
          gameID: id,
          packageName: packageValue,
          price: priceNum
        })
      });
      
      const result = await response.json();

      if (result.status === "error") {
        throw new Error(result.message);
      }

      // 6. Handle Success
      alert(`✅ Purchase Successful!\n\n${packageValue} will be sent to ${id} shortly.\nYour new balance is RM ${result.newBalance.toFixed(2)}.`);
      // Track conversion
      if (typeof gtag !== 'undefined') {
          gtag('event', 'purchase_wallet', { 'value': priceNum });
      }

    } catch (error) {
      // 7. Handle Error
      alert(`Purchase Failed:\n${error.message}\n\nPlease check your balance or use the WhatsApp order method.`);
    } finally {
      // 8. Restore button
      clickedButton.innerHTML = originalText;
      clickedButton.disabled = false;
    }
  }
}


// =================================================================
// 6. ORIGINAL CORE FUNCTIONS (Modal, FAQ, Timer, Load)
// =================================================================

function showIDGuide(game) {
    const modal = document.getElementById('id-guide-modal');
    const title = document.getElementById('guide-title');
    const description = document.getElementById('guide-description');
    const image = document.getElementById('guide-image');

    if (game === 'pubg') {
        title.textContent = "How to Find Your PUBG Player ID";
        description.innerHTML = "Your **PUBG Player ID** is a 9-10 digit number found directly under your in-game name in the lobby screen. **Tap your avatar** to view your Profile where it is clearly displayed. *Example path: <span style='font-weight: 700; color: var(--color-success);'>Lobby > Avatar/Profile > ID</span>*";
        image.src = "https://i.imgur.com/w8NIIv6.png"; // Placeholder
    } else if (game === 'mlbb') {
        title.textContent = "How to Find Your Mobile Legends ID & Zone";
        description.innerHTML = "Your **MLBB ID** is the first set of numbers, and the **Zone ID** is the number in parentheses (e.g., 36274747(7729)). Both are located at the bottom-right of your profile photo in the lobby. **Please copy the entire number, including the parentheses.** *Example path: <span style='font-weight: 700; color: var(--color-success);'>Lobby > Profile > ID(Zone)</span>*";
        image.src = "https://i.imgur.com/b9sYxM8.png"; // Placeholder
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function closeIDGuide(event) {
    if (event && event.target.id !== 'id-guide-modal' && event.target.className !== 'close-btn' && event.target.closest('.modal-content')) {
        return;
    }
    document.getElementById('id-guide-modal').style.display = 'none';
    document.body.style.overflow = 'auto'; 
}

function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const toggle = element.querySelector('.faq-toggle');
    
    // Close all other FAQs
    document.querySelectorAll('.faq-answer.active').forEach(item => {
        if (item !== answer) {
            item.classList.remove('active');
            item.previousElementSibling.classList.remove('active');
        }
    });
    
    // Toggle current FAQ
    answer.classList.toggle('active');
    element.classList.toggle('active');
}

function updateTimer() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0); 
    const timeRemaining = tomorrow - now;

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    const timerDisplay = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (document.getElementById('pubg-timer')) {
        document.getElementById('pubg-timer').textContent = timerDisplay;
    }
    if (document.getElementById('mlbb-timer')) {
        document.getElementById('mlbb-timer').textContent = timerDisplay;
    }

    if (timeRemaining < 0) {
        clearInterval(timerInterval);
        location.reload();
    }
}

let timerInterval;

// Theme management
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const savedTheme = localStorage.getItem('mastermind_theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        localStorage.setItem('mastermind_theme', newTheme);
        
        // Add transition effect
        document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

// Service Worker Registration
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// Advanced Analytics and User Tracking
function initAnalytics() {
    // Track user interactions
    const trackEvent = (eventName, properties = {}) => {
        // Google Analytics 4 event tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'user_interaction',
                event_label: properties.label || '',
                value: properties.value || 0,
                ...properties
            });
        }
        
        // Custom analytics (you can send to your own analytics service)
        console.log('Analytics Event:', eventName, properties);
    };

    // Track page views
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });

    // Track button clicks
    document.addEventListener('click', (e) => {
        if (e.target.matches('.buy-btn')) {
            const gameType = e.target.onclick.toString().includes('pubg') ? 'pubg' : 'mlbb';
            trackEvent('purchase_button_click', {
                game_type: gameType,
                button_type: e.target.classList.contains('wallet-btn') ? 'wallet' : 'whatsapp'
            });
        }
        
        if (e.target.matches('.tab-btn')) {
            const tabName = e.target.textContent.trim();
            trackEvent('tab_switch', {
                tab_name: tabName
            });
        }
    });

    // Track search queries
    const searchInput = document.getElementById('package-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            if (e.target.value.length > 2) {
                trackEvent('search_query', {
                    search_term: e.target.value,
                    search_length: e.target.value.length
                });
            }
        }, 1000));
    }

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = throttle(() => {
        const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            if (maxScrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                trackEvent('scroll_depth', {
                    depth_percentage: maxScrollDepth
                });
            }
        }
    }, 1000);

    window.addEventListener('scroll', trackScrollDepth);

    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', {
            seconds: timeOnPage
        });
    });

    // Track form interactions
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', () => {
            trackEvent('form_field_focus', {
                field_name: input.id || input.name || 'unknown'
            });
        });
    });
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
        // This would integrate with actual web vitals library
        console.log('Performance monitoring initialized');
    }
    
    // Monitor page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Track performance metrics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                event_category: 'performance',
                value: Math.round(loadTime)
            });
        }
    });

    // Monitor Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.log('LCP monitoring not supported');
        }
    }
}

// Add smooth scroll behavior
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add keyboard navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC key to close modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal-overlay');
            modals.forEach(modal => {
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
        
        // Tab navigation for cards
        if (e.key === 'Tab') {
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.style.outline = 'none';
            });
        }
    });
}

window.onload = function() {
    // Initialize modern features
    initTheme();
    initServiceWorker();
    initAnalytics();
    initPerformanceMonitoring();
    initSmoothScroll();
    initKeyboardNavigation();
    initLazyLoading();
    
    // Lazy load packages for better performance
    generatePackageCards('pubg-packages', pubgPackages, 'pubg');
    
    // Load other packages after a short delay
    setTimeout(() => {
        generatePackageCards('mlbb-packages', mlbbPackages, 'mlbb');
        generatePackageCards('pubg-promo-packages', promoPackages.pubg, 'pubg', true);
        generatePackageCards('mlbb-promo-packages', promoPackages.mlbb, 'mlbb', true);
    }, 100);

    loadID(); 
    
    const hash = window.location.hash.substring(1);
    const defaultTab = 'pubg';
    const targetTab = hash && document.getElementById(hash) ? hash : defaultTab;
    
    const tabButton = document.querySelector(`.tabs button[onclick*="'${targetTab}'"]`);
    showTab(targetTab, tabButton);

    if (tabButton) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.add('inactive'));
        tabButton.classList.remove('inactive');
    }
    
    updateTimer(); 
    timerInterval = setInterval(updateTimer, 1000);
    
    // Add page transition effects
    document.body.classList.add('fade-in-up');
}
