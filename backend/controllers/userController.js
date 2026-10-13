const userService = require("../services/userService");

exports.getUser = async (req, res) => {
  try {
    const user = await userService.getUserByUsernameOrEmail(req.params.usernameOrEmail);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "An error occurred while fetching user" + err.message,
    });
  }
};