const userService = require("../services/userService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    //1. Validate input
    if (!usernameOrEmail || !password) {
      return res
        .status(400)
        .json({ error: "Användarnamn/e-post och lösenord krävs." });
    }
    
    //2. Check if user exists in database
    const user = await userService.getUserByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      return res.status(401).json({ error: "Ogiltiga inloggningsuppgifter" });
    }

    //3. Compare password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Ogiltiga inloggningsuppgifter" });
    }

    //4. Generate JWT token
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user.id, username: user.username },
      secretKey,
      { expiresIn: "7d" },
    );

    //5. Return token and user info
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login controller error:", err);
    return res.status(500).json({
      error: "An error occurred while logging in",
    });
  }
};
