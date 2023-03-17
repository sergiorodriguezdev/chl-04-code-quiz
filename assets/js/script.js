// Array of questions objects
var questions = [
    {
        question: "question 1",
        choices: [
            "choice 1",
            "choice 2",
            "choice 3",
            "choice 4"
        ],
        answerIdx: 0 
    },
    {
        question: "question 2",
        choices: [
            "choice 1",
            "choice 2",
            "choice 3",
            "choice 4"
        ],
        answerIdx: 1 
    },
    {
        question: "question 3",
        choices: [
            "choice 1",
            "choice 2",
            "choice 3",
            "choice 4"
        ],
        answerIdx: 2
    },
    {
        question: "question 4",
        choices: [
            "choice 1",
            "choice 2",
            "choice 3",
            "choice 4"
        ],
        answerIdx: 3
    }
];

// Global variables
var currentQuestionIdx;
var timer;
var interval;
var penalty = 10;

// Get HTML elements
// Nav and Section HTML elements
var navigationBar = document.getElementById("nav-bar");
var homePage = document.getElementById("home-page");
var questionsPage = document.getElementById("questions-page");
var resultsPage = document.getElementById("results-page");
var highScoresPage = document.getElementById("high-scores-page");

// Get nav-bar children elements
var btnViewHS = document.getElementById("view-high-scores");
var intervalTimer = document.getElementById("timer");

// nav-bar listeners
// View High Scores button on click listener
btnViewHS.addEventListener("click", function() {
    // Hide other pages, show high scores
    setPageVisibility("high-scores");

    // Load high scores objects (array) from localStorage
    var highScores = JSON.parse(localStorage.getItem("Quiz-High-Scores"));

    // Create li elements for each entry in array - array should be presorted
    if (highScores !== null) {
        for (var i = 0; i < highScores.length; i++) {
            var liEl = document.createElement("li");

            liEl.textContent = highScores[i].initials + " - " + highScores[i].score;

            lstHighScores.appendChild(liEl);
        }
    }
});

// Get home-page children elements
var btnStartQuiz = document.getElementById("start-quiz");

// home-page listeners
// Start Quiz button on click listener
btnStartQuiz.addEventListener("click", function() {
    // Shuffle questions array


    // Initialize timer
    timer = 75;
    interval = setInterval(function() {
        timer--;
        intervalTimer.textContent = timer;

        // Once time runs out, stop timer
        if (timer <= 0) {
            clearInterval(interval);
            
            setPageVisibility("results")

            finalScore.textContent = timer;
        }

    }, 1000);

    currentQuestionIdx = 0;
    setPageVisibility("questions");
    intervalTimer.textContent = timer;
    populateQuestion();
});

// Get questions-page children elements
var questionHeader = document.getElementById("question");
var lstChoices = document.getElementById("choices");
var message = document.getElementById("msg");

// questions-page listeners
// Choice on click listener
lstChoices.addEventListener("click", function(event) {
    // event.preventDefault();

    // Grab element that was clicked. If it's a li element, then check if selected choice is correct answer. 
    // Otherwise, stop execution
    var choiceEl = event.target;
    
    if (choiceEl.matches("li")){
        // Grab the data-* attribute from the li element that was clicked
        var clickedIdx = parseInt(choiceEl.getAttribute("data-choice-idx"));

        // Compare the selection with index of the correct answer
        // If correct, then move on to next question
        //  else, subtract penalty
        // Move on to next question
        if (clickedIdx === questions[currentQuestionIdx].answerIdx) {
            message.textContent = "Correct!";
        } else {
            message.textContent = "Wrong :(";
            timer -= penalty;
        }

        currentQuestionIdx++;
        populateQuestion();
    }
    else {
        return;
    }
})

