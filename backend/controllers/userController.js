const userService = require("../services/userService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client();

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

exports.loginViaSocialLogin = async (req, res) => {
  try {

    const { credential } = req.body ?? {};

    //1. Validation

    //Validate that the credential exists
    if (typeof credential !== "string" || !credential.trim()) {
      return res.status(400).json({
        error: "Google credential is required.",
      });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      return res.status(500).json({
        error: "Google login is not configured.",
      });
    }

    let payload;

    try {
      //Verify the token's signature and expiration with Google
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });

      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({
        error: "Invalid or expired Google credential.",
      });
    }
    //Verify that the email is verified by Google
    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      return res.status(401).json({
        error: "A verified Google email is required.",
      });
    }

    // Keep email-based login limited to addresses for which Google
    // is authoritative. Other addresses need explicit account linking.
    if (!payload.email.endsWith("@gmail.com") && !payload.hd) {
      return res.status(401).json({
        error: "Use password login to link this Google account.",
      });
    }

    const email = payload.email;
    const username = payload.given_name?.trim() || payload.name?.trim() || email.split("@")[0];

    const secretKey = process.env.JWT_SECRET;

    //2. Check if user already exists in database (check ONLY by email)
    const existingUser = await userService.getUserByEmail(email);

    //CASE A: If user already exists in database so can login direct
    if (existingUser) {
      //A.1 Generate JWT token
      const token = jwt.sign(
        { id: existingUser.user_id, username: existingUser.username },
        secretKey,
        { expiresIn: "1h" },
      );

      //A.2 Direct login
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: existingUser.user_id,
          username: existingUser.username,
          email: existingUser.email,
        },
      });

      //CASE B: If user does not exist in database so need to register + automatic login
    } else {
      //First, we need to check for an username collision in the database (UNIQUE constraint)
      //If the google username (for example "Gabriela") is already taken by another account,
      //It does not necessarily mean that this user already exist (we already checked that user does not exist by email)
      //So we need to create an append random suffix (for example "Gabriela_a3f1") to prevent a login from another user just because the coincidence of usernames

      let finalUsername = username;

      //B.1 We can reuse the function getUserByUsernameOrEmail to check the username because we already know that email does not exist
      const isUsernameTaken = await userService.getUserByUsernameOrEmail(
        username,
        email,
      );

      //B.2 If the username is taken, we generate the random suffix
      if (isUsernameTaken) {
        const randomSuffix = crypto.randomBytes(2).toString("hex");
        finalUsername = `${username}_${randomSuffix}`;
      }

      //B.3 Generate a hashedpassword
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const saltRounds = 10;
      const password = await bcrypt.hash(randomPassword, saltRounds);

      //B.4 Save new user in database
      const newUser = await userService.createUserViaSocialLogin(
        finalUsername,
        email,
        password,
      );

      //B.5 Generate JWT token
      const token = jwt.sign(
        { id: newUser.user_id, username: newUser.username },
        secretKey,
        { expiresIn: "1h" },
      );

      //B.6 Return user info
      return res.status(201).json({
        message: "Register successful",
        token,
        user: {
          id: newUser.user_id,
          username: newUser.username,
          email: newUser.email,
        },
      });
    }
  } catch (err) {
    console.error("Register controller error:", err);
    return res.status(500).json({
      error: "Kunde inte slutföra inloggningen. Försök igen.",
    });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const authenticatedUserId = req.userData?.id;

    if (authenticatedUserId == null) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (String(req.params.userId) !== String(authenticatedUserId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const userId = authenticatedUserId;
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

exports.updateUser = async (req, res) => {

  try {
    const authenticatedUserId = req.userData?.id;

    //1. Authentication check
    if (authenticatedUserId == null) {
      return res.status(401).json({ error: "Authentication required" });
    }

    //2. Authorization check (prevent other users from modifying other accounts)
    if (String(req.params.userId) !== String(authenticatedUserId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const userId = authenticatedUserId;
    const input = req.body ?? {};

    //3. Ensure the request body is a valid JSON object
    if (typeof input !== "object" || Array.isArray(input)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const updates = {};

    //4. Validate only the fields present in the request body
    for (const field of ["username", "password", "picture"]) {
      //Skip fields that were not provided in the request
      if (!Object.prototype.hasOwnProperty.call(input, field)) {
        continue;
      }

      const value = input[field];

      // Ensure provided values are non-empty strings
      if (
        typeof value !== "string" ||
        (field === "password" ? value.length === 0 : !value.trim())
      ) {
        return res.status(400).json({
          error: `${field} must be a non-empty string`,
        });
      }

      // Ensure provided password is no shorter than 6 digits
      if (field === "password" && value.length < 6) {
        return res.status(400).json({
          error: "Ange ett lösenord med minst sex tecken",
        });
      }

      // Ensure provided url's picture is valid
      if (field === "picture") {
        const trimmedPicture = value.trim();
        try {
          const parsedUrl = new URL(trimmedPicture);
          if ( parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:" ){
            throw new Error();
          }
        } catch {
          return res.status(400).json({
            error: "Ange en giltig bild-URL",
          });
        }
      }

      // Trim leading/trailing whitespace for username and picture, but preserve raw password characters
      updates[field] = field === "username" ? value.trim() : value;
    }

    //5. Ensure at least one valid field was sent for update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "Provide username, password, or picture",
      });
    }

    //6. Hash password BEFORE touching the database to avoid partial updates on error
    if (updates.password !== undefined) {
      if (Buffer.byteLength(updates.password, "utf8") > 72) {
        return res.status(400).json({
          error: "Lösenordet får inte överstiga 72 UTF-8-byte",
        });
      }
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    //7. Perform a single atomic UPDATE query in the database
    await userService.updateUser(userId, updates);

    return res.status(200).json("Användaren har uppdaterats");
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        code: "USERNAME_TAKEN",
        error: "Användarnamnet används redan. Välj ett annat.",
      });
    }

    console.error("Update user info controller error:", err);
    return res.status(500).json({
      error: "Kunde inte uppdatera användarinformationen. Försök igen.",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const authenticatedUserId = req.userData?.id;

    if (authenticatedUserId == null) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (String(req.params.userId) !== String(authenticatedUserId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const userId = authenticatedUserId;

    const deleted = await userService.deleteUser(userId);

    if (!deleted) {
      return res.status(404).json({ error: "Användare hittades inte" });
    }

    return res.status(200).json("Användaren har tagits bort");
  } catch (err) {
    console.error("Delete user controller error:", err);
    return res.status(500).json({
      error: "Ett fel uppstod när användaren skulle tas bort",
    });
  }
};
