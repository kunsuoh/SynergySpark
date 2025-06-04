// feedback.js

function getDetailedLevelDescription(level, competency, competencyKoreanNames, levelThresholds) {
    const compKorean = competencyKoreanNames[competency] || competency;
    // Find the specific level description from levelThresholds to use if more generic
    const generalLevelDesc = levelThresholds.find(t => t.level === level)?.description || "N/A";

    if (competency === "INSIGHT") {
        if (level === 1) return `${compKorean} (${generalLevelDesc}): 기본적인 문제 인식을 바탕으로 상황을 이해하려는 초기 단계입니다.`;
        if (level === 2) return `${compKorean} (${generalLevelDesc}): 문제의 핵심을 파악하고 대안을 탐색하며, 분석적 사고를 적용하기 시작합니다.`;
        if (level === 3) return `${compKorean} (${generalLevelDesc}): 다양한 상황에서 통찰력을 능숙하게 활용하며, 데이터 기반의 합리적 판단을 내립니다.`;
        if (level === 4) return `${compKorean} (${generalLevelDesc}): 복잡하고 모호한 문제에 대해 뛰어난 통찰을 발휘하여, 혁신적인 해결책과 전략적 방향을 제시합니다.`;
    }
    if (competency === "FLEXEM") {
        if (level === 1) return `${compKorean} (${generalLevelDesc}): 새로운 상황이나 타인의 의견에 대해 기본적인 수용성을 갖추고 있으며, 지시에 따라 적응하려 합니다.`;
        if (level === 2) return `${compKorean} (${generalLevelDesc}): 변화하는 환경에 비교적 잘 적응하며, 타인의 감정을 이해하고 적절히 반응하려 노력합니다.`;
        if (level === 3) return `${compKorean} (${generalLevelDesc}): 다양한 관점을 적극적으로 수용하고, 타인과 깊이 공감하며 효과적인 협력 관계를 구축합니다.`;
        if (level === 4) return `${compKorean} (${generalLevelDesc}): 뛰어난 유연성으로 예상치 못한 변화에도 팀을 안정적으로 이끌고, 높은 수준의 공감 능력으로 팀워크를 극대화합니다.`;
    }
    // Generic fallback if specific competency descriptions are not available for this level
    return `${compKorean} (${generalLevelDesc}): Level ${level}에 대한 표준 설명입니다. 이 역량은 현재 ${generalLevelDesc} 단계에 있습니다.`;
}

function getCompetencyStrengthDescription(competency, level, competencyKoreanNames) {
    const compKorean = competencyKoreanNames[competency] || competency;
    if (competency === "SPARKS") {
        if (level >= 3) return `새로운 아이디어를 적극적으로 제안하고 프로젝트에 추진력을 더하는 능력이 매우 뛰어납니다. 팀에 긍정적인 에너지를 불어넣고, 다른 사람들에게 영감을 주어 함께 목표를 향해 나아가도록 독려합니다.`;
        return `팀에 활력을 불어넣고 새로운 시도를 장려하는 ${compKorean}을(를) 보유하고 있습니다. 주변에 긍정적 분위기를 조성하는 경향이 있습니다.`;
    }
    if (competency === "ANCHOR") {
         if (level >= 3) return `맡은 바를 흔들림 없이 책임감 있게 수행하며, 어려운 상황에서도 팀에 강력한 안정감을 제공합니다. 동료들은 당신을 깊이 신뢰하고 의지하며, 당신의 꾸준함이 팀의 기반이 됩니다.`;
         return `꾸준함과 책임감으로 팀의 안정적인 운영에 기여하며, 예측 가능한 환경을 선호하고 일관성을 중시합니다.`;
    }
    if (competency === "INSIGHT" && level >=3) {
        return `문제의 본질을 꿰뚫어보고 논리적인 해결책을 제시하는 데 능숙합니다. 데이터와 사실에 기반한 분석으로 팀의 의사결정을 돕습니다.`;
    }
    return `Level ${level}의 ${compKorean} 역량은 팀에 중요한 기여를 합니다. (예: [${compKorean} 관련 구체적인 강점 예시를 추가할 수 있습니다.])`;
}

