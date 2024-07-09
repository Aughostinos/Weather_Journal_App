const router = require("express").Router()

const { get_weather, validate_zip, get_fallback_weather, get_zip_help, submit_feedback } = require("../controller/weather.controller")

router.get('/weather', get_weather())
router.get('/zip_validation', validate_zip())
router.get('/help', get_zip_help())
router.post('/user_feedback', submit_feedback())

module.exports = router