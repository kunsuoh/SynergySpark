// script.js for SynergySpark

document.addEventListener('DOMContentLoaded', () => {
    console.log("SynergySpark script loaded and DOM fully parsed.");

    let competencyScores = {
        INSIGHT: 0, FLEXEM: 0, VOYAGE: 0,
        BRIDGE: 0, SPARKS: 0, ANCHOR: 0
    };

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

    const competencyOrder = ["INSIGHT", "FLEXEM", "VOYAGE", "BRIDGE", "SPARKS", "ANCHOR"];
    const competencyKoreanNames = {
        INSIGHT: "통찰력", FLEXEM: "유연성/공감", VOYAGE: "추진력",
        BRIDGE: "협력/소통", SPARKS: "동기부여", ANCHOR: "안정감"
    };


    function getCompetencyLevel(score) {
        for (const threshold of levelThresholds) {
            if (score >= threshold.min && score <= threshold.max) {
                return { level: threshold.level, description: threshold.description };
            }
        }
        if (score < levelThresholds[0].min) return { level: 1, description: levelThresholds[0].description };
        return { level: 0, description: "Undefined" };
    }

    function getDetailedLevelDescription(level, competency) {
        const compKorean = competencyKoreanNames[competency] || competency;
        if (competency === "INSIGHT") {
            if (level === 1) return `${compKorean} 역량은 기본적인 문제 인식 단계를 의미합니다.`;
            if (level === 2) return `${compKorean}을 활용하여 문제의 핵심을 파악하고 대안을 탐색하는 단계입니다.`;
            if (level === 3) return `다양한 상황에서 ${compKorean}을 능숙하게 활용하며, 타인에게 긍정적인 영향을 미칩니다.`;
            if (level === 4) return `복잡한 문제에 대해 뛰어난 ${compKorean}을 발휘하여 혁신적인 해결책을 제시하고 팀의 방향을 선도합니다.`;
        }
        if (competency === "FLEXEM") {
            if (level === 1) return `새로운 상황이나 타인의 의견에 대해 기본적인 수용성을 갖추고 있습니다.`;
            if (level === 2) return `변화하는 상황에 적응하며, 타인의 감정을 이해하고 적절히 반응하려 노력합니다.`;
            if (level === 3) return `다양한 관점을 적극적으로 수용하고, 타인과 깊이 공감하며 원활한 관계를 구축합니다.`;
            if (level === 4) return `뛰어난 ${compKorean}으로 예상치 못한 변화에도 팀을 안정적으로 이끌고, 높은 수준의 공감 능력으로 팀워크를 극대화합니다.`;
        }
        return `${compKorean} Level ${level}에 대한 일반적인 설명입니다. (상세 내용 추가 필요)`;
    }

    function getCompetencyStrengthDescription(competency, level) {
        const compKorean = competencyKoreanNames[competency] || competency;
        if (competency === "SPARKS") {
            if (level >= 3) return `새로운 아이디어를 적극적으로 제안하고 프로젝트에 추진력을 더하는 능력이 매우 뛰어납니다. 팀에 긍정적인 에너지를 불어넣고, 다른 사람들에게 영감을 줍니다.`;
            return `팀에 활력을 불어넣고 새로운 시도를 장려하는 ${compKorean}을 보유하고 있습니다.`;
        }
        if (competency === "ANCHOR") {
             if (level >= 3) return `맡은 바를 흔들림 없이 책임감 있게 수행하며, 어려운 상황에서도 팀에 강력한 안정감을 제공합니다. 동료들은 당신을 깊이 신뢰하고 의지할 수 있습니다.`;
             return `꾸준함과 책임감으로 팀의 안정적인 운영에 기여합니다.`;
        }
        return `Level ${level}의 ${compKorean} 역량은 팀에 긍정적인 기여를 합니다. (예: [${compKorean} 관련 구체적인 강점 예시])`;
    }

    function getCompetencyGrowthSuggestion(competency) {
        const compKorean = competencyKoreanNames[competency] || competency;
        if (competency === "BRIDGE") {
            return `팀원들과의 관계 증진 및 의견 차이 조율에 조금 더 신경을 쓴다면 팀워크를 더욱 강화할 수 있습니다. 예를 들어, 정기적인 개별 대화를 시도하거나 회의 시 적극적으로 다른 사람의 의견을 연결하려는 노력이 도움이 될 것입니다.`;
        }
        if (competency === "VOYAGE") {
            return `때로는 계획을 세우는 데 좀 더 시간을 투자하거나, 실행 전 다양한 가능성을 충분히 검토하는 것이 ${compKorean} 역량 발휘에 도움이 될 수 있습니다.`;
        }
        return `[${compKorean} 역량 관련 구체적인 발전 방향 제안: 예를 들어, 관련 서적 읽기, 스터디 참여, 실제 업무에서 적용 노력 등]`;
    }


    function generateAIFeedback(currentScores, currentLevels) {
        let profileString = "";
        for (const comp of competencyOrder) {
            profileString += comp.charAt(0) + currentLevels[comp].level;
        }

        let prompt = `너는 협업 역량 분석 전문가이다. 다음은 사용자 A의 6가지 협업 역량 수준이다 (각 역량은 1-4레벨):\n`;
        for (const comp of competencyOrder) {
            prompt += `- ${competencyKoreanNames[comp] || comp} (${comp}): Level ${currentLevels[comp].level} (${currentLevels[comp].description} - ${getDetailedLevelDescription(currentLevels[comp].level, comp)})\n`;
        }
        prompt += `\n이 정보를 바탕으로 사용자 A의 종합적인 협업 스타일, 주요 강점 (1-2가지), 성장 기회 (1-2가지), 팀 시너지 극대화 팁, 그리고 잠재적 갈등 요소를 포함한 상세하고 개인화된 분석 결과를 한국어로 작성해줘. 결과는 긍정적이고 건설적인 톤으로 작성하며, 사용자가 자신의 특성을 이해하고 발전시키는 데 도움이 되도록 구체적인 예시나 행동 제안을 포함해줘. Profile: ${profileString}`;
        console.log("Generated AI Prompt:", prompt);

        let feedbackText = "";
        let highestComp = { name: "", score: -1, level: 0, description: "" };
        let lowestComp = { name: "", score: Infinity, level: 0, description: "" };

        for (const comp of competencyOrder) {
            const score = currentScores[comp];
            const levelInfo = currentLevels[comp];
            if (score > highestComp.score) {
                highestComp = { name: comp, score: score, level: levelInfo.level, description: levelInfo.description };
            }
            if (score < lowestComp.score) {
                lowestComp = { name: comp, score: score, level: levelInfo.level, description: levelInfo.description };
            }
        }

        if (highestComp.name === "SPARKS" && lowestComp.name === "BRIDGE") {
            feedbackText = `종합적인 협업 스타일: 당신은 주도성(${competencyKoreanNames[highestComp.name]})이 매우 뛰어나 팀에 활력을 불어넣지만, 때로는 팀원 간의 연결(${competencyKoreanNames[lowestComp.name]})과 조율에 더 많은 노력이 필요할 수 있는 '창의적 개척가' 유형에 가깝습니다.\n\n`;
            feedbackText += `주요 강점:\n- ${competencyKoreanNames[highestComp.name]} (Level ${highestComp.level} - ${highestComp.description}): ${getCompetencyStrengthDescription(highestComp.name, highestComp.level)}\n\n`;
            feedbackText += `성장 기회:\n- ${competencyKoreanNames[lowestComp.name]} (Level ${lowestComp.level} - ${lowestComp.description}): ${getCompetencyGrowthSuggestion(lowestComp.name)}\n\n`;
            feedbackText += `팀 내 시너지 극대화를 위한 팁:\n당신의 주도성을 활용하여 새로운 방향을 제시하되, ${competencyKoreanNames["BRIDGE"]} 역량이 높은 동료와 협력하여 아이디어를 현실화하고 팀 전체의 동의를 얻어보세요.\n\n`;
            feedbackText += `주의할 점 또는 잠재적 갈등 요소:\n때로는 너무 앞서나가거나, 팀원들의 의견을 충분히 수렴하지 못해 오해를 살 수 있습니다. 의식적으로 소통하고 조율하려는 노력이 필요합니다.`;
        } else if (highestComp.name === "ANCHOR") {
            feedbackText = `종합적인 협업 스타일: 당신은 안정감(${competencyKoreanNames[highestComp.name]})을 바탕으로 팀의 중심을 잡아주는 '믿음직한 지원가' 유형입니다. 꾸준함과 책임감이 돋보입니다.\n\n`;
            feedbackText += `주요 강점:\n- ${competencyKoreanNames[highestComp.name]} (Level ${highestComp.level} - ${highestComp.description}): ${getCompetencyStrengthDescription(highestComp.name, highestComp.level)}\n\n`;
            feedbackText += `성장 기회:\n- ${competencyKoreanNames[lowestComp.name]} (Level ${lowestComp.level} - ${lowestComp.description}): ${getCompetencyGrowthSuggestion(lowestComp.name)}\n\n`;
            feedbackText += `팀 내 시너지 극대화를 위한 팁:\n당신의 안정감을 바탕으로 다른 팀원들이 새로운 시도를 할 수 있도록 지지해주세요. 특히 변동성이 큰 상황에서 당신의 역할이 중요합니다.\n\n`;
            feedbackText += `주의할 점 또는 잠재적 갈등 요소:\n변화에 대한 수용 속도가 다소 느릴 수 있습니다. 새로운 아이디어나 방식에 대해 열린 마음을 갖는 것이 도움이 될 수 있습니다.`;
        } else {
            feedbackText = `당신의 협업 프로필(${profileString})은 독특한 강점과 성장 기회를 가지고 있습니다.\n\n`;
            feedbackText += `주요 강점:\n- ${competencyKoreanNames[highestComp.name]} (Level ${highestComp.level} - ${highestComp.description}): ${getCompetencyStrengthDescription(highestComp.name, highestComp.level)}\n\n`;
            feedbackText += `성장 기회:\n- ${competencyKoreanNames[lowestComp.name]} (Level ${lowestComp.level} - ${lowestComp.description}): ${getCompetencyGrowthSuggestion(lowestComp.name)}\n\n`;
            feedbackText += `팀 내 시너지 극대화를 위한 팁:\n자신의 강점을 적극 활용하고, 부족한 부분은 팀원들과의 협력을 통해 보완해나가세요.\n\n`;
            feedbackText += `주의할 점 또는 잠재적 갈등 요소:\n[${competencyKoreanNames[lowestComp.name]} 또는 ${competencyKoreanNames[highestComp.name]} 관련 일반적인 주의점]\n\n`;
            feedbackText += `(AI 시스템이 준비되면 더욱 상세하고 개인화된 분석을 제공할 예정입니다.)`;
        }

        document.getElementById('aiFeedbackText').innerText = feedbackText;
        document.getElementById('aiFeedback').style.display = 'block';
    }


    function displayResults(scores) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) {
            console.error("Results div not found!");
            return;
        }
        resultsDiv.innerHTML = '';

        const titleElement = document.createElement('h2');
        titleElement.textContent = "Your SynergySpark Profile";
        resultsDiv.appendChild(titleElement);

        let currentCompetencyLevels = {};

        for (const competencyName of competencyOrder) {
            if (scores.hasOwnProperty(competencyName)) {
                const rawScore = scores[competencyName];
                const levelInfo = getCompetencyLevel(rawScore);
                currentCompetencyLevels[competencyName] = levelInfo;

                const itemDiv = document.createElement('div');
                itemDiv.classList.add('competency-item');

                const competencyText = document.createElement('p');
                competencyText.innerHTML = `<strong>${competencyKoreanNames[competencyName] || competencyName}:</strong> Level ${levelInfo.level} (${levelInfo.description}) - Raw Score: ${rawScore.toFixed(2)}`;
                itemDiv.appendChild(competencyText);
                resultsDiv.appendChild(itemDiv);
            }
        }
        resultsDiv.style.display = 'block';

        generateAIFeedback(scores, currentCompetencyLevels);
    }

    const submitButton = document.getElementById('submitBtn');
    const quizForm = document.getElementById('quizForm');

    if (submitButton) {
        submitButton.addEventListener('click', function(event) {
            event.preventDefault();
            const aiFeedbackDiv = document.getElementById('aiFeedback');
            if (aiFeedbackDiv) aiFeedbackDiv.style.display = 'none';
            calculateScores();
        });
    } else {
        console.error("Submit button not found!");
    }

    function calculateScores() {
        for (let competency in competencyScores) {
            competencyScores[competency] = 0;
        }

        const numberOfQuestions = 10;
        let allAnswered = true;
        for (let i = 1; i <= numberOfQuestions; i++) {
            const questionName = 'q' + i;
            const selectedOption = quizForm.elements[questionName];

            if (selectedOption && selectedOption.value) {
                const selectedValue = selectedOption.value;
                const questionScores = answerMappings[questionName][selectedValue];
                if (questionScores) {
                    for (let competency in questionScores) {
                        if (competencyScores.hasOwnProperty(competency)) {
                            competencyScores[competency] += questionScores[competency];
                        }
                    }
                }
            } else {
                allAnswered = false;
                // No need to break, just flag
            }
        }

        if (!allAnswered) {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '<p class="error-message">Please answer all questions before submitting.</p>';
            resultsDiv.style.display = 'block';
            const aiFeedbackDiv = document.getElementById('aiFeedback');
            if (aiFeedbackDiv) aiFeedbackDiv.style.display = 'none';
            return; // Stop further processing
        }

        console.log("Final Competency Scores:", competencyScores);
        displayResults(competencyScores);
    }

    // Initial state management for aiFeedback div (ensure it's hidden)
    const aiFeedbackDiv = document.getElementById('aiFeedback');
    if (aiFeedbackDiv) {
        aiFeedbackDiv.style.display = 'none';
    }
});
