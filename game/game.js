var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var score = 0;
var gameStarted = false;

// The user can change the game's volume
var volumeSlider = $(".volume-slider")[0];
var volumeOutput = $(".current-volume")[0];

volumeSlider.oninput = function() {
    volumeOutput.innerHTML = this.value + "%";
}

// The user needs to press a key to start the game
$(document).keypress(function() {
    if (!gameStarted) {
        score = 0;
        $("#restart-title").text("");
        $(".container").css("display", "block");
        $("#score-title").css("margin-top", "5%");
        $(".submit-score").css("display", "none");
        $("input")[2].removeAttribute("readonly");

    nextSequence();
    gameStarted = true;
    }
});

// This function starts the game and creates the sequence and updates it every time the user gets the sequence correct
function nextSequence() {
    $("#score-title").text(score);

    var randomNumber = Math.ceil(Math.random() * 3);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    $("#" + randomChosenColour).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
    userClickedPattern.length = 0;
}

// When the game starts, the user can click the button 
// and the program will check if the answer is correct
$(".btn").click(function() {
    var userChosenColour = this.id;
    animatePress(this.id);
    playSound(this.id);
    userClickedPattern.push(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
});

// The program will check whether the user has got the sequence correct
function checkAnswer(currentScore) {
    if (gamePattern[currentScore] == userClickedPattern[currentScore]) {
        if (gamePattern.length === userClickedPattern.length) {
            score++;
            setTimeout(nextSequence, 1000);
        }
    } else {
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function() {$("body").toggleClass("game-over");}, 150);

        $("#score-title").css("margin-top", "12%");
        $("#restart-title").css("font-size", "1.5rem");
        $(".submit-score").css("display", "block");
        $(".container").css("display", "none");

        $("#score-title").text("Game Over, Score: " + score);
        $("#restart-title").text("Press Any Key to Restart");
        $("input")[2].setAttribute("value", `${score}`);
        $("input")[2].setAttribute("readonly", "");

        $("#enter-username").bind("keypress", function(e) {
            e.stopPropagation();
        })

        startOver();
    }
}

// The program will play an audio when the user selects a button
function playSound(button) {
    var sound = new Audio("/sounds/" + button + ".mp3");
    sound.volume = volumeSlider.value / 100;
    sound.play();
}

// The buttons will be animated when the user selects a button
function animatePress(currentColour) {
    $("." + currentColour).addClass("pressed");
    setTimeout(function () {$("." + currentColour).removeClass("pressed");}, 100);
}

// Allow the game to restart if the user clicks a key
function startOver() {
    gamePattern.length = 0;
    gameStarted = false;
}