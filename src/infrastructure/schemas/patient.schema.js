import mongoose from "mongoose";

export const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    consultIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: `Consult`,
        default: []
    }
})

export const Patient = mongoose.model('Patient', patientSchema);