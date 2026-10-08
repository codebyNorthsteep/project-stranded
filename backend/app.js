const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

//Parse JSON-body
app.use(express.json());

//Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());
app.use(express.static('public'));

// Use the quiz routes
const quizRoute = require('./routes/quizRoutes');
app.use(quizRoute);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);   
});