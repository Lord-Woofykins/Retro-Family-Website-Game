// Setup Variables
// Window Location Variable
let previousLocation = sessionStorage.getItem("previousLocation") || "StartPage.html";

// Financial Variables
// Starting Finance Variables
const startingBalance = 1000;
const startingLoan = 5000;
const startingCash = 700;

// Saved between webpages
let balanceVar = Number(sessionStorage.getItem("balanceVar")) || startingBalance; 
// When loading the page, the variable attempts to pull a preexisting value but if this is unavailable it defaults to whatever is after '||'
let loanVar = Number(sessionStorage.getItem("loanVar")) || startingLoan;
let cashVar = Number(sessionStorage.getItem("cashVar")) || startingCash;

// These variables are used for calculating loan deposits and withdrawals as well as the maximum loan
let withdrawVar = 0;
let depositVar = 0;
const loanMax = 10000;

let transferState = "withdraw";

// These are the dayphase and soulstate variables
let dayPhase = sessionStorage.getItem("dayPhase") || "morning";
let soulState = sessionStorage.getItem("soulState") || "child";

// Store Variables

const priceVariation = 150;

let pricesGenerated = sessionStorage.getItem("pricesGenerated") || false;

let trinitonPrice = sessionStorage.getItem("trinitonPrice") || 400;
let SNESPrice = sessionStorage.getItem("SNESPrice") || 400;
let PlaystationPrice = sessionStorage.getItem("PlaystationPrice") || 400;
let XboxPrice = sessionStorage.getItem("XboxPrice") || 400;
let GameBoyPrice = sessionStorage.getItem("GameBoyPrice") || 400;
let NokiaPrice = sessionStorage.getItem("NokiaPrice") || 400;
let DVDPrice = sessionStorage.getItem("DVDPrice") || 400;
let IpodPrice = sessionStorage.getItem("IpodPrice") || 400;

let trinitonQuantity = sessionStorage.getItem("trinitonQuantity") || 0;
let SNESQuantity = sessionStorage.getItem("SNESQuantity") || 0;
let PlaystationQuantity = sessionStorage.getItem("PlaystationQuantity") || 0;
let XboxQuantity = sessionStorage.getItem("XboxQuantity") || 0;
let GameBoyQuantity = sessionStorage.getItem("GameBoyQuantity") || 0;
let NokiaQuantity = sessionStorage.getItem("NokiaQuantity") || 0;
let DVDQuantity = sessionStorage.getItem("DVDQuantity") || 0;
let IpodQuantity = sessionStorage.getItem("IpodQuantity") || 0;

// Session Storage Updater Functions
// Updates dashboard related values (prices generated is exception)
function updateSessionStorage() {
    sessionStorage.setItem("balanceVar", balanceVar);
    sessionStorage.setItem("loanVar", loanVar);
    sessionStorage.setItem("cashVar", cashVar);
    sessionStorage.setItem("soulState", soulState);
    sessionStorage.setItem("dayPhase", dayPhase);
    sessionStorage.setItem("pricesGenerated", pricesGenerated);
}
// Updates the store related values
function updateShopSessionStorage() {
    // Setting Item Prices
    sessionStorage.setItem("trinitonPrice", trinitonPrice);
    sessionStorage.setItem("SNESPrice", SNESPrice);
    sessionStorage.setItem("PlaystationPrice", PlaystationPrice);
    sessionStorage.setItem("XboxPrice", XboxPrice);
    sessionStorage.setItem("GameBoyPrice", GameBoyPrice);
    sessionStorage.setItem("NokiaPrice", NokiaPrice);
    sessionStorage.setItem("DVDPrice", DVDPrice);
    sessionStorage.setItem("IpodPrice", IpodPrice);

    // Setting Item Quantities
    sessionStorage.setItem("trinitonQuantity", trinitonQuantity);
    sessionStorage.setItem("SNESQuantity", SNESQuantity);
    sessionStorage.setItem("PlaystationQuantity", PlaystationQuantity);
    sessionStorage.setItem("XboxQuantity", XboxQuantity);
    sessionStorage.setItem("GameBoyQuantity", GameBoyQuantity);
    sessionStorage.setItem("NokiaQuantity", NokiaQuantity);
    sessionStorage.setItem("DVDQuantity", DVDQuantity);
    sessionStorage.setItem("IpodQuantity", IpodQuantity);
}

