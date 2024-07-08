const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

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

// Endpoint to read and display the log file in a girly-themed HTML page
app.get('/view-logs', (req, res) => {
    const logFilePath = path.join(__dirname, 'logs.txt');
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading log file', err);
            res.status(500).send('Internal Server Error');
        } else {
            // Create a girly-themed HTML page
            const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Log Viewer</title>
          <style>
            body {
              background-color: pink;
              color: white;
              font-family: 'Comic Sans MS', cursive, sans-serif;
              text-align: center;
            }
            .container {
              width: 80%;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffccff;
              border: 2px solid #ff99cc;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #ff66b2;
            }
            pre {
              background-color: #fff0f5;
              color: #660066;
              padding: 10px;
              border-radius: 10px;
              white-space: pre-wrap;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎀 Log Viewer 🎀</h1>
            <pre>${data}</pre>
          </div>
        </body>
        </html>
      `;
            res.send(htmlContent);
        }
    });
});

app.listen(port, () => {
    console.log(`Log server listening at http://localhost:${port}`);
});
