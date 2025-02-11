import mongoose from 'mongoose';

export const consultSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

export const Consult = mongoose.model('Consult', consultSchema);