// Initial Setup Functions

// Variable Reset Function (For debugging)
function resetVariables() {
    sessionStorage.clear(); // Clears anything preexisting

    // This block resets the dashboard related variables
    balanceVar = startingBalance;
    loanVar = startingLoan;
    cashVar = startingCash;
    soulState = "child";
    dayPhase = "morning";
    balance.textContent = balanceVar;
    loan.textContent = loanVar;
    cash.textContent = cashVar;
    updateSessionStorage(); // Stores these changes

    // These reset the store relatd values

    // Resets the prices
    trinitonPrice = 0;
    SNESPrice = 0;
    PlaystationPrice = 0;
    XboxPrice = 0;
    GameBoyPrice = 0;
    NokiaPrice = 0;
    DVDPrice = 0;
    IpodPrice = 0;

    // Resets the quanitities
    trinitonQuantity = 0;
    SNESQuantity = 0;
    PlaystationQuantity = 0;
    XboxQuantity = 0;
    GameBoyQuantity = 0;
    NokiaQuantity = 0;
    DVDQuantity = 0;
    IpodQuantity = 0;

    updateShopSessionStorage(); // Stores the changes
}
// Cycles the day Phase (orginally for debugging)
function changeTOD() {
    if (dayPhase == "morning") {
        dayPhase = "lunchtime";
    } 
    else if (dayPhase == "lunchtime") {
        dayPhase = "afternoon";
    } 
    else if (dayPhase == "afternoon") {
        dayPhase = "morning";
        pricesGenerated = false;
        applyInterest();
    }

    updateSessionStorage();
    timeUpdate();
}




// Updates and sets up the dashboard
function openDashboard() {
    startWindow.classList.add('hidden');
    win95Window.classList.remove('hidden');
    // Depending on if the soulstate is father or child this changes (financials)
    if (soulState == "child") {
        controlledByFather.classList.add('unavailable');
        bankDeposit.disabled = true;
        bankWithdraw.disabled = true;
        loanIncrease.disabled = true;
        loanDecrease.disabled = true;
    }
    else if (soulState == "father") {
        controlledByFather.classList.remove('unavailable');
        bankDeposit.disabled = false;
        bankWithdraw.disabled = false;
        loanIncrease.disabled = false;
        loanDecrease.disabled = false;
    }
    updateSessionStorage();
    timeUpdate();
    // Updates the UI values
    balance.textContent = balanceVar;
    loan.textContent = loanVar;
    cash.textContent = cashVar;
}
// This function is used to determine whether the father state is accessible
function checkDayPhase() {
    if (dayPhase == "morning" || dayPhase == "lunchtime") {
        father.classList.add('disable');
        father.disabled = true;
        father.innerHTML = "Father is at work <br> right now";
        soulState = "child";
        disableFatherControls();
    }
    else if (dayPhase == "afternoon") {
        father.classList.remove('disable');
        father.disabled = false;
        father.innerHTML = "Transfer soul <br> to father"
    }
    updateSessionStorage();
}

// Disables Father Controls
function disableFatherControls() {
    controlledByFather.classList.add('unavailable');
    bankDeposit.disabled = true;
    bankWithdraw.disabled = true;
    loanIncrease.disabled = true;
    loanDecrease.disabled = true;
    child.classList.add('selected');
    father.classList.remove('selected');
    soulState = "child";
    updateSessionStorage();
}

// Enables Father Controls
function enableFatherControls() {
    controlledByFather.classList.remove('unavailable');
    bankDeposit.disabled = false;
    bankWithdraw.disabled = false;
    loanIncrease.disabled = false;
    loanDecrease.disabled = false;
    child.classList.remove('selected');
    father.classList.add('selected');
    soulState = "father";
    updateSessionStorage();
}


