const { createFeedback } = require('../models/feedback.model');
const { findUserByEmail } = require('../models/user.model');
//APIs
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
// Personal API Key for OpenWeatherMap API
const apiKey = "&appid=ad05ded3faedd716b6dd93eb0e3d247c"
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';


/*Fetch data */
const get_weather = () => {
    return async (req, user_res, next) => {
        try {
            let { zipCode } = req.query
            const res = await fetch(baseURL + zipCode + apiKey);
            if (!res.ok) {
                let alt_weather = get_fallback_weather(zipCode)
                return user_res.status(200).json({
                    status: "success",
                    alt_weather
                });
            }

            const data = await res.json()
            user_res.status(200).json({
                status: "success",
                data
            });
        } catch (error) {
            console.error(error)
            user_res.status(500).json({
                status: "failed"
            })
        }
    }
}
//validate_zip API that return a json object indicating weather the zip 
//code is correct or not 

const validate_zip = () => {
    return async (req, user_res, next) => {
        const apiKey = 'h8HNTlruqSBgRhdVLUGMYmXiWwJU490Cf3bIItOSVrKnHY9nNf4KEOCFAjgdxgHu';
        const zip_baseURL = `https://www.zipcodeapi.com/rest/${apiKey}/info.json/`;

        try {
            let { zipCode } = req.query;

            if (!zipCode) {
                return user_res.status(400).json({
                    status: "failed",
                    error: "zipCode parameter is required"
                });
            }

            const response = await fetch(zip_baseURL + zipCode + '/degrees');
            if (response.ok) {
                const data = await response.json();
                if (data.error_code) {
                    return user_res.status(400).json({
                        status: "failed",
                        error: data.error_msg
                    });
                }
                return user_res.status(200).json({
                    status: "success",
                    valid: true,
                    data
                });
            } else {
                return user_res.status(response.status).json({
                    status: "failed",
                    error: "Error fetching zip code information"
                });
            }
        } catch (error) {
            console.error(error);
            return user_res.status(500).json({
                status: "failed",
                error: "Internal Server Error"
            });
        }
    }
}
//etch weather data from an alternative weather API if the primary API fails.
const fallbackBaseURL = 'http://api.weatherbit.io/v2.0/current?postal_code=';
const fallbackApiKey = '5ec92305af4e49429621e3360a5e2431';

/*Fetch fallback weather data */
async function get_fallback_weather(zipCode) {
    try {
        // Zip code validation
        const zipCodePattern = /^\d{5}(-\d{4})?$/;
        if (!zipCode || !zipCodePattern.test(zipCode)) {
            return {
                status: "failed",
                message: "Invalid zip code format. Please provide a valid 5-digit zip code."
            };
        }
        const response = await fetch(fallbackBaseURL + zipCode + fallbackApiKey);
        if (!response.ok) {
            return {
                status: "failed",
                message: "Error fetching fallback weather data"
            };
        }
        const data = await response.json();
        return {
            status: "success",
            data
        };
    } catch (error) {
        console.error(error);
        return {
            status: "failed",
            message: "Internal Server Error"
        };
    }
}
//feedback post 
const submit_feedback = () => {
    return async (req, res) => {
      try {
        let { feedback, email } = req.body;
  
        if (!feedback || !email) {
          return res.status(400).json({
            status: "failed",
            error: "Feedback message and email are required"
          });
        }
  
        // Find the user by email
        const user = await findUserByEmail(email);
  
        if (!user) {
          return res.status(400).json({ message: 'User not found' });
        }
  
        // Create feedback
        const newFeedback = { UserID: user.UserID, FeedbackText: feedback };
        const createdFeedback = await createFeedback(newFeedback);
  
        if (!createdFeedback) {
          return res.status(500).json({ message: 'Failed to create feedback' });
        }
  
        return res.status(200).json({
          status: "success",
          message: "Feedback received. Thank you!",
          feedbackId: createdFeedback.FeedbackID
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: "failed",
          error: "Internal Server Error"
        });
      }
    };
  };
//get_help API should return 
const get_zip_help = () => {
    return (req, user_res, next) => {
        try {
            const tips = [
                "Check your postal mail for the zip code.",
                "Visit your national postal service website.",
                "Ask a neighbor or local business for the zip code.",
                "Use an online zip code lookup tool.",
                "Look at utility bills or other official documents."
            ];

            user_res.status(200).json({
                status: "success",
                tips
            });
        } catch (error) {
            console.error(error);
            user_res.status(500).json({
                status: "failed",
                error: "Internal Server Error"
            });
        }
    }
}



//sing up
/**
 * post request, send the email and the password
 * hashing pass
 * insert to user table with hashed password
 * return failed or success
 */


//sing in
module.exports = { get_weather, validate_zip, get_fallback_weather, get_zip_help, submit_feedback }