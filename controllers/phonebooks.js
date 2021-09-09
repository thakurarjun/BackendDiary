const phonebookRouter = require("express").Router();
const Phonebook = require("../model/phonebook");
phonebookRouter.get("/", (request, response) => {
  Phonebook.find({}).then((phonebook) => {
    response.json(phonebook);
  });
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
phonebookRouter.post("/", (req, res, next) => {
  const body = req.body;
  console.log(body);
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
  });
  phonebook
    .save()
    .then((savedPhonebook) => {
      res.json(savedPhonebook.toJSON());
    })
    .catch((error) => next(error));
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
