const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require("cors")

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors())

// Helper function to get the current timestamp in a readable format
function getReadableTimestamp() {
    const now = new Date();
    const date = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

// Endpoint to receive logs
app.post('/log', (req, res) => {
    const logMessage = req.body.log;
    const timestamp = getReadableTimestamp();
    const divider = '----------------------------';

    // Format the log entry
    const formattedLog = `${timestamp} - ${logMessage}\n${divider}\n`;

    // Log to console
    console.log(formattedLog);

    // Write to file
    const logFilePath = path.join(__dirname, 'logs.txt');
    fs.appendFile(logFilePath, formattedLog, (err) => {
        if (err) {
            console.error('Error writing to log file', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send('Log received');
        }
    });
});

app.listen(port, () => {
    console.log(`Log server listening at http://localhost:${port}`);
});
