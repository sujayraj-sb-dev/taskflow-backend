const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Board Title is required"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Board", boardSchema);