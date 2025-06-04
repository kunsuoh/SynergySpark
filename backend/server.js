// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not found. AI feedback will not be generated.");
}
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const geminiModel = genAI ? genAI.getGenerativeModel({ model: "gemini-pro" }) : null;

const dbPath = path.resolve(__dirname, 'database/synergyspark.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        const createTableSql = \`
        CREATE TABLE IF NOT EXISTS assessments (
            assessment_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_identifier TEXT,
            assessment_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            insight_score REAL, insight_level INTEGER,
            flexem_score REAL, flexem_level INTEGER,
            voyage_score REAL, voyage_level INTEGER,
            bridge_score REAL, bridge_level INTEGER,
            sparks_score REAL, sparks_level INTEGER,
            anchor_score REAL, anchor_level INTEGER,
            profile_string TEXT,
            raw_answers TEXT,
            ai_generated_feedback TEXT
        );\`;
        db.run(createTableSql, (err) => {
            if (err) {
                console.error('Error creating assessments table:', err.message);
                return;
            }
            console.log('Assessments table is ready or already exists.');

            db.all("PRAGMA table_info(assessments);", (err, columns) => {
                if (err) {
                    console.error("Error fetching table info for migration check:", err.message);
                    return;
                }
                const hasAIFeedbackColumn = columns.some(col => col.name === 'ai_generated_feedback');
                if (!hasAIFeedbackColumn) {
                    console.log("Adding 'ai_generated_feedback' column to assessments table.");
                    db.run("ALTER TABLE assessments ADD COLUMN ai_generated_feedback TEXT;", (alterErr) => {
                        if (alterErr) {
                            console.error("Error adding 'ai_generated_feedback' column:", alterErr.message);
                        } else {
                            console.log("'ai_generated_feedback' column added successfully.");
                        }
                    });
                }
            });
        });
    });
}

async function generateAIInsights(assessmentData) {
    if (!geminiModel) {
        console.log("Gemini model not initialized (GEMINI_API_KEY missing or invalid). Skipping AI feedback generation.");
        return "AI feedback generation is currently unavailable due to configuration issues.";
    }

    // Detailed Level Descriptions (from original concept)
    const detailedLevelDescriptions = {
        1: "Level 1 (Foundational - 기반 형성 단계): 해당 역량에 대한 기본적인 이해를 갖추고 있으며, 의식적인 노력을 통해 역량을 발휘하려는 시도를 보입니다.",
        2: "Level 2 (Applying - 적용 단계): 해당 역량을 비교적 일관되게 활용하며, 익숙한 상황에서는 효과적으로 역량을 발휘합니다.",
        3: "Level 3 (Proficient - 숙련 단계): 다양한 상황에서 해당 역량을 능숙하게 활용하며, 타인에게 긍정적인 영향을 미칩니다.",
        4: "Level 4 (Exemplary - 리딩 단계): 해당 역량이 체화되어 자연스럽게 발휘되며, 팀 전체의 역량 강화를 이끌고 모범을 보입니다."
    };

    // Competency names in Korean for the prompt
    const competencyKoreanNames = {
        INSIGHT: "INSIGHT (통찰력)",
        FLEXEM: "FLEXEM (유연성)", // Simplified from 유연성/공감 for prompt clarity
        VOYAGE: "VOYAGE (소신/옹호)",
        BRIDGE: "BRIDGE (연결/조율)",
        SPARKS: "SPARKS (주도성/촉매)",
        ANCHOR: "ANCHOR (안정감/지지)"
    };

    let prompt = \`당신은 SynergySpark의 협업 역량 분석 전문 AI입니다. 사용자의 다음 6가지 핵심 협업 역량 수준을 분석해주세요:

\`;
    const competencies = ["INSIGHT", "FLEXEM", "VOYAGE", "BRIDGE", "SPARKS", "ANCHOR"];
    const levels = {
        INSIGHT: assessmentData.insight_level, FLEXEM: assessmentData.flexem_level,
        VOYAGE: assessmentData.voyage_level, BRIDGE: assessmentData.bridge_level,
        SPARKS: assessmentData.sparks_level, ANCHOR: assessmentData.anchor_level
    };

    for (const comp of competencies) {
        const compLevel = levels[comp];
        prompt += \`- **\${competencyKoreanNames[comp]}**: \${detailedLevelDescriptions[compLevel] || '해당 수준에 대한 설명이 없습니다.'}
\`;
    }

    prompt += \`

위 분석을 바탕으로, 다음 항목들을 포함하여 사용자에게 개인화된 협업 역량 분석 결과를 Markdown 형식으로 작성해주세요. 각 항목은 명확한 제목과 함께 설명해주세요:

1.  **종합적인 협업 스타일 및 유형**: 사용자의 전반적인 협업 스타일을 창의적인 이름으로 정의하고 간략히 설명합니다. (예: "창의적 전략가", "안정적인 해결사")
2.  **주요 강점 (Top 2-3)**: 가장 높은 수준의 역량 2-3가지를 중심으로 구체적인 강점을 설명합니다. 실제 행동 예시를 포함하면 좋습니다.
3.  **성장 기회 (개선점)**: 상대적으로 낮은 수준의 역량이나 특정 조합으로 인해 발생할 수 있는 개선점을 구체적이고 실행 가능한 조언과 함께 제시합니다. '약점'보다는 '성장 기회'라는 긍정적인 표현을 사용합니다.
4.  **팀 내 시너지 극대화를 위한 팁**: 다른 유형의 팀원들과 효과적으로 협업하고 시너지를 낼 수 있는 구체적인 소통 및 행동 전략을 제안합니다.
5.  **주의할 점 또는 잠재적 갈등 요소**: 특정 역량 조합으로 인해 팀 내에서 발생할 수 있는 오해나 어려움, 그리고 이를 방지하기 위한 팁을 제공합니다.

결과는 반드시 **긍정적이고 건설적인 어조**로 작성되어야 하며, 사용자가 자신의 특성을 명확히 이해하고 실제 팀 활동에서 발전적인 행동을 취하는 데 도움이 되도록 구체적인 예시나 행동 제안을 포함해주세요.
사용자의 프로필 코드는 \${assessmentData.profile_string} 입니다. 이 코드를 직접 언급할 필요는 없습니다.
Markdown을 사용하여 제목 (예: ### 종합적인 협업 스타일), 목록, 굵은 글씨 등을 명확하게 구분해주세요.
답변은 한국어로 작성해주세요.
\`

    console.log("Refined Prompt for Gemini:", prompt);

    try {
        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const generationConfig = {
            // temperature: 0.7,
            // maxOutputTokens: 2048,
        };

        const result = await geminiModel.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
            safetySettings,
        });

        const response = await result.response;
        const feedbackText = response.text();
        console.log("AI Feedback received (Markdown expected)."); // Removed full text log to avoid overly long output here
        return feedbackText;
    } catch (error) {
        console.error('Error generating AI feedback:', error);
        if (error.response && error.response.promptFeedback) {
            console.error('Prompt Feedback from API:', error.response.promptFeedback);
        }
        if (error.response && error.response.candidates && error.response.candidates[0] && error.response.candidates[0].finishReason === 'SAFETY') {
            console.error('Content blocked due to safety settings.');
            return "AI 피드백 생성 중 안전 문제로 인해 내용이 차단되었습니다. 입력 내용을 확인해주세요.";
        }
        return "AI 피드백을 생성하는 중 오류가 발생했습니다. 관리자에게 문의해주세요.";
    }
}

app.use(express.json());

app.post('/api/assessments', async (req, res) => {
    const assessmentData = req.body;
    const {
        insight_score, insight_level, flexem_score, flexem_level,
        voyage_score, voyage_level, bridge_score, bridge_level,
        sparks_score, sparks_level, anchor_score, anchor_level,
        profile_string, raw_answers
    } = assessmentData;

    if (typeof insight_score === 'undefined' || !raw_answers) {
        return res.status(400).json({ message: 'Missing required assessment data.' });
    }

    const insertSql = \`INSERT INTO assessments (
        insight_score, insight_level, flexem_score, flexem_level,
        voyage_score, voyage_level, bridge_score, bridge_level,
        sparks_score, sparks_level, anchor_score, anchor_level,
        profile_string, raw_answers
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`;
    const params = [
        insight_score, insight_level, flexem_score, flexem_level,
        voyage_score, voyage_level, bridge_score, bridge_level,
        sparks_score, sparks_level, anchor_score, anchor_level,
        profile_string, JSON.stringify(raw_answers)
    ];

    const runDbInsert = (sql, p) => new Promise((resolve, reject) => {
        db.run(sql, p, function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });

    const runDbUpdate = (sql, p) => new Promise((resolve, reject) => {
        db.run(sql, p, function(err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });

    try {
        const assessmentId = await runDbInsert(insertSql, params);
        console.log(\`A new assessment has been inserted with rowid \${assessmentId}\`);

        const aiFeedback = await generateAIInsights(assessmentData);

        const updateSql = \`UPDATE assessments SET ai_generated_feedback = ? WHERE assessment_id = ?\`;
        await runDbUpdate(updateSql, [aiFeedback, assessmentId]);
        console.log(\`Assessment \${assessmentId} updated with AI feedback.\`);

        res.status(201).json({
            message: 'Assessment data saved and AI feedback generated successfully.',
            assessmentId: assessmentId,
            data: assessmentData,
            aiFeedback: aiFeedback
        });

    } catch (dbError) {
        console.error('Database error during assessment processing:', dbError.message);
        res.status(500).json({ message: 'Failed to process assessment due to database error.' });
    }
});

app.get('/api/assessments', (req, res) => {
    const query = "SELECT * FROM assessments ORDER BY assessment_timestamp DESC LIMIT 20";
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching assessments:', err.message);
            return res.status(500).json({ message: 'Failed to fetch assessments.' });
        }
        res.status(200).json({
            message: 'Assessments fetched successfully.',
            assessments: rows
        });
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(\`Backend server with SQLite and Gemini integration running on http://localhost:\${PORT}\`);
    if (!GEMINI_API_KEY) {
     console.warn("Reminder: GEMINI_API_KEY is not set. AI features will be disabled.");
    }
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) console.error(err.message);
        console.log('Closed the database connection.');
        process.exit(0);
    });
});
