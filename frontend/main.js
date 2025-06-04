// main.js

// Constants that might be shared or passed to other modules
const COMPETENCY_ORDER = ["INSIGHT", "FLEXEM", "VOYAGE", "BRIDGE", "SPARKS", "ANCHOR"];
const COMPETENCY_KOREAN_NAMES = {
    INSIGHT: "통찰력", FLEXEM: "유연성/공감", VOYAGE: "추진력",
    BRIDGE: "협력/소통", SPARKS: "동기부여", ANCHOR: "안정감"
};
const NUMBER_OF_QUESTIONS = 10;

// --- Function to send data to backend ---
async function sendDataToBackend(assessmentData) {
    try {
        const response = await fetch('/api/assessments', { // Assumes backend is on the same origin or proxied
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assessmentData),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Failed to send assessment data to backend:', responseData.message || response.statusText);
            // Using alert for simplicity as requested, could be replaced by a ui.js function
            alert(`Error saving data: ${responseData.message || response.statusText}`);
            return;
        }

        console.log('Assessment data sent successfully:', responseData);
        // Optional: display a non-intrusive success message
        // e.g., ui.displaySuccessToast("Assessment saved!");

    } catch (error) {
        console.error('Error sending assessment data:', error);
        alert('An unexpected error occurred while trying to save your assessment. Please check the console.');
    }
}
// --- End of backend communication function ---

// Helper function to generate profile string (moved here for direct use in main)
function generateProfileString(levels) {
    let profileStr = "";
    COMPETENCY_ORDER.forEach(comp => {
        if (levels[comp] && typeof levels[comp].level !== 'undefined') {
            profileStr += comp.charAt(0) + levels[comp].level;
        } else {
            console.warn(`Level not found for competency ${comp} in generateProfileString. Using '0'.`);
            profileStr += comp.charAt(0) + '0'; // Default if level is missing
        }
    });
    return profileStr;
}


document.addEventListener('DOMContentLoaded', () => {
    console.log("SynergySpark main.js loaded and DOM fully parsed.");
    initialUISetup(); // From ui.js

    const submitButton = document.getElementById('submitBtn');
    const quizForm = document.getElementById('quizForm');

    if (submitButton && quizForm) {
        submitButton.addEventListener('click', async function(event) { // Made async for await sendDataToBackend
            event.preventDefault();

            clearPreviousResults(); // From ui.js

            const { answers: selectedRawAnswers, allAnswered } = getSelectedAnswers(quizForm, NUMBER_OF_QUESTIONS); // From ui.js

            if (!allAnswered) {
                displayErrorMessage("Please answer all questions before submitting."); // From ui.js
                return;
            }

            const rawScores = calculateRawScores(selectedRawAnswers); // from scoring.js

            const currentCompetencyLevels = {};
            for (const competencyName of COMPETENCY_ORDER) {
                if (rawScores.hasOwnProperty(competencyName)) {
                    currentCompetencyLevels[competencyName] = getCompetencyLevel(rawScores[competencyName]); // from scoring.js
                }
            }

            displayNumericalResults(rawScores, currentCompetencyLevels, COMPETENCY_ORDER, COMPETENCY_KOREAN_NAMES); // from ui.js

            const feedbackText = generateAIFeedbackText(
                rawScores,
                currentCompetencyLevels,
                COMPETENCY_ORDER,
                COMPETENCY_KOREAN_NAMES,
                getLevelThresholds()
            ); // from feedback.js

            displayAIfeedback(feedbackText); // from ui.js

            console.log("Frontend processing complete. Scores and feedback displayed.");

            // --- Prepare and send data to backend ---
            const profileString = generateProfileString(currentCompetencyLevels);

            const assessmentToSave = {
                insight_score: rawScores['INSIGHT'],
                insight_level: currentCompetencyLevels['INSIGHT'].level,
                flexem_score: rawScores['FLEXEM'],
                flexem_level: currentCompetencyLevels['FLEXEM'].level,
                voyage_score: rawScores['VOYAGE'],
                voyage_level: currentCompetencyLevels['VOYAGE'].level,
                bridge_score: rawScores['BRIDGE'],
                bridge_level: currentCompetencyLevels['BRIDGE'].level,
                sparks_score: rawScores['SPARKS'],
                sparks_level: currentCompetencyLevels['SPARKS'].level,
                anchor_score: rawScores['ANCHOR'],
                anchor_level: currentCompetencyLevels['ANCHOR'].level,
                profile_string: profileString,
                raw_answers: selectedRawAnswers // from getSelectedAnswers above
            };

            console.log("Data prepared for backend:", assessmentToSave);
            await sendDataToBackend(assessmentToSave); // Call the function to send data
            // --- End of backend data sending ---
        });
    } else {
        console.error("Submit button or quiz form not found!");
    }
});
