import mongoose from "mongoose";

export const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
})

export const Patient = mongoose.model('Patient', patientSchema);