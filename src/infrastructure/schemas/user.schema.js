import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { getDoctorByName } from '../repositories/doctor-repositories/doctor.repository.read';

export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ['root', 'client', 'doctor', 'employee'],
        default: 'client',
        required: true
    }
    
}, { timestamps: true });

userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);