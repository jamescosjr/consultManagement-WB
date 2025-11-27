import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser } from '../../infrastructure/repositories/user-repositories/user.repository.write.js';
import { User } from '../../infrastructure/schemas/user.schema.js';
import { AppError } from '../error/customErros.js';
import { JWT_SECRET } from '../../config/env.js';

export async function registerService({ name, email, password, role }) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await createUser({
        name,
        email,
        passwordHash,
        role
    });

    const payload = {
    id: user._id,
    role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '8h'
    });
    
    user.passwordHash = undefined;
    return { user, token };
}

export async function loginService({ email, password }) {
    const normalizedEmail = (email || '').toLowerCase().trim();
    const userWithPassword = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!userWithPassword) {
        throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, userWithPassword.passwordHash);
    if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
    }

    const payload = {
        id: userWithPassword._id,
        role: userWithPassword.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    const user = userWithPassword.toObject();
    delete user.passwordHash;

    return { user, token };
}