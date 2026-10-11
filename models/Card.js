const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Card Title is required"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    status: {
        type: String,
        enum: ["todo", "in-progress", "done"],
        default: "todo",
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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
)

module.exports = mongoose.model("Card", cardSchema);