/*
 * shuffle() function provided by Udacity's starter code
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}



let deck = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
           "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
           "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

// Game variables
let open = [];
let matched = 0;
let moveCounter = 0;
let numStars = 3;
let timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
};

// Difficulty settings 
let hard = 10;
let medium = 15;

let modal = $("#win-modal");



// Timerfunction
let startTimer = function() {
    if (timer.seconds === 59) {
        timer.minutes++;
        timer.seconds = 0;
    } else {
        timer.seconds++;
    }

    
    let formattedSec = "0";
    if (timer.seconds < 10) {
        formattedSec += timer.seconds;
    } else {
        formattedSec = String(timer.seconds);
    }

    let time = String(timer.minutes) + ":" + formattedSec;
    $(".timer").text(time);
};

// timer reset
function resetTimer() {
    clearInterval(timer.clearTime);
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("0:00");

    timer.clearTime = setInterval(startTimer, 1000);
};

// Creates and update card HTML
function updateCards() {
    deck = shuffle(deck);
    let index = 0;
    $.each($(".card i"), function(){
      $(this).attr("class", "fa " + deck[index]);
      index++;
    });
    resetTimer();
}

//  win modal 
function showModal() {
    modal.css("display", "block");
}

// Removes stars
function removeStar() {
    $(".fa-star").last().attr("class", "fa fa-star-o");
    numStars--;
    $(".num-stars").text(String(numStars));
}

// Restores stars 
function resetStars() {
    $(".fa-star-o").attr("class", "fa fa-star");
    numStars = 3;
    $(".num-stars").text(String(numStars));
}

// Updates number of moves in the HTML
function updateMoveCounter() {
    $(".moves").text(moveCounter);

    if (moveCounter === hard || moveCounter === medium) {
        removeStar();
    }
}

// Checks if card is a valid 
function isValid(card) {
    return !(card.hasClass("open") || card.hasClass("match"));
}

// Returns a card match
function checkMatch() {
    if (open[0].children().attr("class")===open[1].children().attr("class")) {
        return true;
    } else {
        return false;
    }
}

// Win condition
function hasWon() {
    if (matched === 16) {
        return true;
    } else {
        return false;
    }
}

//  Checks win condition
let setMatch = function() {
    open.forEach(function(card) {
        card.addClass("match");
    });
    open = [];
    matched += 2;

    if (hasWon()) {
        clearInterval(timer.clearTime);
        showModal();
    }
};

// Reset cards
let resetOpen = function() {
    open.forEach(function(card) {
        card.toggleClass("open");
        card.toggleClass("show");
    });
    open = [];
};

// Sets selected card to the open and shown state
function openCard(card) {
    if (!card.hasClass("open")) {
        card.addClass("open");
        card.addClass("show");
        open.push(card);
    }
};



// Resets game
let resetGame = function() {
    open = [];
    matched = 0;
    moveCounter = 0;
    resetTimer();
    updateMoveCounter();
    $(".card").attr("class", "card");
    updateCards();
    resetStars();
};

// Primary game logic function
let onClick = function() {
    if (isValid( $(this) )) {

        if (open.length === 0) {
            openCard( $(this) );

        } else if (open.length === 1) {
            openCard( $(this) );
            moveCounter++;
            updateMoveCounter();

            if (checkMatch()) {
                setTimeout(setMatch, 300);

            } else {
                setTimeout(resetOpen, 700);

            }
        }
    }
};

// Play again function
let playAgain = function() {
    resetGame();
    modal.css("display", "none");
};

//event listeners

$(".card").click(onClick);
$(".restart").click(resetGame);
$(".play-again").click(playAgain);

// Provides a randomized game board on page load
$(updateCards);