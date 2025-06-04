// ui.js

function displayErrorMessage(message) {
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        resultsDiv.innerHTML = `<p class="error-message">${message}</p>`;
        resultsDiv.style.display = 'block';
    }
    const aiFeedbackDiv = document.getElementById('aiFeedback');
    if (aiFeedbackDiv) {
        aiFeedbackDiv.style.display = 'none';
    }
}

function clearPreviousResults() {
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        resultsDiv.innerHTML = ''; // Clear previous results
        resultsDiv.style.display = 'none'; // Hide until new results are ready
    }
    const aiFeedbackDiv = document.getElementById('aiFeedback');
    if (aiFeedbackDiv) {
        aiFeedbackDiv.innerHTML = '<h2>Personalized Feedback</h2><p id="aiFeedbackText">Your personalized feedback will appear here.</p>'; // Reset content
        aiFeedbackDiv.style.display = 'none';
    }
}

function displayNumericalResults(scores, levels, competencyOrder, competencyKoreanNames) {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) {
        console.error("Results div not found!");
        return;
    }
    resultsDiv.innerHTML = ''; // Clear previous content (like error messages)

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

function displayAIfeedback(feedbackText) {
    const aiFeedbackTextElement = document.getElementById('aiFeedbackText');
    const aiFeedbackDiv = document.getElementById('aiFeedback');

    if (aiFeedbackTextElement && aiFeedbackDiv) {
        aiFeedbackTextElement.innerText = feedbackText;
        aiFeedbackDiv.style.display = 'block';
    } else {
        console.error("AI Feedback elements not found!");
    }
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
            // No need to break, main.js will check allAnswered status
        }
    }
    return { answers: selectedAnswers, allAnswered: allAnswered };
}

function hideAIRelicsOnSubmit() {
    const aiFeedbackDiv = document.getElementById('aiFeedback');
    if (aiFeedbackDiv) {
        aiFeedbackDiv.style.display = 'none';
    }
}

function initialUISetup() {
    // Ensure AI feedback is hidden on initial load,
    // regardless of HTML state, to be controlled by JS.
    const aiFeedbackDiv = document.getElementById('aiFeedback');
    if (aiFeedbackDiv) {
        aiFeedbackDiv.style.display = 'none';
    }
    // Placeholder text for results div is managed by HTML or not shown due to display:none
    // const resultsDiv = document.getElementById('results');
    // if (resultsDiv && resultsDiv.innerHTML.trim() === "") {
    //      resultsDiv.innerHTML = "<p>Complete the questionnaire and click 'Submit Answers' to see your profile.</p>";
    // }
}
