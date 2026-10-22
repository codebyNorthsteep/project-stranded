require('dotenv').config();
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

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

// Use the user routes
const userRoute = require('./routes/userRoutes');
app.use(userRoute);

const rightAnswerRoute = require("./routes/RightAnswerRoutes");
app.use(rightAnswerRoute);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);   
});