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
    return async (req, user_res, next) => {
        try {
            let { feedback , email } = req.body;

            if (!feedback || !email) {
                return user_res.status(400).json({
                    status: "failed",
                    error: "Feedback message is required"
                });
            }

            // Here you would normally store the feedback in a database
            // Assuming a function saveFeedback exists which saves feedback to the database
            const saveFeedback = async (feedbackMessage) => {
                // Simulate saving feedback to the database
                return true; // Return true if saving was successful
            };

            const result = await saveFeedback(feedback);

            if (result) {
                return user_res.status(200).json({
                    status: "success",
                    message: "Feedback received. Thank you!"
                });
            } else {
                return user_res.status(500).json({
                    status: "failed",
                    message: "Failed to store feedback"
                });
            }
        } catch (error) {
            console.error(error);
            user_res.status(500).json({
                status: "failed",
                error: "Internal Server Error"
            });
        }
    }
}
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

//sing in

//sing up
/**
 * post request, send the email and the password
 * hashing pass
 * insert to user table with hashed password
 * return failed or success
 */


module.exports = { get_weather, validate_zip, get_fallback_weather, get_zip_help, submit_feedback }