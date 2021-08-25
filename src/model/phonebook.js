const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
require("dotenv").config();
const url = `mongodb+srv://fullstack:${process.env.PASSWORD}@cluster0.crzpn.mongodb.net/phonebook-app?retryWrites=true&w=majority`;
console.log("connecting to", url);
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
const phonebookSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3 },
  number: { type: String, required: true, minlength: 8 }
});
phonebookSchema.plugin(uniqueValidator);
phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();  
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("Phonebook", phonebookSchema);