// Updates the display elements
balance.textContent = balanceVar;
cash.textContent = cashVar;
// UI updaters
// Day phase display updater
function timeUpdate() {
    if (dayPhase == "morning") {
        circle3.classList.remove('fa-moon');
        circle3.classList.add('circle');
        circle1.classList.remove('circle');
        circle1.classList.add('fa-sun');

    } 
    else if (dayPhase == "lunchtime") {
        circle1.classList.remove('fa-sun');
        circle1.classList.add('circle');
        circle2.classList.remove('circle');
        circle2.classList.add('fa-sun');
    } 
    else if (dayPhase == "afternoon") {
        circle2.classList.remove('fa-sun');
        circle2.classList.add('circle');
        circle3.classList.remove('circle');
        circle3.classList.add('fa-moon');
    }
    checkDayPhase();
}

// Financial Functions
// Loan functions
function loanAdd() {
    // Only works if the current loan is below max
    if (loanVar < loanMax) {
        loanVar = loanVar + 250;
        balanceVar = balanceVar + 250;
        loanDecrease.classList.remove('disable');
        if (loanVar >= loanMax) {
            loanIncrease.classList.add('disable');
        }
    }
    // Updates UI Elements
    balance.textContent = balanceVar;
    loan.textContent = loanVar;
    updateSessionStorage();
}

// Loan payback function
// * REFERENCE FLOWCHART * //
function loanPayback() {
    // Checking if there is a loan
    if (loanVar > 0) {
        // Checking how high the loan is
        if (loanVar >= 250) {
            // Checking if and how much of the loan can be paid
            if (balanceVar >= 250) {
                balanceVar = balanceVar - 250;
                loanVar = loanVar - 250;
                balance.textContent = balanceVar;
                loan.textContent = loanVar;
            }
            else if (balanceVar > 0) {
                loanVar = loanVar - balanceVar;
                balanceVar = 0;
                balance.textContent = balanceVar;
                loan.textContent = loanVar;
            }
            else if (balanceVar <= 0) {
                loan.textContent = "Not Enough Money";
                loan.classList.add('notEnoughMoney');
                setTimeout(notEnoughMoneyAlertLoan, 2000);
            }
        }
        else if (loanVar < 250) {
            if (balanceVar > 0) {
                if (balanceVar >= loanVar) {
                    balanceVar = balanceVar - loanVar;
                    loanVar = 0;
                    balance.textContent = balanceVar;
                    loan.textContent = loanVar;
                }
                else if (balanceVar < loanVar) {
                loanVar = loanVar - balanceVar;
                balanceVar = 0;
                balance.textContent = balanceVar;
                loan.textContent = loanVar;
                }
                else if (balanceVar <= 0) {
                    loan.textContent = "Not Enough Money";
                    loan.classList.add('notEnoughMoney');
                    setTimeout(notEnoughMoneyAlert, 2000);
                }
            }
        }
    }
    if (loanVar == 0) {
        loanDecrease.classList.add('disable');
    }
    if (loanVar < loanMax) {
        loanIncrease.classList.remove('disable');
    }
    updateSessionStorage();
}

// Loan Interest
function applyInterest() {
    loanVar = loanVar * 1.0435
    loanVar = loanVar.toFixed(2);
}

// Not enough money warnings (I didn't know there were alerts at the time but I prefer this anyway)
function notEnoughMoneyAlertBalance() {
    balance.classList.remove('notEnoughMoney')
    balance.textContent = balanceVar;
}
function notEnoughMoneyAlertLoan() {
    loan.classList.remove('notEnoughMoney')
    loan.textContent = loanVar;
}
function notEnoughMoneyAlertCash() {
    cash.classList.remove('notEnoughMoney')
    cash.textContent = cashVar;
}



// Money withdrawal funtions
// Setup
function withdrawCashSetup() {
    withdrawInput.value = "-";
    withdrawVar = Number(withdrawInput.value);
    bankSubmit.textContent = "Withdraw";
    transferState = "withdraw";
    if (balanceVar > 0) {
        bankDeposit.classList.add('hidden');
        bankWithdraw.classList.add('hidden');
        withdrawInput.classList.remove('hidden');
        bankSubmit.classList.remove('hidden');
    }
    // Not enough money warning 
        else if (balanceVar <= 0) {
        balance.textContent = "Not Enough Money";
        balance.classList.add('notEnoughMoney');
        setTimeout(notEnoughMoneyAlertBalance, 2000);
    }
}

