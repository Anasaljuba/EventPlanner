const { Schema, model } = require("mongoose");
const mongooseSlugPlugin = require("mongoose-slug-plugin");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const EventSchema = new Schema(
  {
    organizer: {
      type: String,
      maxLength: 20,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    image: {
      type: String,
      required: true,
    },
    numOfSeats: {
      type: Number,
      min: 5,
    },
    bookedSeats: {
      type: Number,
      default: 0,
      //max: EventSchema.numOfSeats,
    },
    startDate: {
      type: Date,
      min: Date.now,
      format: "%d/%m/%Y",
    },
    endDate: {
      type: Date,
      format: "%d/%m/%Y",
      //min: EventSchema.startDate,
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.plugin(mongooseSlugPlugin, { tmpl: "<%=name%>" });

module.exports = model("events", EventSchema);
