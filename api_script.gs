// =================================================================
// MASTERMIND ESPORTS - DYNAMIC PACKAGE API SCRIPT
// =================================================================
// INSTRUCTIONS:
// 1. In your Google Apps Script project, open your main `Code.gs` file.
// 2. COPY the entire contents of THIS file.
// 3. PASTE it at the VERY TOP of your `Code.gs` file, before your existing `doPost` function.
// 4. Click "Deploy" -> "New deployment".
// 5. For "Type", select "Web app".
// 6. Under "Who has access", make sure it is set to "Anyone".
// 7. Click "Deploy".
// =================================================================

// This function runs whenever someone accesses your script's URL.
function doGet(e) {

  // All your package data is stored here.
  // To update your website, you only need to edit the data below!
  const allPackages = {
    "pubgPackages": [
      { "uc": "325 UC", "price": "RM22" },
      { "uc": "660 UC", "price": "RM43" },
      { "uc": "1,320 UC", "price": "RM85" },
      { "uc": "1,800 UC", "price": "RM103" },
      { "uc": "2,125 UC", "price": "RM125" },
      { "uc": "2,460 UC", "price": "RM145" },
      { "uc": "2,760 UC", "price": "RM166", "badge": "BEST SELLER", "highlight": true, "demand": 75 },
      { "uc": "3,850 UC", "price": "RM200" },
      { "uc": "4,510 UC", "price": "RM241" },
      { "uc": "5,170 UC", "price": "RM282" },
      { "uc": "5,650 UC", "price": "RM300" },
      { "uc": "8,100 UC", "price": "RM390" },
      { "uc": "8,400 UC", "price": "RM413" },
      { "uc": "9,060 UC", "price": "RM454" },
      { "uc": "9,900 UC", "price": "RM490" },
      { "uc": "10,200 UC", "price": "RM512" },
      { "uc": "10,560 UC", "price": "RM531" },
      { "uc": "10,860 UC", "price": "RM552" },
      { "uc": "11,950 UC", "price": "RM586" },
      { "uc": "12,250 UC", "price": "RM608" },
      { "uc": "12,910 UC", "price": "RM649" },
      { "uc": "13,750 UC", "price": "RM685" },
      { "uc": "16,200 UC", "price": "RM777" },
      { "uc": "18,000 UC", "price": "RM875" },
      { "uc": "20,050 UC", "price": "RM974" },
      { "uc": "24,300 UC", "price": "RM1,164" },
      { "uc": "32,400 UC", "price": "RM1,549" },
      { "uc": "40,500 UC", "price": "RM1,935" },
      { "uc": "44,350 UC", "price": "RM2,127" },
      { "uc": "48,600 UC", "price": "RM2,316" },
      { "uc": "50,400 UC", "price": "RM2,418" },
      { "uc": "56,700 UC", "price": "RM2,702" },
      { "uc": "60,550 UC", "price": "RM2,899" },
      { "uc": "64,800 UC", "price": "RM3,088" },
      { "uc": "72,900 UC", "price": "RM3,474" },
      { "uc": "81,000 UC", "price": "RM3,850" },
      { "uc": "97,200 UC", "price": "RM4,622" },
      { "uc": "105,300 UC", "price": "RM5,013" }
    ],
    "mlbbPackages": [
      { "diamonds": "70 💎", "price": "RM6" },
      { "diamonds": "140 💎", "price": "RM12" },
      { "diamonds": "284 💎", "price": "RM23" },
      { "diamonds": "355 💎", "price": "RM30" },
      { "diamonds": "429 💎", "price": "RM35" },
      { "diamonds": "565 💎", "price": "RM45" },
      { "diamonds": "639 💎", "price": "RM50" },
      { "diamonds": "716 💎", "price": "RM55" },
      { "diamonds": "870 💎", "price": "RM65" },
      { "diamonds": "1060 💎", "price": "RM75" },
      { "diamonds": "1145 💎", "price": "RM80" },
      { "diamonds": "1285 💎", "price": "RM90" },
      { "diamonds": "1446 💎", "price": "RM100" },
      { "diamonds": "1586 💎", "price": "RM110" },
      { "diamonds": "1712 💎", "price": "RM115" },
      { "diamonds": "2015 💎", "price": "RM145" },
      { "diamonds": "2162 💎", "price": "RM155" },
      { "diamonds": "2531 💎", "price": "RM180" },
      { "diamonds": "2976 💎", "price": "RM200" },
      { "diamonds": "3274 💎", "price": "RM215" },
      { "diamonds": "3517 💎", "price": "RM230" },
      { "diamonds": "4047 💎", "price": "RM260" },
      { "diamonds": "4562 💎", "price": "RM300" },
      { "diamonds": "5138 💎", "price": "RM335" },
      { "diamonds": "5567 💎", "price": "RM360" },
      { "diamonds": "6092 💎", "price": "RM390" },
      { "diamonds": "6668 💎", "price": "RM430" },
      { "diamonds": "4422 💎", "price": "RM310" },
      { "diamonds": "7502 💎", "price": "RM490" },
      { "diamonds": "8218 💎", "price": "RM515" },
      { "diamonds": "9377 💎", "price": "RM600" },
      { "diamonds": "10907 💎", "price": "RM690" },
      { "diamonds": "12640 💎", "price": "RM810" }
    ],
    "promoPackages": {
      "pubg": [
        { "title": "1,800 UC", "newPrice": "RM90", "oldPrice": "RM103", "badge": "HOT DEAL" },
        { "title": "3,850 UC", "newPrice": "RM170", "oldPrice": "RM200", "badge": "BEST VALUE" },
        { "title": "8,100 UC", "newPrice": "RM325", "oldPrice": "RM390", "badge": "MEGA SALE" }
      ],
      "mlbb": [
        { "title": "1446 💎", "newPrice": "RM88", "oldPrice": "RM100", "badge": "HOT DEAL" },
        { "title": "2976 💎", "newPrice": "RM185", "oldPrice": "RM200", "badge": "BEST VALUE" },
        { "title": "6092 💎", "newPrice": "RM365", "oldPrice": "RM390", "badge": "MEGA SALE" }
      ]
    }
  };

  // This converts the data to a string and returns it.
  return ContentService
    .createTextOutput(JSON.stringify(allPackages))
    .setMimeType(ContentService.MimeType.JSON);
}
