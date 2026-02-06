import mongoose from 'mongoose';

export const consultSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        set: (value) => {
            // Se a data vier como string ISO, usar diretamente
            // Se vier como valor Date, normalizar para início do dia em UTC
            if (typeof value === 'string') {
                return new Date(value);
            }
            return value;
        }
    },
    shift: {
        type: String,
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