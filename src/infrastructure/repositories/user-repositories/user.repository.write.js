import logger from '../../observability/logger.js';
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
            logger.error({ err: error }, 'createUser error');
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

export async function updateUserById(id, updateData, session = null) {
    try {
        const allowedUpdates = ['name', 'email', 'role'];
        const updates = {};
        
        for (const key of allowedUpdates) {
            if (updateData[key] !== undefined) {
                updates[key] = updateData[key];
            }
        }

        if (updates.email) {
            updates.email = updates.email.toLowerCase().trim();
            
            let query = User.findOne({ email: updates.email, _id: { $ne: id } });
            if (session) {
                query = query.session(session);
            }
            const existingUser = await query.exec();
            if (existingUser) {
                throw new AppError('Email already in use', 409);
            }
        }

        let updateQuery = User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (session) {
            updateQuery = updateQuery.session(session);
        }
        
        const updatedUser = await updateQuery.select('-passwordHash').exec();
        
        if (!updatedUser) {
            throw new AppError('User not found', 404);
        }

        return updatedUser;
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            logger.error({ err: error }, 'updateUserById error');
        }
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || 'Database error', 500);
    }
}

export async function deleteUserById(id, session = null) {
    try {
        let query = User.findByIdAndDelete(id);
        if (session) {
            query = query.session(session);
        }
        
        const deletedUser = await query.select('-passwordHash').exec();
        
        if (!deletedUser) {
            throw new AppError('User not found', 404);
        }

        return deletedUser;
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            logger.error({ err: error }, 'deleteUserById error');
        }
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || 'Database error', 500);
    }
}

export async function updateUserPassword(id, newPasswordHash, session = null) {
    try {
        let query = User.findByIdAndUpdate(
            id,
            { passwordHash: newPasswordHash },
            { new: true, runValidators: true }
        );
        if (session) {
            query = query.session(session);
        }
        
        const updatedUser = await query.select('-passwordHash').exec();
        
        if (!updatedUser) {
            throw new AppError('User not found', 404);
        }

        return updatedUser;
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            logger.error({ err: error }, 'updateUserPassword error');
        }
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || 'Database error', 500);
    }
}
