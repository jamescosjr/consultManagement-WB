import { AppError } from "../../../domain/error/customErros.js";
import { User } from "../../schemas/user.schema.js";

export async function createUser({ name, email, passwordHash, role }, session = null) {
    try {
        // Pre-check to ensure deterministic duplicate handling without relying on indexes
        let query = User.findOne({ email });
        if (session) {
            query = query.session(session);
        }
        const existing = await query.exec();
        if (existing) {
            throw new AppError('Email already registered', 409);
        }
        const newUser = new User({
            name,
            email,
            passwordHash,
            role: role || 'client'
        });
        return newUser.save({ session });
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            // eslint-disable-next-line no-console
            console.error('createUser error:', error);
        }
        if (error instanceof AppError) {
            throw error;
        }
        if (error.code === 11000) {
            throw new AppError('Email already registered', 409);
        }
        throw new AppError(error.message || 'Database error', 500);
    }
}
