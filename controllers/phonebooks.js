const phonebookRouter = require("express").Router();
const Phonebook = require("../model/phonebook");
const User = require("../model/user");
const jwt = require('jsonwebtoken');
phonebookRouter.get("/",async (req, res) => {
  const phonebooks = await Phonebook.find({}).populate('user', {username: 1, name: 1});
  res.json(phonebooks.map(phonebook => phonebook.toJSON()));
});
phonebookRouter.get("/:id", (req, res, next) => {
  Phonebook.findById(req.params.id)
    .then((phonebook) => {
      if (phonebook) {
        res.json(phonebook.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  };
  return null;
};
phonebookRouter.post("/", async (req, res, next) => {
  const body = req.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  };
  const user = await User.findById(decodedToken.id);
  // let user = await User.findById(body.userId);
  console.log(body);
  console.log("user is", user);
  console.log(Object.keys(body).length === 0);
  if (Object.keys(body).length === 0) {
    return res.status(400).json({
      error: ["content missing"],
    });
  }
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: ["name/number missing "],
    });
  }

  const phonebook = new Phonebook({
    name: body.name,
    number: body.number,
    user: user._id,
  });
  const savedPhonebook = await phonebook.save();
  console.log("savedPhonebook : ", savedPhonebook);
  user.phonebook = user.phonebook.concat(savedPhonebook._id);
  user.save();
  res.json(savedPhonebook.toJSON());
});
phonebookRouter.delete("/:id", (req, res, next) => {
  Phonebook.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});
phonebookRouter.put("/:id", (req, res, next) => {
  const body = req.body;
  const phonebook = {
    name: body.name,
    number: body.number,
  };
  Phonebook.findByIdAndUpdate(req.params.id, phonebook, { new: true })
    .then((updatedPhonebook) => {
      res.json(updatedPhonebook.toJSON());
    })
    .catch((error) => next(error));
});
module.exports = phonebookRouter;
