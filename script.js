const API_URL = "https://script.google.com/macros/s/AKfycbyYWzmHkjJHZPh-d1Wq2gO2mpzJ-QjNL7_M47BUZ7B00GLhDnPDHdkz1BA6aUQenECE/exec";

const WHATSAPP_NUMBER = '60147433177';
const ID_ALERT_MESSAGE = "Please enter your Player ID before clicking 'Order Instantly'.";

// The package data is now loaded dynamically from the API.

// =================================================================
// 2. CARD GENERATION FUNCTION
// =================================================================

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

        // === MODIFIED BUTTONS ===
        cardContent += `
            <div class="button-group">
                <button class="buy-btn wallet-btn" onclick="initiateWalletPurchase('${gameType}', '${buttonOrderText}', '${price.replace('RM', '')}', event)">
                    <span style="margin-right: 5px;">💳</span> Pay with Wallet
                </button>
                <button class="buy-btn" onclick="initiateWhatsAppOrder('${gameType}', '${buttonOrderText}', '${price}', event)">
                    <span style="margin-right: 5px;">✅</span> Order (WhatsApp)
                </button>
            </div>`;
        // === END MODIFIED BUTTONS ===

        html += `<div class="${cardClass}">${cardContent}</div>`;
    });

    container.innerHTML = html;
}

// =================================================================
// 3. PACKAGE FILTERING LOGIC
// =================================================================

function filterPackages() {
    const searchTerm = document.getElementById('package-search').value.toLowerCase().replace(/,/g, '').trim();
    
    let activeContainerId;
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        activeContainerId = activeSection.id + '-packages';
    } else {
        activeContainerId = 'pubg-packages'; 
    }

    const packageCards = document.getElementById(activeContainerId).querySelectorAll('.card');

    packageCards.forEach(card => {
        const titleElement = card.querySelector('h3');
        if (!titleElement) return;

        const packageTitle = titleElement.textContent.toLowerCase().replace(/,/g, '').trim();
        
        if (searchTerm === '' || packageTitle.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
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
    
    // Add loading state to button
    const clickedButton = event.target.closest('.buy-btn');
    if (clickedButton) {
        const originalText = clickedButton.innerHTML;
        clickedButton.innerHTML = '<span style="margin-right: 5px;">⏳</span> Opening WhatsApp...';
        clickedButton.disabled = true;
        
        setTimeout(() => {
            clickedButton.innerHTML = originalText;
            clickedButton.disabled = false;
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

async function loadAllPackages() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Generate cards with the fetched data
        generatePackageCards('pubg-packages', data.pubgPackages, 'pubg');
        generatePackageCards('mlbb-packages', data.mlbbPackages, 'mlbb');
        generatePackageCards('pubg-promo-packages', data.promoPackages.pubg, 'pubg', true);
        generatePackageCards('mlbb-promo-packages', data.promoPackages.mlbb, 'mlbb', true);

    } catch (error) {
        console.error("Failed to load package data:", error);
        // You could display an error message to the user here
        const packageContainers = document.querySelectorAll('.packages');
        packageContainers.forEach(container => {
            container.innerHTML = `<p style="color: var(--color-secondary-accent); text-align: center;">Failed to load packages. Please try refreshing the page.</p>`;
        });
    }
}

window.onload = function() {
    // Load all data from the API
    loadAllPackages();

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
