const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../model/user");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("phonebook", { name: 1, number: 1 });
  res.json(users.map((u) => u.toJSON()));
});

usersRouter.post("/", async (req, res) => {
  const body = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);
  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });
  const savedUser = await user.save();
  res.json(savedUser);
});

module.exports = usersRouter;
