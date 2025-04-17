// DOM Elements
const elements = {
    startBtn: document.querySelector('.start-btn'),
    popupInfo: document.querySelector('.popup-info'),
    exitBtn: document.querySelector('.exit-btn'),
    main: document.querySelector('.main'),
    continueBtn: document.querySelector('.continue-btn'),
    quizSection: document.querySelector('.quiz-section'),
    quizBox: document.querySelector('.quiz-box'),
    resultBox: document.querySelector('.result-box'),
    tryAgainBtn: document.querySelector('.tryAgain-btn'),
    goHomeBtn: document.querySelector('.goHome-btn'),
    nextBtn: document.querySelector('.next-btn'),
    optionList: document.querySelector('.option-list'),
    questionText: document.querySelector('.question-text'),
    questionTotal: document.querySelector('.question-total'),
    headerScoreText: document.querySelector('.header-score'),
    scoreText: document.querySelector('.score-text'),
    circularProgress: document.querySelector('.circular-progress'),
    progressValue: document.querySelector('.progress-value'),
    timerDisplay: document.querySelector('.timer')
};

// Quiz State
const quizState = {
    questionCount: 0,
    questionNumb: 1,
    userScore: 0,
    timer: null,
    timeLeft: 300 // 5 minutes in seconds
};

// Event Listeners
elements.startBtn.addEventListener('click', () => {
    elements.popupInfo.classList.add('active');
    elements.main.classList.add('active');
});

elements.exitBtn.addEventListener('click', resetQuiz);

elements.continueBtn.addEventListener('click', () => {
    elements.quizSection.classList.add('active');
    elements.popupInfo.classList.remove('active');
    elements.main.classList.remove('active');
    elements.quizBox.classList.add('active');
    
    startQuiz();
});

elements.tryAgainBtn.addEventListener('click', restartQuiz);
elements.goHomeBtn.addEventListener('click', resetQuiz);
elements.nextBtn.addEventListener('click', nextQuestion);

// Quiz Functions
function startQuiz() {
    showQuestions(quizState.questionCount);
    questionCounter(quizState.questionNumb);
    updateScoreDisplay();
    startTimer();
}

function resetQuiz() {
    elements.popupInfo.classList.remove('active');
    elements.main.classList.remove('active');
    elements.quizSection.classList.remove('active');
    elements.resultBox.classList.remove('active');
    
    clearInterval(quizState.timer);
    quizState.questionCount = 0;
    quizState.questionNumb = 1;
    quizState.userScore = 0;
    quizState.timeLeft = 300;
}

function restartQuiz() {
    elements.quizBox.classList.add('active');
    elements.resultBox.classList.remove('active');
    elements.nextBtn.classList.remove('active');
    
    quizState.questionCount = 0;
    quizState.questionNumb = 1;
    quizState.userScore = 0;
    quizState.timeLeft = 300;
    
    startQuiz();
}

function showQuestions(index) {
    elements.questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;
    
    elements.optionList.innerHTML = questions[index].options
        .map(option => `<div class="option"><span>${option}</span></div>`)
        .join('');
    
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => optionSelected(option));
    });
}

function optionSelected(selectedOption) {
    const correctAnswer = questions[quizState.questionCount].answer;
    const allOptions = elements.optionList.children;
    const isCorrect = selectedOption.textContent === correctAnswer;
    
    selectedOption.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
        quizState.userScore++;
        updateScoreDisplay();
    } else {
        // Highlight correct answer if wrong was selected
        Array.from(allOptions).find(opt => 
            opt.textContent === correctAnswer
        ).classList.add('correct');
    }
    
    // Disable all options after selection
    Array.from(allOptions).forEach(opt => {
        opt.classList.add('disabled');
        opt.style.pointerEvents = 'none';
    });
    
    elements.nextBtn.classList.add('active');
}

function nextQuestion() {
    if (quizState.questionCount < questions.length - 1) {
        quizState.questionCount++;
        quizState.questionNumb++;
        
        showQuestions(quizState.questionCount);
        questionCounter(quizState.questionNumb);
        elements.nextBtn.classList.remove('active');
    } else {
        showResultBox();
    }
}

function questionCounter(index) {
    elements.questionTotal.textContent = `${index} of ${questions.length} Questions`;
}

function updateScoreDisplay() {
    elements.headerScoreText.textContent = `Score: ${quizState.userScore} / ${questions.length}`;
}

function startTimer() {
    clearInterval(quizState.timer);
    quizState.timer = setInterval(() => {
        quizState.timeLeft--;
        updateTimerDisplay();
        
        if (quizState.timeLeft <= 0) {
            clearInterval(quizState.timer);
            showResultBox();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(quizState.timeLeft / 60);
    const seconds = quizState.timeLeft % 60;
    elements.timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function showResultBox() {
    clearInterval(quizState.timer);
    elements.quizBox.classList.remove('active');
    elements.resultBox.classList.add('active');
    
    const percentage = Math.round((quizState.userScore / questions.length) * 100);
    elements.scoreText.textContent = `Your Score ${quizState.userScore} out of ${questions.length} (${percentage}%)`;
    
    animateProgress(percentage);
}

function animateProgress(endValue) {
    let progress = 0;
    const speed = 20;
    const increment = endValue > progress ? 1 : -1;
    
    const animation = setInterval(() => {
        progress += increment;
        elements.progressValue.textContent = `${progress}%`;
        elements.circularProgress.style.background = 
            `conic-gradient(#c40094 ${progress * 3.6}deg, rgba(255, 255, 255, .1) 0deg)`;
        
        if ((increment > 0 && progress >= endValue) || (increment < 0 && progress <= endValue)) {
            clearInterval(animation);
        }
    }, speed);
}