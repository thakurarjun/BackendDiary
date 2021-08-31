const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
require("dotenv").config();
// app.use(express.static('build'));
// app.use(logger);
const Phonebook = require("./src/model/phonebook");
const requestLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Body:", req.body);
  console.log("---");
  next();
};
app.use(requestLogger);
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

// morgan.token('object', function (req) {
//   return `${JSON.stringify(req.body)}`
// })
//app.use(morgan(':method :url :status :response-time :req[header] :ob'))
app.get("/api/phonebook", (req, res) => {
  Phonebook.find({}).then((phonebook) => {
    res.json(phonebook);
  });
});
// app.get("/api/info", (req, res) => {
//   const utcDate1 = new Date(Date.now());
//   res.send(`<p>${utcDate1.toUTCString()}</p>`);
// });
app.get("/api/phonebook/:id", (req, res) => {
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
// app.get("/api/phonebook/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const note = phonebook.find((note) => note.id === id);
//   if (note) {
//     res.json(note);
//   } else {
//     res.status(404).end();
//   }
// });
app.put("/api/phonebook/:id", (req, res, next) => {
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
app.delete("/api/phonebook/:id", (req, res, next) => {
  Phonebook.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});
app.post("/api/phonebook", (req, res, next) => {
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

  //   let found = false;
  //   found = phonebook.find((post, index) => {
  //     if (post.name.toLowerCase() === body.name.toLowerCase()) {
  //       return true;
  //     }
  //   });
  //   if (found) {
  //     return res.status(400).json({
  //       error: ["name must be unique "],
  //     });
  //   }

  const phonebook = new Phonebook({
    name: body.name,
    number: body.number,
  });
  phonebook.save().then((savedPhonebook) => {
    res.json(savedPhonebook.toJSON());
  })
  .catch((error) => next(error));
});
app.use(unknownEndpoint);
const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({error: error.message});
  }
  next(error);
};
app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