// Input handling 
function withdrawInputUpdate() {
    if (withdrawInput.value > balanceVar) {
        withdrawInput.value = balanceVar;
    }
    else if (withdrawInput.value < 0) {
        withdrawInput.value = 0;
    }
    withdrawVar = Number(withdrawInput.value);
    bankSubmit.textContent = withdrawInput.value;
    if (withdrawInput.value == "") {
        bankSubmit.textContent = "...";
    }
}
    


// Money deposit functions 
// Setup 
function depositCashSetup() {
    depositInput.value = "-";
    depositVar = Number(depositInput.value);
    transferState = "deposit";
    bankSubmit.textContent = "Deposit";
    if (cashVar > 0) {
        bankDeposit.classList.add('hidden');
        bankWithdraw.classList.add('hidden');
        depositInput.classList.remove('hidden');
        bankSubmit.classList.remove('hidden');
    }
        // Not enough money warning 
        else if (cashVar <= 0) {
        cash.textContent = "Not Enough Money";
        cash.classList.add('notEnoughMoney');
        setTimeout(notEnoughMoneyAlertCash, 2000);
    }
}

// Input handling
function depositInputUpdate() {
    if (depositInput.value > cashVar) {
        depositInput.value = cashVar;
    }
    else if (depositInput.value < 0) {
        depositInput.value = 0;
    }
    depositVar = Number(depositInput.value);
    bankSubmit.textContent = depositInput.value;
    if (depositInput.value == "") {
        bankSubmit.textContent = "...";
    }
}

// Money transfer functions
// Cash Transfer
function transferCash() {
    if (transferState == "withdraw") {
        cashVar = cashVar + withdrawVar;
        balanceVar = balanceVar - withdrawVar;
        // Ensuring that depositng is only made available if the value is above 0
        if (withdrawInput.value > 0)
        bankDeposit.classList.remove('disable');
    }
    else if (transferState == "deposit") {
        cashVar = cashVar - depositVar;
        balanceVar = balanceVar + depositVar;
        if (withdrawInput.value > 0)
            bankWithdraw.classList.remove('disable');
    }

    // Updates the balance and cash values
    updateSessionStorage();
    balance.textContent = balanceVar;
    cash.textContent = cashVar;

    // Changing the buttons back to the + -
    bankDeposit.classList.remove('hidden');
    bankWithdraw.classList.remove('hidden');
    withdrawInput.classList.add('hidden');
    depositInput.classList.add('hidden');
    bankSubmit.classList.add('hidden');
    if (cashVar <= 0) {
        bankDeposit.classList.add('disable');
    }
    else if (balanceVar <= 0) {
        bankWithdraw.classList.add('disable');
    }
}

// Item purchase functions

// Determining purchase price
function generateRandomPrice(min, max) { // functions were used to make it look nicer
    return Math.floor(Math.random() * (max - min + 1)) + min; // returns the value generated to whatever called the function
}
function minVariation() { // also I wanted to try out return
    return 400 - priceVariation;
}
function maxVariation() { 
    return 400 + priceVariation;
}
function generatePurchasePrice() {
    if (!pricesGenerated) {
        // Generate new prices
        trinitonPrice = generateRandomPrice(minVariation(), maxVariation());
        SNESPrice = generateRandomPrice(minVariation(), maxVariation());
        PlaystationPrice = generateRandomPrice(minVariation(), maxVariation());
        XboxPrice = generateRandomPrice(minVariation(), maxVariation());
        GameBoyPrice = generateRandomPrice(minVariation(), maxVariation());
        NokiaPrice = generateRandomPrice(minVariation(), maxVariation());
        DVDPrice = generateRandomPrice(minVariation(), maxVariation());
        IpodPrice = generateRandomPrice(minVariation(), maxVariation());

        // Save prices to session storage
        sessionStorage.setItem("trinitonPrice", trinitonPrice);
        sessionStorage.setItem("SNESPrice", SNESPrice);
        sessionStorage.setItem("PlaystationPrice", PlaystationPrice);
        sessionStorage.setItem("XboxPrice", XboxPrice);
        sessionStorage.setItem("GameBoyPrice", GameBoyPrice);
        sessionStorage.setItem("NokiaPrice", NokiaPrice);
        sessionStorage.setItem("DVDPrice", DVDPrice);
        sessionStorage.setItem("IpodPrice", IpodPrice);

        // Note that the prices have been generated for the day
        pricesGenerated = true;
        sessionStorage.setItem("pricesGenerated", pricesGenerated);

        updateShopSessionStorage();
    }
}

