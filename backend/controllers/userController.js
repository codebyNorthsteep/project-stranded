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
    const user = await userService.getUserByUsernameOrEmail(
      usernameOrEmail,
      usernameOrEmail,
    ); //function in service recieve two parameters
    // If user does not exist so it can not log in
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
      { id: user.user_id, username: user.username },
      secretKey,
      { expiresIn: "1h" },
    );

    //5. Return token and user info
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
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

exports.registerUser = async (req, res) => {
  try {
    const input = req.body ?? {};
    const { password } = input;

    //1. Validate input
    if (
      typeof input.username !== "string" ||
      typeof input.email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        error: "Användarnamn, e-post och lösenord måste vara text.",
      });
    }

    const username = input.username.trim();
    const email = input.email.trim();
    // Basic email format check; this does not verify email ownership.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username || !emailPattern.test(email) || password.length === 0) {
      return res.status(400).json({
        error:
          "Ange ett användarnamn, en giltig e-postadress och ett lösenord.",
      });
    }

    //2. Check if user already exists in database (check username and email)
    const existingUser = await userService.getUserByUsernameOrEmail(
      username,
      email,
    );
    //If user already exists so it can not register
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Användarnamnet eller e-postadressen används redan" });
    }

    //3. Generate hashed password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //4. Save new user in database
    const newUser = await userService.createUser(
      username,
      email,
      hashedPassword,
    );

    //5. Return user info
    return res.status(201).json({
      message: "Register successful",
      user_id: newUser.user_id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (err) {
    console.error("Register controller error:", err);
    return res.status(500).json({
      error: "Kunde inte skapa konto. Försök igen.",
    });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userInfo = await userService.getUserInfoById(userId);
    if (!userInfo) {
      return res.status(404).json({ error: "Användare hittades inte" });
    }
    return res.status(200).json(userInfo);
  } catch (err) {
    console.error("Get user info controller error:", err);
    return res.status(500).json({
      error: "Ett fel uppstod när användarinformationen hämtades",
    });
  }
};
