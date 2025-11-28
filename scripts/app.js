// scripts/app.js
// JavaScript for the Memory Card Game
// - This file wires up the DOM, handles shuffling/assigning images to cards,
//   manages flips and match logic, and shows/hides the overlays (intro, win, game over).

// --- DOM references ---
const cards = document.querySelectorAll(".card"); // NodeList of card elements
const container = document.querySelector(".container");
// Intro popup elements
const popapElement = document.querySelector(".popap-element");
const popap = document.querySelector(".popap");

// User info and start controls
const letsgo = document.querySelector(".letsgo");
const inputofname = document.querySelector(".input");

// Score displays
const score = document.querySelector(".score");
const win = document.querySelector(".win");

// Game over overlay controls
const exit = document.querySelector(".exit");
const Continue = document.querySelector(".continue");
const gameOver = document.querySelector(".game-over");

// Winner overlay controls
const Winner = document.querySelector(".you-win");
const Reset = document.querySelector(".Reset");
const tryAgain = document.querySelector(".try-again");

// Choice (gender) and portfolio image element
const choise = document.querySelector(".choise");
const portfolio = document.querySelector(".acount");

// Sound effects used in the game
const popSong = new Audio('../sounds/mouse-click-sfx-free-376869.mp3');
const noSong = new Audio("../sounds/no-no-no-242246.mp3");
const winSong = new Audio("../sounds/triumphant-yes-x2-103141.mp3");
const songaudio = document.querySelector(".audio"); // background audio element
//
const feadback = document.querySelector(".feadback");
const sendFeadback = document.querySelector(".send-feadback")
const btnX = document.querySelector(".btn-x")
const footer = document.querySelector("footer")
    // --- Game state variables ---
let cardOne, cardTowe; // references to the two currently flipped cards
let ScoreVraible = 0; // number of incorrect attempts (displayed in score)
let winVriable = 0; // number of matched pairs found

// Image set (8 unique images). Each will be duplicated to make pairs.
let Array = ['imagescard/image1.png',
    'imagescard/image2.png',
    'imagescard/image3.png',
    'imagescard/image4.png',
    'imagescard/image5.png',
    'imagescard/image6.png',
    'imagescard/image7.png',
    'imagescard/image8.png'
];

// Small array of profile images used when user selects gender
let Aimgportfolio = ["images/fmale.jpg",
    "images/home.jpg"
];

// --- Helper: show game-over overlay if too many wrong moves ---
function gameover() {
    // In this project ScoreVraible seems to track wrong attempts; when it hits 16 show game over
    if (ScoreVraible === 16) {
        // add visible class and play losing sound
        gameOver.classList.add("vissible");
        container.classList.add("displynone");
        footer.classList.add("displynone");
        noSong.play();
    }

    // Continue button resets overlay and score counter
    Continue.addEventListener("click", () => {
        footer.classList.remove("displynone");
        container.classList.remove("displynone");
        gameOver.classList.remove("vissible");
        ScoreVraible = 0;
    });

    // Exit reloads the page
    exit.addEventListener("click", () => {
        location.reload();
    });
}

// --- Helper: show win overlay when all pairs found ---
function winner() {
    if (winVriable === 8) { // 8 pairs -> all matched
        Winner.classList.add("vissible");
        container.classList.add("displynone");
        footer.classList.add("displynone");
        // Try again hides overlay and reshuffles images
        tryAgain.addEventListener("click", () => {
            Winner.classList.remove("vissible");
            footer.classList.remove("displynone");
            container.classList.remove("displynone");
            winVriable = 0;
            generateImages();
        });

        // Play win sound
        winSong.play();
    }

    // Reset button reloads the page
    Reset.addEventListener("click", () => {
        location.reload();
    });
}

// --- Assign images to card backs (create shuffled pairs) ---
function generateImages() {
    // Build a pool with each image twice (for pairs)
    let imagesPool = [];
    for (let i = 0; i < Array.length; i++) {
        for (let j = 0; j < 2; j++) {
            imagesPool.push(Array[i]);
        }
    }

    // Shuffle the pool using a simple random comparator
    imagesPool.sort(() => Math.random() - 0.5);

    // Assign shuffled images to each card's back image element
    cards.forEach((card, i) => {
        let backImage = card.querySelector(".back-view img");
        backImage.src = imagesPool[i];
    });
}

// Initialize the board by assigning images
generateImages();

// --- Compare two images and update state ---
function getthesameimage(image1, image2) {
    if (image1 === image2) {
        // Matched pair: increment match counter and clear selected cards
        winVriable++;
        cardOne = cardTowe = '';
        win.innerHTML = winVriable;
    } else {
        // Not a match: increment wrong attempts, show shake effect, then flip back
        ScoreVraible++;
        setTimeout(() => {
            cardOne.classList.add('shake');
            cardTowe.classList.add('shake');

        }, 500);

        setTimeout(() => {
            // Remove flipped state and clear selection
            cardOne.classList.remove('flap');
            cardTowe.classList.remove('flap');
            cardOne = cardTowe = '';

            // Optionally toggle nottouche to briefly disable interactions
            cards.forEach(card => {
                card.classList.add("nottouche");
            });
            cards.forEach(card => {
                card.classList.remove("nottouche");
            });

        }, 1200);

        // Update displayed score of wrong attempts
        score.innerHTML = ScoreVraible;
    }

    // Check game-over or win conditions after each comparison
    gameover();
    winner();
}

// --- Handle card click (flip) ---
function flapCards(e) {
    // Play click sound
    popSong.play();

    let elemnt = e.target;
    elemnt.classList.toggle('flap'); // toggle flip visual

    // Only proceed if the clicked element is not already stored as the first card
    if (cardOne !== elemnt) {
        if (elemnt.classList.contains("flap")) {
            // If we don't yet have a first card, set it and return
            if (!cardOne) {
                cardOne = elemnt;
                return cardOne;
            }

            // Set the second card and compare their back images
            cardTowe = elemnt;
            let cardimage1 = cardOne.querySelector(".back-view img").src;
            let cardimage2 = cardTowe.querySelector(".back-view img").src;

            getthesameimage(cardimage1, cardimage2);
        }
    }
}

// --- Event wiring ---
cards.forEach(card => {
    card.addEventListener("click", flapCards);
});

// Start button: validate input, play intro audio, and hide popup after a timeout
letsgo.addEventListener("click", () => {
    if (inputofname.value !== "" && choise.value !== "") {
        songaudio.play();

        // Show a small loader while starting
        popapElement.innerHTML = `
      <div class="loader"></div>
      `;

        // Set username in header
        let username = inputofname.value;

        // Hide intro popup after 8s and pause audio
        setTimeout(() => {
            popap.classList.add("displynone");
            songaudio.pause();
            container.classList.add("vissible");

        }, 8000);

        // Update portfolio image based on selected choice
        if (choise.value == "male") {
            portfolio.innerHTML = `  
             <img class="portfolio" src="${Aimgportfolio[1]}" alt="">
                <h1 class="username">${username}</h1> `;

        } else if (choise.value = "famale") {
            portfolio.innerHTML = `  
             <img class="portfolio" src="${Aimgportfolio[0]}" alt="">
                <h1 class="username">${username}</h1> `;
        }
    }
});
//
feadback.addEventListener("click", () => {
    container.classList.add("displynone");
    footer.classList.add("displynone");
    sendFeadback.classList.add("vissible");

})
btnX.addEventListener("click", () => {
    sendFeadback.classList.remove("vissible");
    footer.classList.remove("displynone");
    container.classList.remove("displynone");
})