// Display Prices
function updateDisplayedValues() {
    // collects the values of the prices
    trinitonPrice = Number(sessionStorage.getItem("trinitonPrice")) || 400;
    SNESPrice = Number(sessionStorage.getItem("SNESPrice")) || 400;
    PlaystationPrice = Number(sessionStorage.getItem("PlaystationPrice")) || 400
    XboxPrice = Number(sessionStorage.getItem("XboxPrice")) || 400;
    GameBoyPrice = Number(sessionStorage.getItem("GameBoyPrice")) || 400;
    NokiaPrice = Number(sessionStorage.getItem("NokiaPrice")) || 400;
    DVDPrice = Number(sessionStorage.getItem("DVDPrice")) || 400;
    IpodPrice = Number(sessionStorage.getItem("IpodPrice")) || 400;

    // Displays the values in the UI
    item1Price.textContent = trinitonPrice;
    item2Price.textContent = SNESPrice;
    item3Price.textContent = PlaystationPrice;
    item4Price.textContent = XboxPrice;
    item5Price.textContent = GameBoyPrice;
    item6Price.textContent = NokiaPrice;
    item7Price.textContent = DVDPrice;
    item8Price.textContent = IpodPrice;

    // This is untested
    item1Quantity.textContent = trinitonQuantity;
    item2Quantity.textContent = SNESQuantity;
    item3Quantity.textContent = PlaystationQuantity;
    item4Quantity.textContent = XboxQuantity;
    item5Quantity.textContent = GameBoyQuantity;
    item6Quantity.textContent = NokiaQuantity;
    item7Quantity.textContent = DVDQuantity;
    item8Quantity.textContent = IpodQuantity;
}


// Purchasing amount function


function buyItem1action() {
    // Check if the player has enough cash to buy the item
    if (cashVar >= trinitonPrice) {
        // Deduct the price of the item from the player's cash
        cashVar = cashVar - trinitonPrice;
        trinitonQuantity = Number(sessionStorage.getItem("trinitonQuantity")) || 0;
        trinitonQuantity = trinitonQuantity + 1;
        cash.textContent = cashVar;
        item1Quantity.textContent = trinitonQuantity;
        sessionStorage.setItem("trinitonQuantity", trinitonQuantity);
        sessionStorage.setItem("cashVar", cashVar);
    } 
    else {
        // Triggers when there isn't enough money
        cash.textContent = "Not Enough Money";
        cash.classList.add('notEnoughMoney');
        setTimeout(notEnoughMoneyAlertCash, 2000);
    }
    updateShopSessionStorage();
}
``
function buyItem2action() {
    // Check if the player has enough cash to buy the item
    if (cashVar >= SNESPrice) {
        // Deduct the price of the item from the player's cash
        cashVar = cashVar - SNESPrice;
        SNESQuantity = Number(sessionStorage.getItem("SNESQuantity")) || 0;
        SNESQuantity = SNESQuantity + 1;
        cash.textContent = cashVar;
        item2Quantity.textContent = SNESQuantity;
        sessionStorage.setItem("SNESQuantity", SNESQuantity);
        sessionStorage.setItem("cashVar", cashVar);
    } 
    else {
        // Triggers when there isn't enough money
        cash.textContent = "Not Enough Money";
        cash.classList.add('notEnoughMoney');
        setTimeout(notEnoughMoneyAlertCash, 2000);
    }
    updateShopSessionStorage();
}

function buyItem3action() {
    // Check if the player has enough cash to buy the item
    if (cashVar >= PlaystationPrice) {
        // Deduct the price of the item from the player's cash
        cashVar = cashVar - PlaystationPrice;
        PlaystationQuantity = Number(sessionStorage.getItem("PlaystationQuantity")) || 0;
        PlaystationQuantity = PlaystationQuantity + 1;
        cash.textContent = cashVar;
        item3Quantity.textContent = PlaystationQuantity;
        sessionStorage.setItem("PlaystationQuantity", PlaystationQuantity);
        sessionStorage.setItem("cashVar", cashVar);
    } 
    else {
        // Triggers when there isn't enough money
        cash.textContent = "Not Enough Money";
        cash.classList.add('notEnoughMoney');
        setTimeout(notEnoughMoneyAlertCash, 2000);
    }
    updateShopSessionStorage();
}

