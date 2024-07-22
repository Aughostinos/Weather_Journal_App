const router = require("express").Router();

// Import controller functions
const { get_weather, validate_zip, get_fallback_weather, get_zip_help, submit_feedback } = require("../controller/weather.controller");
const { signup, signin } = require("../controller/auth.controller");

// Route to get weather information
router.get('/weather', get_weather());

// Route to validate zip code
router.get('/zip_validation', validate_zip());

// Route to get help tips for zip codes
router.get('/help', get_zip_help());

// Route to submit user feedback
router.post('/user_feedback', submit_feedback());

// Route to sign up a new user
router.post('/signup', signup());

// Route to sign in an existing user
router.post('/signin', signin());

module.exports = router;
