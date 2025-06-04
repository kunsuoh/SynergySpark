// main.js

// Constants that might be shared or passed to other modules
const COMPETENCY_ORDER = ["INSIGHT", "FLEXEM", "VOYAGE", "BRIDGE", "SPARKS", "ANCHOR"];
const COMPETENCY_KOREAN_NAMES = {
    INSIGHT: "통찰력", FLEXEM: "유연성/공감", VOYAGE: "추진력",
    BRIDGE: "협력/소통", SPARKS: "동기부여", ANCHOR: "안정감"
};
const NUMBER_OF_QUESTIONS = 10;

document.addEventListener('DOMContentLoaded', () => {
    console.log("SynergySpark main.js loaded and DOM fully parsed.");
    initialUISetup(); // From ui.js

    const submitButton = document.getElementById('submitBtn');
    const quizForm = document.getElementById('quizForm');

    if (submitButton && quizForm) {
        submitButton.addEventListener('click', function(event) {
            event.preventDefault();

            clearPreviousResults(); // From ui.js - clears results and AI feedback, hides them

            const { answers: selectedAnswers, allAnswered } = getSelectedAnswers(quizForm, NUMBER_OF_QUESTIONS); // From ui.js

            if (!allAnswered) {
                displayErrorMessage("Please answer all questions before submitting."); // From ui.js
                return;
            }

            // Calculate scores using functions from scoring.js
            const rawScores = calculateRawScores(selectedAnswers); // from scoring.js

            // Prepare levels for display and feedback
            const currentCompetencyLevels = {};
            for (const competencyName of COMPETENCY_ORDER) {
                if (rawScores.hasOwnProperty(competencyName)) {
                    currentCompetencyLevels[competencyName] = getCompetencyLevel(rawScores[competencyName]); // from scoring.js
                }
            }

            // Display numerical results using ui.js
            displayNumericalResults(rawScores, currentCompetencyLevels, COMPETENCY_ORDER, COMPETENCY_KOREAN_NAMES); // from ui.js

            // Generate and display AI feedback text using feedback.js and ui.js
            const feedbackText = generateAIFeedbackText(
                rawScores,
                currentCompetencyLevels,
                COMPETENCY_ORDER,
                COMPETENCY_KOREAN_NAMES,
                getLevelThresholds() // Use the getter from scoring.js
            ); // from feedback.js

            displayAIfeedback(feedbackText); // from ui.js

            console.log("Processing complete. Scores and feedback displayed.");
        });
    } else {
        console.error("Submit button or quiz form not found!");
    }
});