function getCompetencyGrowthSuggestion(competency, competencyKoreanNames) {
    const compKorean = competencyKoreanNames[competency] || competency;
    if (competency === "BRIDGE") {
        return `팀원들과의 관계 증진 및 의견 차이 조율에 조금 더 주의를 기울이면 팀워크를 더욱 강화할 수 있습니다. 예를 들어, 정기적인 개별 대화를 통해 서로의 생각을 공유하거나, 회의 시 적극적으로 다른 사람의 의견을 연결하고 종합하려는 노력이 도움이 될 것입니다.`;
    }
    if (competency === "VOYAGE") {
        return `때로는 실행에 앞서 계획을 세우는 데 충분한 시간을 투자하거나, 다양한 가능성을 미리 검토하는 것이 ${compKorean} 역량을 더욱 효과적으로 발휘하는 데 도움이 될 수 있습니다. 목표를 향한 열정은 훌륭하지만, 때로는 속도 조절이 필요할 수 있습니다.`;
    }
    if (competency === "FLEXEM" ) {
        return `다양한 관점을 이해하려는 노력과 함께, 새로운 변화에 대한 개방성을 더욱 키우면 좋습니다. 때로는 익숙하지 않은 방식도 시도해보는 것이 ${compKorean} 역량 강화에 도움이 됩니다.`;
    }
    return `[${compKorean} 역량 관련 구체적인 발전 방향 제안: 예를 들어, 관련 교육 수강, 멘토링 활용, 실제 업무에서 의식적인 적용 노력 등을 통해 발전시킬 수 있습니다.]`;
}

