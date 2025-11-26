import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser } from '../../infrastructure/repositories/user-repositories/user.repository.write.js';
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