// Populate question page elements
function populateQuestion() {
    if (currentQuestionIdx === 0) {
        message.textContent = "";
    } else if (currentQuestionIdx >= questions.length) {
        clearInterval(interval);
            
        setPageVisibility("results")

        finalScore.textContent = timer;

        return;
    }

    questionHeader.textContent = questions[currentQuestionIdx].question;

    // Remove all children elements from choices list ol element
    while (lstChoices.firstChild) {
        lstChoices.removeChild(lstChoices.lastChild);
    };
    
    // Loop through all current question choices and create li elements for each one.
    // Add a data-* attribute that will be used to compare with correct answer
    // Append node to list of choices ol element
    questions[currentQuestionIdx].choices.forEach(function(choice, index) {
        var tmpChoice = document.createElement("li");

        tmpChoice.textContent = choice;
        tmpChoice.setAttribute("data-choice-idx", index);

        lstChoices.appendChild(tmpChoice);
    });
}

// Get results-page children elements
var finalScore = document.getElementById("final-score");
var txtInitials = document.getElementById("initials");
var btnInitialsSubmit = document.getElementById("initials-submit");

// resuts-page listeners
// Submit button on click listener
btnInitialsSubmit.addEventListener("click", function(event) {
    event.preventDefault();

    var tmpInitials = txtInitials.value.trim();
    var tmpScore = parseInt(finalScore.textContent);

    // Verify that the user has entered at least 1 character in the initials input
    if (tmpInitials.length === 0) {
        alert("Please enter your initials.");
        return;
    }

    var tmpHSObject = {
        initials: tmpInitials,
        score: tmpScore
    };

    // Load high scores objects (array) from localStorage
    var highScores = JSON.parse(localStorage.getItem("Quiz-High-Scores"));

    // If localStorage object doesn't exist then assign an empty array to variable
    if (highScores === null) {
        highScores = [];
    }

    // Push tmpHSObject into array
    highScores.push(tmpHSObject);

    // Sort array in descending order based on the object's score property
    highScores.sort(function(a, b) {
        return b.score - a.score;
    });

    // Save high scores objects (array) to localStorage
    localStorage.setItem("Quiz-High-Scores", JSON.stringify(highScores));

    // Move to high scores page
    txtInitials.value = "";
    setPageVisibility("high-scores")
});

// Get high-scores-page children elements
var lstHighScores = document.getElementById("high-scores-list");
var btnGoBack = document.getElementById("go-back");
var btnClearHS = document.getElementById("clear-high-scores");

// high-scores-page listeners
// Go Back button on click listener
btnGoBack.addEventListener("click", function() {
    // Go back to initial state aka home page
    init();
});

// Clear High Scores button on click listener
btnClearHS.addEventListener("click", function() {
    // Set high scores localStorage item to an empty array string - []
    localStorage.setItem("Quiz-High-Scores", "[]");

    // Remove all children elements from high scores list ol element
    while (lstHighScores.firstChild) {
        lstHighScores.removeChild(lstHighScores.lastChild);
    };
});

// Initialize web app
function init() {
    setPageVisibility("home");

    timer = 0;
    intervalTimer.textContent = timer;
    clearInterval(interval);
}

// This will hide/show the different sections and their children elements in the HTML based on the value provided
function setPageVisibility(pageToShow) {
    if (pageToShow === "home") {
        navigationBar.style.display = "block";
        homePage.style.display = "block";

        questionsPage.style.display = "none";
        resultsPage.style.display = "none";
        highScoresPage.style.display = "none";

    } else if (pageToShow === "questions") {
        navigationBar.style.display = "block";
        questionsPage.style.display = "block";

        homePage.style.display = "none";
        resultsPage.style.display = "none";
        highScoresPage.style.display = "none";

    } else if (pageToShow === "results") {
        navigationBar.style.display = "block";
        resultsPage.style.display = "block";

        homePage.style.display = "none";
        questionsPage.style.display = "none";
        highScoresPage.style.display = "none";

    } else if (pageToShow === "high-scores") {
        highScoresPage.style.display = "block";
        
        navigationBar.style.display = "none";
        homePage.style.display = "none";
        questionsPage.style.display = "none";
        resultsPage.style.display = "none";
    }
}

init();