function buyItem4action() {
    // Check if the player has enough cash to buy the item
    if (cashVar >= XboxPrice) {
        // Deduct the price of the item from the player's cash
        cashVar = cashVar - XboxPrice;
        XboxQuantity = Number(sessionStorage.getItem("XboxQuantity")) || 0;
        XboxQuantity = XboxQuantity + 1;
        cash.textContent = cashVar;
        item4Quantity.textContent = XboxQuantity;
        sessionStorage.setItem("XboxQuantity", XboxQuantity);
        sessionStorage.setItem("cashVar", cashVar);
    } 
    else {
        // Triggers when there isn't enough money
        cash.textContent = "Not Enough Money";
        cash.classList.add('notEnoughMoney');
        setTimeout(notEnoughMoneyAlertCash, 2000);
    }
    updateShopSessionStorage();
}

function buyItem5action() {
    // Check if the player has enough cash to buy the item
    if (cashVar >= GameBoyPrice) {
        // Deduct the price of the item from the player's cash
        cashVar = cashVar - GameBoyPrice;
        GameBoyQuantity = Number(sessionStorage.getItem("GameBoyQuantity")) || 0;
        GameBoyQuantity = GameBoyQuantity + 1;
        cash.textContent = cashVar;
        item5Quantity.textContent = GameBoyQuantity;
        sessionStorage.setItem("GameBoyQuantity", GameBoyQuantity);
        sessionStorage.setItem("cashVar", cashVar);
    } 
    else {
        // Triggers when there isn't enough money
        cash.textContent = "Not Enough Money";
        cash.classList.add('notEnoughMoney');
        setTimeout(notEnoughMoneyAlertCash, 2000);
    }
    updateShopSessionStorage();
}

function buyItem6action() {
    // Check if the player has enough cash to buy the item
    if (cashVar >= NokiaPrice) {
        // Deduct the price of the item from the player's cash
        cashVar = cashVar - NokiaPrice;
        NokiaQuantity = Number(sessionStorage.getItem("NokiaQuantity")) || 0;
        NokiaQuantity = NokiaQuantity + 1;
        cash.textContent = cashVar;
        item6Quantity.textContent = NokiaQuantity;
        sessionStorage.setItem("NokiaQuantity", NokiaQuantity);
        sessionStorage.setItem("cashVar", cashVar);
    } 
    else {
        // Triggers when there isn't enough money
        cash.textContent = "Not Enough Money";
        cash.classList.add('notEnoughMoney');
        setTimeout(notEnoughMoneyAlertCash, 2000);
    }
    updateShopSessionStorage();
}

function buyItem7action() {
    // Check if the player has enough cash to buy the item
    if (cashVar >= DVDPrice) {
        // Deduct the price of the item from the player's cash
        cashVar = cashVar - DVDPrice;
        DVDQuantity = Number(sessionStorage.getItem("DVDQuantity")) || 0;
        DVDQuantity = DVDQuantity + 1;
        cash.textContent = cashVar;
        item7Quantity.textContent = DVDQuantity;
        sessionStorage.setItem("DVDQuantity", DVDQuantity);
        sessionStorage.setItem("cashVar", cashVar);
    } 
    else {
        // Triggers when there isn't enough money
        cash.textContent = "Not Enough Money";
        cash.classList.add('notEnoughMoney');
        setTimeout(notEnoughMoneyAlertCash, 2000);
    }
    updateShopSessionStorage();
}

function buyItem8action() {
    // Check if the player has enough cash to buy the item
    if (cashVar >= IpodPrice) {
        // Deduct the price of the item from the player's cash
        cashVar = cashVar - IpodPrice;
        IpodQuantity = Number(sessionStorage.getItem("IpodQuantity")) || 0;
        IpodQuantity = IpodQuantity + 1;
        cash.textContent = cashVar;
        item8Quantity.textContent = IpodQuantity;
        sessionStorage.setItem("IpodQuantity", IpodQuantity);
        sessionStorage.setItem("cashVar", cashVar);
    } 
    else {
        // Triggers when there isn't enough money
        cash.textContent = "Not Enough Money";
        cash.classList.add('notEnoughMoney');
        setTimeout(notEnoughMoneyAlertCash, 2000);
    }
    updateShopSessionStorage();
}

