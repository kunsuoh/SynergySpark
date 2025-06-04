// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Use verbose for more detailed error messages
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Define the path for the SQLite database file
const dbPath = path.resolve(__dirname, 'database/synergyspark.db');

// Ensure database directory exists
const fs = require('fs');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTable(); // Create table if it doesn't exist
    }
});

// Function to create the assessments table
function createTable() {
    const createTableSql = `
    CREATE TABLE IF NOT EXISTS assessments (
        assessment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_identifier TEXT, -- For now, can be null or a session ID
        assessment_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        insight_score REAL,
        insight_level INTEGER,
        flexem_score REAL,
        flexem_level INTEGER,
        voyage_score REAL,
        voyage_level INTEGER,
        bridge_score REAL,
        bridge_level INTEGER,
        sparks_score REAL,
        sparks_level INTEGER,
        anchor_score REAL,
        anchor_level INTEGER,
        profile_string TEXT,
        raw_answers TEXT -- Storing as JSON string
    );`;
    db.run(createTableSql, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Assessments table is ready.');
        }
    });
}

app.use(express.json());

app.post('/api/assessments', (req, res) => {
    console.log('Received assessment data for DB insertion:');
    console.log(JSON.stringify(req.body, null, 2));

    const {
        insight_score, insight_level,
        flexem_score, flexem_level,
        voyage_score, voyage_level,
        bridge_score, bridge_level,
        sparks_score, sparks_level,
        anchor_score, anchor_level,
        profile_string,
        raw_answers
    } = req.body;

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
        profile_string, JSON.stringify(raw_answers) // Store raw_answers as a JSON string
    ];

    db.run(insertSql, params, function(err) { // Use function() to get this.lastID
        if (err) {
            console.error('Error inserting assessment data:', err.message);
            return res.status(500).json({ message: 'Failed to save assessment data.' });
        }
        console.log(\`A new assessment has been inserted with rowid \${this.lastID}\`);
        res.status(201).json({
            message: 'Assessment data saved successfully.',
            assessmentId: this.lastID,
            data: req.body
        });
    });
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
    console.log(\`Backend server with SQLite running on http://localhost:\${PORT}\`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});
