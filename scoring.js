// scoring.js

const answerMappings = {
    q1: { A: { BRIDGE: 1, SPARKS: 0.5, VOYAGE: 0.5 }, B: { BRIDGE: 1, INSIGHT: 0.5, FLEXEM: 0.25 }, C: { INSIGHT: 1, ANCHOR: 0.5, VOYAGE: 0.25 }, D: { FLEXEM: 0.5, ANCHOR: 1, INSIGHT: 0.25 }},
    q2: { A: { FLEXEM: 1, BRIDGE: 0.5, INSIGHT: 0.25 }, B: { SPARKS: 0.5, VOYAGE: 0.5, ANCHOR: 0.25}, C: { INSIGHT: 0.75, BRIDGE: 0.75, FLEXEM: 0.5 }, D: { ANCHOR: 0.75, FLEXEM: 0.5, BRIDGE: 0.25 }},
    q3: { A: { FLEXEM: 1, BRIDGE: 0.75, SPARKS: 0.25 }, B: { BRIDGE: 0.75, ANCHOR: 0.5, SPARKS: 0.25 }, C: { INSIGHT: 0.5, FLEXEM: 0.5, VOYAGE: 0.25 }, D: { ANCHOR: 1, FLEXEM: 0.25 }},
    q4: { A: { VOYAGE: 1, SPARKS: 0.75, INSIGHT: 0.5 }, B: { INSIGHT: 0.75, ANCHOR: 0.75, VOYAGE: 0.25}, C: { SPARKS: 1, BRIDGE: 0.75, FLEXEM: 0.25 }, D: { BRIDGE: 0.75, VOYAGE: 0.5, INSIGHT: 0.25 }},
    q5: { A: { BRIDGE: 1, FLEXEM: 0.75, INSIGHT: 0.25 }, B: { SPARKS: 0.75, FLEXEM: 0.5, ANCHOR: 0.25 }, C: { VOYAGE: 0.5, ANCHOR: 0.5, SPARKS: 0.25}, D: { ANCHOR: 1, FLEXEM: 0.25 }},
    q6: { A: { VOYAGE: 1, SPARKS: 0.5, FLEXEM: 0.25 }, B: { ANCHOR: 1, INSIGHT: 0.75, VOYAGE: 0.25 }, C: { BRIDGE: 0.75, FLEXEM: 0.5, ANCHOR: 0.25 }, D: { INSIGHT: 0.75, VOYAGE: 0.5, ANCHOR: 0.5 }},
    q7: { A: { INSIGHT: 1, SPARKS: 0.5, VOYAGE: 0.25 }, B: { BRIDGE: 1, SPARKS: 0.75, FLEXEM: 0.5 }, C: { ANCHOR: 1, VOYAGE: 0.5, BRIDGE: 0.25 }, D: { FLEXEM: 0.75, INSIGHT: 0.5, SPARKS: 0.25}},
    q8: { A: { INSIGHT: 0.75, BRIDGE: 0.75, FLEXEM: 0.5 }, B: { SPARKS: 1, FLEXEM: 0.75, BRIDGE: 0.25 }, C: { ANCHOR: 1, INSIGHT: 0.75, VOYAGE: 0.25 }, D: { VOYAGE: 0.75, ANCHOR: 0.5, INSIGHT: 0.25 }},
    q9: { A: { VOYAGE: 1, SPARKS: 0.75, FLEXEM: 0.5 }, B: { INSIGHT: 1, ANCHOR: 0.75, FLEXEM: 0.25 }, C: { BRIDGE: 1, SPARKS: 0.5, FLEXEM: 0.25 }, D: { ANCHOR: 1, FLEXEM: 0.25 }},
    q10: { A: { INSIGHT: 1, FLEXEM: 0.75, ANCHOR: 0.25 }, B: { VOYAGE: 0.5, SPARKS: 0.5, ANCHOR: 0.25}, C: { FLEXEM: 1, SPARKS: 0.5, INSIGHT: 0.25 }, D: { FLEXEM: 0.75, BRIDGE: 0.5, ANCHOR: 0.25 }}
};

const levelThresholds = [
    { level: 1, min: 0, max: 2, description: "Foundational" },
    { level: 2, min: 2.01, max: 4, description: "Applying" },
    { level: 3, min: 4.01, max: 6, description: "Proficient" },
    { level: 4, min: 6.01, max: Infinity, description: "Exemplary" }
];

// This object will store the actual scores.
let competencyScoresInternal = { // Renamed to avoid conflict if competencyScores is used elsewhere globally
    INSIGHT: 0, FLEXEM: 0, VOYAGE: 0,
    BRIDGE: 0, SPARKS: 0, ANCHOR: 0
};

function getLevelThresholds() {
    // Return a copy to prevent external modification if it were mutable
    return JSON.parse(JSON.stringify(levelThresholds));
}

function getCompetencyLevel(score) {
    const thresholds = getLevelThresholds(); // Use the getter to ensure consistency if it were dynamic
    for (const threshold of thresholds) {
        if (score >= threshold.min && score <= threshold.max) {
            return { level: threshold.level, description: threshold.description };
        }
    }
    if (score < thresholds[0].min) return { level: 1, description: thresholds[0].description };
    return { level: 0, description: "Undefined" };
}

function resetCompetencyScores() {
    for (let competency in competencyScoresInternal) {
        competencyScoresInternal[competency] = 0;
    }
}

function calculateRawScores(selectedAnswers) {
    resetCompetencyScores();
    for (const questionName in selectedAnswers) {
        const selectedValue = selectedAnswers[questionName];
        if (selectedValue && answerMappings[questionName] && answerMappings[questionName][selectedValue]) {
            const questionScores = answerMappings[questionName][selectedValue];
            for (let competency in questionScores) {
                if (competencyScoresInternal.hasOwnProperty(competency)) {
                    competencyScoresInternal[competency] += questionScores[competency];
                }
            }
        }
    }
    return { ...competencyScoresInternal }; // Return a copy
}

// getCurrentScores might not be strictly needed if calculateRawScores returns the scores
// and main.js uses that returned value. But keeping it doesn't harm.
function getCurrentScores() {
    return { ...competencyScoresInternal };
}
