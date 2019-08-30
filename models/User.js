const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleID: String,
  credits: { type: Number, default: 0 }
});

//First Argument - Name of collection, Second - Schema
mongoose.model("users", userSchema);