// Item Selling functions
function sellItem1Action() {
    if (trinitonQuantity >= 1) {
        cashVar = cashVar + trinitonPrice;
        trinitonQuantity = Number(sessionStorage.getItem("trinitonQuantity")) || 0;
        trinitonQuantity = trinitonQuantity - 1;
        cash.textContent = cashVar;
        item1Quantity.textContent = trinitonQuantity;
        sessionStorage.setItem("trinitonQuantity", trinitonQuantity);
        sessionStorage.setItem("cashVar", cashVar);
    }
    updateShopSessionStorage();
}

function sellItem2Action() {
    if (SNESQuantity >= 1) {
        cashVar = cashVar + SNESPrice;
        SNESQuantity = Number(sessionStorage.getItem("SNESQuantity")) || 0;
        SNESQuantity = SNESQuantity - 1;
        cash.textContent = cashVar;
        item2Quantity.textContent = SNESQuantity;
        sessionStorage.setItem("SNESQuantity", SNESQuantity);
        sessionStorage.setItem("cashVar", cashVar);
    }
    updateShopSessionStorage();
}

function sellItem3Action() {
    if (PlaystationQuantity >= 1) {
        cashVar = cashVar + PlaystationPrice;
        PlaystationQuantity = Number(sessionStorage.getItem("PlaystationQuantity")) || 0;
        PlaystationQuantity = PlaystationQuantity - 1;
        cash.textContent = cashVar;
        item3Quantity.textContent = PlaystationQuantity;
        sessionStorage.setItem("PlaystationQuantity", PlaystationQuantity);
        sessionStorage.setItem("cashVar", cashVar);
    }
    updateShopSessionStorage();
}

function sellItem4Action() {
    if (XboxQuantity >= 1) {
        cashVar = cashVar + XboxPrice;
        XboxQuantity = Number(sessionStorage.getItem("XboxQuantity")) || 0;
        XboxQuantity = XboxQuantity - 1;
        cash.textContent = cashVar;
        item4Quantity.textContent = XboxQuantity;
        sessionStorage.setItem("XboxQuantity", XboxQuantity);
        sessionStorage.setItem("cashVar", cashVar);
    }
    updateShopSessionStorage();
}

function sellItem5Action() {
    if (GameBoyQuantity >= 1) {
        cashVar = cashVar + GameBoyPrice;
        GameBoyQuantity = Number(sessionStorage.getItem("GameBoyQuantity")) || 0;
        GameBoyQuantity = GameBoyQuantity - 1;
        cash.textContent = cashVar;
        item5Quantity.textContent = GameBoyQuantity;
        sessionStorage.setItem("GameBoyQuantity", GameBoyQuantity);
        sessionStorage.setItem("cashVar", cashVar);
    }
    updateShopSessionStorage();
}

function sellItem6Action() {
    if (NokiaQuantity >= 1) {
        cashVar = cashVar + NokiaPrice;
        NokiaQuantity = Number(sessionStorage.getItem("NokiaQuantity")) || 0;
        NokiaQuantity = NokiaQuantity - 1;
        cash.textContent = cashVar;
        item6Quantity.textContent = NokiaQuantity;
        sessionStorage.setItem("NokiaQuantity", NokiaQuantity);
        sessionStorage.setItem("cashVar", cashVar);
    }
    updateShopSessionStorage();
}

function sellItem7Action() {
    if (DVDQuantity >= 1) {
        cashVar = cashVar + DVDPrice;
        DVDQuantity = Number(sessionStorage.getItem("DVDQuantity")) || 0;
        DVDQuantity = DVDQuantity - 1;
        cash.textContent = cashVar;
        item7Quantity.textContent = DVDQuantity;
        sessionStorage.setItem("DVDQuantity", DVDQuantity);
        sessionStorage.setItem("cashVar", cashVar);
    }
    updateShopSessionStorage();
}

