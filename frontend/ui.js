// ui.js

function displayErrorMessage(message) { // For general form validation errors
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        resultsDiv.innerHTML = `<p class="error-message">${message}</p>`; // Uses global .error-message
        resultsDiv.style.display = 'block';
    }
    hideAIfeedback();
}

// --- AI Feedback Specific UI Functions ---
function showAIFeedbackLoading() {
    const aiFeedbackTextElement = document.getElementById('aiFeedbackText');
    const aiFeedbackContainer = document.getElementById('aiFeedback');

    if (aiFeedbackTextElement && aiFeedbackContainer) {
        aiFeedbackTextElement.innerHTML = '<p class="loading-message">AI 분석결과를 생성 중입니다. 잠시만 기다려 주세요...</p>';
        aiFeedbackTextElement.className = ''; // Clear other classes like 'error-message' if any
        aiFeedbackContainer.style.display = 'block';
    }
}

function displayAIFeedbackError(errorMessage) {
    const aiFeedbackTextElement = document.getElementById('aiFeedbackText');
    const aiFeedbackContainer = document.getElementById('aiFeedback');

    if (aiFeedbackTextElement && aiFeedbackContainer) {
        // Use error-message class scoped within #aiFeedbackText if specific styling is needed
        // For now, assuming #aiFeedbackText .error-message CSS handles it.
        aiFeedbackTextElement.innerHTML = \`<p class="error-message">\${errorMessage}</p>\`;
        aiFeedbackTextElement.className = 'error-message-parent'; // Example if needed for parent styling
        aiFeedbackContainer.style.display = 'block';
    }
}

function displayAIfeedback(feedbackText) { // Displays successful AI feedback
    const aiFeedbackTextElement = document.getElementById('aiFeedbackText');
    const aiFeedbackContainer = document.getElementById('aiFeedback');

    if (aiFeedbackTextElement && aiFeedbackContainer) {
        aiFeedbackTextElement.innerText = feedbackText;
        aiFeedbackTextElement.className = ''; // Reset any specific classes (like loading or error)
        aiFeedbackContainer.style.display = 'block';
    } else {
        console.error("#aiFeedbackText or #aiFeedback element not found.");
    }
}

function hideAIfeedback() {
    const aiFeedbackContainer = document.getElementById('aiFeedback');
    if (aiFeedbackContainer) {
        aiFeedbackContainer.style.display = 'none';
    }
    const aiFeedbackTextElement = document.getElementById('aiFeedbackText');
    if (aiFeedbackTextElement) {
        aiFeedbackTextElement.innerHTML = ''; // Clear previous content (loading, error, or success)
        aiFeedbackTextElement.className = ''; // Reset classes
    }
}
// --- End AI Feedback Specific UI Functions ---

function clearPreviousResults() {
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        resultsDiv.innerHTML = '';
        resultsDiv.style.display = 'none';
    }
    hideAIfeedback();
}

function displayNumericalResults(scores, levels, competencyOrder, competencyKoreanNames) {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) {
        console.error("Results div not found!");
        return;
    }
    resultsDiv.innerHTML = '';

    const titleElement = document.createElement('h2');
    titleElement.textContent = "Your SynergySpark Profile";
    resultsDiv.appendChild(titleElement);

    for (const competencyName of competencyOrder) {
        if (scores.hasOwnProperty(competencyName) && levels.hasOwnProperty(competencyName)) {
            const rawScore = scores[competencyName];
            const levelInfo = levels[competencyName];

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('competency-item');

            const competencyText = document.createElement('p');
            competencyText.innerHTML = `<strong>${competencyKoreanNames[competencyName] || competencyName}:</strong> Level ${levelInfo.level} (${levelInfo.description}) - Raw Score: ${rawScore.toFixed(2)}`;
            itemDiv.appendChild(competencyText);
            resultsDiv.appendChild(itemDiv);
        }
    }
    resultsDiv.style.display = 'block';
}


function getSelectedAnswers(formElement, numberOfQuestions) {
    const selectedAnswers = {};
    let allAnswered = true;
    for (let i = 1; i <= numberOfQuestions; i++) {
        const questionName = 'q' + i;
        const selectedOptionInput = formElement.elements[questionName];

        if (selectedOptionInput && selectedOptionInput.value) {
            selectedAnswers[questionName] = selectedOptionInput.value;
        } else {
            allAnswered = false;
        }
    }
    return { answers: selectedAnswers, allAnswered: allAnswered };
}

function initialUISetup() {
    const aiFeedbackDiv = document.getElementById('aiFeedback');
    if (aiFeedbackDiv) {
        aiFeedbackDiv.style.display = 'none';
    }
}
