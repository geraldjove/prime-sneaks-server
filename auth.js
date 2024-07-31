const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.clientSecret;

// Create Auth Token
module.exports.createAccessToken = (user) => {
  try {
    if (user) {
      const data = {
        id: user._id,
        email: user.contactEmail,
        isAdmin: user.isAdmin,
      };

      console.log(data);
      return jwt.sign(data, secret, { expiresIn: "1h" }); // Optionally, you can set an expiration time
    } else {
      console.log("Error creating access token");
    }
  } catch (error) {
    console.error("Error creating token: " + error);
    throw error; // Ensure the error is propagated
  }
};

// Verify Token
module.exports.verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ auth: "Failed Token" });
    }

    // Remove 'Bearer ' prefix if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        return res.status(401).send({ auth: "Failed", message: err.message });
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } catch (error) {
    console.error("Error verifying token: " + error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

// Verify Admin
module.exports.verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    return res
      .status(403)
      .send({ auth: "Failed", message: "Action Forbidden" });
  }
};

// Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};
