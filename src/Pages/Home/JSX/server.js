const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json()); // parse JSON body

const filePath = './feedback.json';

// Initialize feedback.json if empty
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
}

// Endpoint to receive form data
app.post('/feedback', (req, res) => {
    const feedback = req.body;

    // Read existing data
    const data = JSON.parse(fs.readFileSync(filePath));

    // Add new feedback
    data.push(feedback);

    // Save back to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.json({ message: 'Feedback saved successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