function generateAIFeedbackText(currentScores, currentLevels, competencyOrder, competencyKoreanNames, levelThresholds) {
    let profileString = "";
    for (const comp of competencyOrder) {
        profileString += comp.charAt(0) + currentLevels[comp].level;
    }

    // AI Prompt Generation (for logging)
    let prompt = `너는 협업 역량 분석 전문가이다. 다음은 사용자 A의 6가지 협업 역량 수준이다 (각 역량은 1-4레벨):\n`;
    for (const comp of competencyOrder) {
        prompt += `- ${competencyKoreanNames[comp] || comp} (${comp}): Level ${currentLevels[comp].level} (${currentLevels[comp].description} - ${getDetailedLevelDescription(currentLevels[comp].level, comp, competencyKoreanNames, levelThresholds)})\n`;
    }
    prompt += `\n이 정보를 바탕으로 사용자 A의 종합적인 협업 스타일, 주요 강점 (1-2가지), 성장 기회 (1-2가지), 팀 시너지 극대화 팁, 그리고 잠재적 갈등 요소를 포함한 상세하고 개인화된 분석 결과를 한국어로 작성해줘. 결과는 긍정적이고 건설적인 톤으로 작성하며, 사용자가 자신의 특성을 이해하고 발전시키는 데 도움이 되도록 구체적인 예시나 행동 제안을 포함해줘. Profile: ${profileString}`;
    console.log("Generated AI Prompt (from feedback.js):", prompt);


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

    // Simplified template logic
    if (highestComp.name === "SPARKS" && lowestComp.name === "BRIDGE") {
        feedbackText = `종합적인 협업 스타일: 당신은 주도성(${competencyKoreanNames[highestComp.name]})이 매우 뛰어나 팀에 활력을 불어넣지만, 때로는 팀원 간의 연결(${competencyKoreanNames[lowestComp.name]})과 조율에 더 많은 노력이 필요할 수 있는 '창의적 개척가' 유형에 가깝습니다.\n\n`;
        feedbackText += `주요 강점:\n- ${competencyKoreanNames[highestComp.name]} (Level ${highestComp.level} - ${highestComp.description}): ${getCompetencyStrengthDescription(highestComp.name, highestComp.level, competencyKoreanNames)}\n\n`;
        feedbackText += `성장 기회:\n- ${competencyKoreanNames[lowestComp.name]} (Level ${lowestComp.level} - ${lowestComp.description}): ${getCompetencyGrowthSuggestion(lowestComp.name, competencyKoreanNames)}\n\n`;
        feedbackText += `팀 내 시너지 극대화를 위한 팁:\n당신의 주도성을 활용하여 새로운 방향을 제시하되, ${competencyKoreanNames["BRIDGE"]} 역량이 높은 동료와 협력하여 아이디어를 현실화하고 팀 전체의 동의를 얻어보세요.\n\n`;
        feedbackText += `주의할 점 또는 잠재적 갈등 요소:\n때로는 너무 앞서나가거나, 팀원들의 의견을 충분히 수렴하지 못해 오해를 살 수 있습니다. 의식적으로 소통하고 조율하려는 노력이 필요합니다.`;
    } else if (highestComp.name === "ANCHOR") {
        feedbackText = `종합적인 협업 스타일: 당신은 안정감(${competencyKoreanNames[highestComp.name]})을 바탕으로 팀의 중심을 잡아주는 '믿음직한 지원가' 유형입니다. 꾸준함과 책임감이 돋보입니다.\n\n`;
        feedbackText += `주요 강점:\n- ${competencyKoreanNames[highestComp.name]} (Level ${highestComp.level} - ${highestComp.description}): ${getCompetencyStrengthDescription(highestComp.name, highestComp.level, competencyKoreanNames)}\n\n`;
        feedbackText += `성장 기회:\n- ${competencyKoreanNames[lowestComp.name]} (Level ${lowestComp.level} - ${lowestComp.description}): ${getCompetencyGrowthSuggestion(lowestComp.name, competencyKoreanNames)}\n\n`;
        feedbackText += `팀 내 시너지 극대화를 위한 팁:\n당신의 안정감을 바탕으로 다른 팀원들이 새로운 시도를 할 수 있도록 지지해주세요. 특히 변동성이 큰 상황에서 당신의 역할이 중요합니다.\n\n`;
        feedbackText += `주의할 점 또는 잠재적 갈등 요소:\n변화에 대한 수용 속도가 다소 느릴 수 있습니다. 새로운 아이디어나 방식에 대해 열린 마음을 갖는 것이 도움이 될 수 있습니다.`;
    } else { // Default feedback
        feedbackText = `당신의 협업 프로필(${profileString})은 다음과 같은 특징을 보입니다.\n\n`;
        feedbackText += `주요 강점:\n- ${competencyKoreanNames[highestComp.name]} (Level ${highestComp.level} - ${highestComp.description}): ${getCompetencyStrengthDescription(highestComp.name, highestComp.level, competencyKoreanNames)}\n\n`;
        if (lowestComp.name !== highestComp.name) { // Avoid showing same for growth if all scores are equal
            feedbackText += `성장 기회:\n- ${competencyKoreanNames[lowestComp.name]} (Level ${lowestComp.level} - ${lowestComp.description}): ${getCompetencyGrowthSuggestion(lowestComp.name, competencyKoreanNames)}\n\n`;
        }
        feedbackText += `팀 내 시너지 극대화를 위한 팁:\n자신의 강점을 적극 활용하고, ${lowestComp.name !== highestComp.name ? competencyKoreanNames[lowestComp.name] + ' 역량이 높은 팀원이나 ' : '' }팀원들과의 협력을 통해 균형을 이루어 나가세요. 예를 들어, [구체적인 협력 방식 제안].\n\n`;
        feedbackText += `주의할 점 또는 잠재적 갈등 요소:\n상황에 따라 [${competencyKoreanNames[highestComp.name]} 또는 ${competencyKoreanNames[lowestComp.name]} 특성이 두드러질 때 발생할 수 있는 일반적인 주의점]을 고려하여 유연하게 대처하는 것이 좋습니다.\n\n`;
        feedbackText += `(AI 시스템이 준비되면 더욱 상세하고 개인화된 분석을 제공할 예정입니다.)`;
    }
    return feedbackText;
}