function sellItem8Action() {
    if (IpodQuantity >= 1) {
        cashVar = cashVar + IpodPrice;
        IpodQuantity = Number(sessionStorage.getItem("IpodQuantity")) || 0;
        IpodQuantity = IpodQuantity - 1;
        cash.textContent = cashVar;
        item8Quantity.textContent = IpodQuantity;
        sessionStorage.setItem("IpodQuantity", IpodQuantity);
        sessionStorage.setItem("cashVar", cashVar);
    }
    updateShopSessionStorage();
}

// (WIP)



// Online Store Access
// These four functions change the current website depending on where they are going
function sendToEucalyptusTree() {
    window.location = "EucalyptusTree.html";
}
function sendToEZGames() {
    window.location = "EZGames.html";
}
function sendToFaceyBook() {
    window.location = "FaceyBook.html";
}
function sendToIBAY() {
    window.location = "IBAY.html";
}

// Physical Store Access
// Decline alert function
function declinedByFatherAlertBigCamera() {
    BigCameraButton.textContent = "Big Camera";
    BigCameraButton.classList.remove('shrinkText');
}
function declinedByFatherAlertmomAndPopStore() {
    momAndPopButton.textContent = "Mom & Pop Store";
    momAndPopButton.classList.remove('shrinkText');
}


// Big Camera Store Child Permission Function
function bigCameraChildAccess() {
    // CHecking what the soulstate is
    if (soulState == "father") {
        window.location = "BigCamera.html"; // The father gets access no matter what
    } else if (soulState == "child") {
        // The child rolls a 30% chance roll
        permissionOut = Math.random();
        if (permissionOut > 0.7) {
            window.location = "BigCamera.html";
        } else if (permissionOut <= 0.7) {
            disablePhysicalStores();
            BigCameraButton.textContent = "Declined By Father";
            BigCameraButton.classList.add('shrinkText');
            setTimeout(declinedByFatherAlertBigCamera, 2000);
        }
        permissionAsked = true;
    }
}
// Mom And Pop Store Child Permission Function
function momAndPopChildAccess() {
    if (soulState == "father") {
        window.location = "MomAndPop.html";
    } else if (soulState == "child") {
        permissionOut = Math.random();
        if (permissionOut > 0.7) {
            window.location = "MomAndPop.html";
        } else if (permissionOut <= 0.7) {
            momAndPopButton.textContent = "Declined By Father";
            disablePhysicalStores();
            momAndPopButton.textContent = "Declined By Father";
            momAndPopButton.classList.add('shrinkText');
            setTimeout(declinedByFatherAlertmomAndPopStore, 2000);
        }
        permissionAsked = true;
    }
}
// Disabling and enabling the stores (using classList and diabled.true/false)
function disablePhysicalStores() {
    BigCameraButton.classList.add('disable');
    momAndPopButton.classList.add('disable');
    BigCameraButton.disabled = true;
    momAndPopButton.disabled = true;
}
function enablePhysicalStores() {
    BigCameraButton.classList.add('disable');
    momAndPopButton.classList.add('disable');
    BigCameraButton.disabled = true;
    momAndPopButton.disabled = true;
}



window.onload = function() { // The code only worked when I did it this way so I kept it
    updateDisplayedValues();
}

// Event listeners
// Begin listeners
function beginListenerFunction() {
    changeTOD();
    openDashboard();
    checkDayPhase();
    generatePurchasePrice();
}
begin.onclick = beginListenerFunction;
resetSession.onclick = resetVariables;
cycleDay.onclick = changeTOD;

// LHS listeners
loanIncrease.onclick = loanAdd;
loanDecrease.onclick = loanPayback;

bankWithdraw.onclick = withdrawCashSetup;
bankDeposit.onclick = depositCashSetup;
depositInput.oninput = depositInputUpdate;
withdrawInput.oninput = withdrawInputUpdate;
bankSubmit.onclick = transferCash;

// RHS listeners 
father.onclick = enableFatherControls;
child.onclick = disableFatherControls;

// Physical Store Listeners
BigCameraButton.onclick = bigCameraChildAccess;
momAndPopButton.onclick = momAndPopChildAccess;