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
    showAIFeedbackLoading(); // From ui.js - Show loading state BEFORE fetch

    try {
        const response = await fetch('/api/assessments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assessmentData),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Failed to send assessment data to backend:', responseData.message || response.statusText);
            const errorMsg = responseData.message || \`서버 응답 오류 (\${response.status})\`; // Corrected template literal
            displayAIFeedbackError(\`AI 분석 중 다음 오류 발생: \${errorMsg}\`); // From ui.js
            return;
        }

        console.log('Assessment data sent successfully:', responseData);

        if (responseData.aiFeedback) {
            // Check if the feedback itself indicates an error from backend's AI generation attempt
            if (responseData.aiFeedback.startsWith("AI 피드백을 생성하는 중 오류가 발생했습니다") ||
                responseData.aiFeedback.startsWith("AI feedback generation is currently unavailable") ||
                responseData.aiFeedback.startsWith("AI 피드백 생성 중 안전 문제로 인해 내용이 차단되었습니다")) {
                displayAIFeedbackError(responseData.aiFeedback); // Display the backend's specific AI error
            } else {
                displayAIfeedback(responseData.aiFeedback); // From ui.js - Display successful AI feedback
            }
        } else {
            displayAIFeedbackError("AI 피드백을 받지 못했습니다. 서버로부터 피드백이 전달되지 않았습니다."); // From ui.js
        }

    } catch (error) {
        console.error('Error sending assessment data:', error);
        displayAIFeedbackError('네트워크 오류 또는 예기치 않은 문제로 AI 분석 요청에 실패했습니다. 인터넷 연결을 확인해주세요.'); // From ui.js
    }
}
// --- End of backend communication function ---

function generateProfileString(levels) {
    let profileStr = "";
    COMPETENCY_ORDER.forEach(comp => {
        if (levels[comp] && typeof levels[comp].level !== 'undefined') {
            profileStr += comp.charAt(0) + levels[comp].level;
        } else {
            console.warn(\`Level not found for competency \${comp} in generateProfileString. Using '0'.\`); // Corrected template literal
            profileStr += comp.charAt(0) + '0';
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
        submitButton.addEventListener('click', async function(event) {
            event.preventDefault();

            clearPreviousResults(); // From ui.js - also calls hideAIfeedback()

            const { answers: selectedRawAnswers, allAnswered } = getSelectedAnswers(quizForm, NUMBER_OF_QUESTIONS); // From ui.js

            if (!allAnswered) {
                // displayErrorMessage is for the #results div. We don't want to use that if we're about to show AI feedback.
                // For this case, it's better to use the AI feedback display area for consistency if the error is about AI.
                // However, this is a form validation error, not an AI error. So, displayErrorMessage is appropriate here.
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

            console.log("Frontend processing for scores complete. Sending data to backend for AI feedback...");

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
                raw_answers: selectedRawAnswers
            };

            await sendDataToBackend(assessmentToSave);

            console.log("Backend data processing and AI feedback display initiated.");
        });
    } else {
        console.error("Submit button or quiz form not found!");
    }
});
