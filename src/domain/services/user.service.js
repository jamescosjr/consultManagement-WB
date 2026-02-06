import bcrypt from 'bcryptjs';
import {
    getAllUsers,
    getUserById,
    getUserByName,
    getUserByEmail,
    getUserByRole
} from '../../infrastructure/repositories/user-repositories/user.repository.read.js';
import {
    updateUserById,
    deleteUserById,
    updateUserPassword
} from '../../infrastructure/repositories/user-repositories/user.repository.write.js';
import { AppError } from '../error/customErros.js';
import { User } from '../../infrastructure/schemas/user.schema';

export async function getAllUsersService(page = 1, limit = 10) {
    try {
        return await getAllUsers(page, limit);
    } catch (error) {
        throw new AppError(error.message || 'Error getting users', 500);
    }
}

export async function getUserByIdService(id) {
    try {
        const user = await getUserById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || 'Error getting user', 500);
    }
}

export async function getUserByNameService(name, page = 1, limit = 10) {
    try {
        return await getUserByName(name, page, limit);
    } catch (error) {
        throw new AppError(error.message || 'Error getting users by name', 500);
    }
}

export async function getUserByEmailService(email) {
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || 'Error getting user by email', 500);
    }
}

export async function getUserByRoleService(role, page = 1, limit = 10) {
    try {
        return await getUserByRole(role, page, limit);
    } catch (error) {
        throw new AppError(error.message || 'Error getting users by role', 500);
    }
}

export async function updateUserService(id, { name, email, role }) {
    try {
        const updateData = {};
        
        if (name !== undefined) {
            updateData.name = name;
        }
        
        if (email !== undefined) {
            updateData.email = email;
        }
        
        if (role !== undefined) {
            updateData.role = role;
        }

        if (Object.keys(updateData).length === 0) {
            throw new AppError('No valid fields to update', 400);
        }

        return await updateUserById(id, updateData);
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || 'Error updating user', 500);
    }
}

export async function deleteUserService(id) {
    try {
        return await deleteUserById(id);
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || 'Error deleting user', 500);
    }
}

export async function changePasswordService(id, currentPassword, newPassword, isAdmin = false) {
    try {
        const user = await getUserById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        const userWithPassword = await User.findById(id).select('+passwordHash');

        if (!userWithPassword) {
            throw new AppError('User not found', 404);
        }

        if (!isAdmin) {
            const isPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.passwordHash);
            if (!isPasswordValid) {
                throw new AppError('Current password is incorrect', 401);
            }
        }

        const salt = await bcrypt.genSalt(12);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        return await updateUserPassword(id, newPasswordHash);
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || 'Error changing password', 500);
    }
}

export async function checkEmailExistsService(email) {
    const user = await User.findOne({ email });
    return !!user;
}
