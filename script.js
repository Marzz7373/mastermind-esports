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
    { uc: '2,760 UC', price: 'RM166', badge: 'BEST SELLER', highlight: true, demand: 75 }, // Highlighted card
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

/**
 * Generates and injects the package card HTML into the specified container.
 */
function generatePackageCards(containerId, data, gameType, isPromo = false) {
    const container = document.getElementById(containerId);
    if (!container) return; 
    
    let html = '';
    
    data.forEach(pkg => {
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
            cardContent += `<div class="${badgeClass}">${pkg.badge}</div>`;
        }

        // Add title
        cardContent += `<h3>${packageValue}</h3>`;

        // Add old price for promos
        if (pkg.oldPrice) {
            cardContent += `<div class="old-price">${pkg.oldPrice}</div>`;
        }
        
        // Add highlight text
        if (pkg.highlight && !isPromo) {
            cardContent += `<div style="font-size: 0.9em; color: var(--color-primary-accent); font-weight: 500; margin-bottom: -10px;">BEST VALUE</div>`;
        }

        // Add price
        cardContent += `<div class="price">${price}</div>`;

        // Add high demand bar
        if (pkg.demand) {
            cardContent += `
                <div class="high-demand-bar">
                    <p>Selling FAST! Only 12 left this hour.</p>
                    <span class="bar-fill" style="width: ${pkg.demand}%;"></span>
                </div>`;
        }

        // Add button
        cardContent += `
            <button class="buy-btn" onclick="initiateWhatsAppOrder('${gameType}', '${buttonOrderText}', '${price}')">
                <span style="margin-right: 5px;">✅</span> Order Instantly
            </button>`;

        html += `<div class="${cardClass}">${cardContent}</div>`;
    });

    container.innerHTML = html;
}


// =================================================================
// 3. PACKAGE FILTERING LOGIC
// =================================================================

/**
 * Filters the visible package cards based on the text entered in the search box.
 */
function filterPackages() {
    // 1. Get the current search term, convert to lowercase, and remove commas
    const searchTerm = document.getElementById('package-search').value.toLowerCase().replace(/,/g, '').replace(/💎/g, '').replace(/uc/g, '').trim();
    
    // 2. Determine which game/tab is currently active
    let activeContainerId;
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        activeContainerId = activeSection.id + '-packages';
    } else {
        // Fallback to pubg if no section is explicitly active (shouldn't happen)
        activeContainerId = 'pubg-packages'; 
    }

    const packageCards = document.getElementById(activeContainerId).querySelectorAll('.card');

    // 3. Loop through all cards in the active section and filter
    packageCards.forEach(card => {
        // Get the title text (e.g., '2,760 UC' or '1446 💎')
        const titleElement = card.querySelector('h3');
        if (!titleElement) return;

        // Clean the package title for better matching (remove text, keep numbers)
        const packageTitle = titleElement.textContent.toLowerCase().replace(/,/g, '').replace(/💎/g, '').replace(/uc/g, '').trim();
        
        // If search is empty, show all. Otherwise, check if package title includes the search term
        if (searchTerm === '' || packageTitle.includes(searchTerm)) {
            card.style.display = 'block'; // Show the card
        } else {
            card.style.display = 'none'; // Hide the card
        }
    });
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
  // NEW: Clear the search term when switching tabs
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
  
  // NEW: Re-run the filter logic to display all packages in the new tab
  filterPackages(); 
}

function initiateWhatsAppOrder(game, packageValue, price) {
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
  window.open(whatsappLink, '_blank');
}

function showIDGuide(game) {
    const modal = document.getElementById('id-guide-modal');
    const title = document.getElementById('guide-title');
    const description = document.getElementById('guide-description');
    const image = document.getElementById('guide-image');

    if (game === 'pubg') {
        title.textContent = "How to Find Your PUBG Player ID";
        description.innerHTML = "Your **PUBG Player ID** is a 9-10 digit number found directly under your in-game name in the lobby screen. **Tap your avatar** to view your Profile where it is clearly displayed. *Example path: <span style='font-weight: 700; color: var(--color-success);'>Lobby > Avatar/Profile > ID</span>*";
        // *** REPLACE WITH YOUR HOSTED PUBG ID GUIDE IMAGE URL ***
        image.src = "REPLACE_WITH_YOUR_PUBG_ID_GUIDE_IMAGE_URL"; 
    } else if (game === 'mlbb') {
        title.textContent = "How to Find Your Mobile Legends ID & Zone";
        description.innerHTML = "Your **MLBB ID** is the first set of numbers, and the **Zone ID** is the number in parentheses (e.g., 36274747(7729)). Both are located at the bottom-right of your profile photo in the lobby. **Please copy the entire number, including the parentheses.** *Example path: <span style='font-weight: 700; color: var(--color-success);'>Lobby > Profile > ID(Zone)</span>*";
        // *** REPLACE WITH YOUR HOSTED MLBB ID GUIDE IMAGE URL ***
        image.src = "REPLACE_WITH_YOUR_MLBB_ID_GUIDE_IMAGE_URL";
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

function updateTimer() {
    const now = new Date();
    // Set timer to reset every midnight (24 hours from now)
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
window.onload = function() {
    // 5. CALL THE GENERATION FUNCTIONS ON LOAD
    generatePackageCards('pubg-packages', pubgPackages, 'pubg');
    generatePackageCards('mlbb-packages', mlbbPackages, 'mlbb');
    generatePackageCards('pubg-promo-packages', promoPackages.pubg, 'pubg', true);
    generatePackageCards('mlbb-promo-packages', promoPackages.mlbb, 'mlbb', true);

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
}
