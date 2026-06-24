const mongoose = require("mongoose");

const connectionRequestSchema =  new mongoose.Schema(
  {
    fromUserID: {
      required: true,
      ref:"User",
      type: mongoose.Schema.Types.ObjectId
    },
    toUserID: {
      required: true,
      type: mongoose.Schema.Types.ObjectId
    },
    status: {
      type: String,
      required: true,
      enum:{
        values: ["interested", "accepted", "rejected", "ignored"],
        message:"{VALUE} is not a valid status"
      }
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestSchema.index({fromUserID:1 , toUserID:1})

module.exports = mongoose.model("connectionRequest" , connectionRequestSchema)
