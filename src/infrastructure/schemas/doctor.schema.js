import mongoose from "mongoose";

export const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    consultIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: `Consult`,
        default: []
    }
})

export const Doctor = mongoose.model('Doctor', doctorSchema);