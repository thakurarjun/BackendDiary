const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const phonebookSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3 },
  number: { type: String, required: true, minlength: 8 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
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
