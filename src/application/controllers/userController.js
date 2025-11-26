import { ValidationError } from "../../domain/error/customErros.js";
import {
    getAllUsersService,
    getUserByIdService,
    getUserByNameService,
    getUserByEmailService,
    getUserByRoleService,
    updateUserService,
    deleteUserService,
    changePasswordService
} from "../../domain/services/user.service.js";
import {
    validateUpdateUserData,
    validatePasswordChange,
    validateUserRole
} from "../../domain/validation/user.js";

export async function listUsersHandler(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const users = await getAllUsersService(page, limit);
        res.status(200).json(users);
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            // eslint-disable-next-line no-console
            console.error('ListUsersHandler error:', { status: error.status, message: error.message, name: error.name, stack: error.stack });
        }
        next(error);
    }
}

export async function getUserByIdHandler(req, res, next) {
    try {
        const { id } = req.params;
        const user = await getUserByIdService(id);
        res.status(200).json(user);
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            // eslint-disable-next-line no-console
            console.error('GetUserByIdHandler error:', { status: error.status, message: error.message, name: error.name, stack: error.stack });
        }
        next(error);
    }
}

export async function findUserByNameHandler(req, res, next) {
    try {
        const { name } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const users = await getUserByNameService(name, page, limit);
        res.status(200).json(users);
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            // eslint-disable-next-line no-console
            console.error('FindUserByNameHandler error:', { status: error.status, message: error.message, name: error.name, stack: error.stack });
        }
        next(error);
    }
}

export async function findUserByEmailHandler(req, res, next) {
    try {
        const { email } = req.params;
        const user = await getUserByEmailService(email);
        res.status(200).json(user);
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            // eslint-disable-next-line no-console
            console.error('FindUserByEmailHandler error:', { status: error.status, message: error.message, name: error.name, stack: error.stack });
        }
        next(error);
    }
}

export async function listUsersByRoleHandler(req, res, next) {
    try {
        const { role } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const validation = validateUserRole(role);
        if (!validation.valid) {
            return next(new ValidationError(validation.message));
        }

        const users = await getUserByRoleService(role, page, limit);
        res.status(200).json(users);
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            // eslint-disable-next-line no-console
            console.error('ListUsersByRoleHandler error:', { status: error.status, message: error.message, name: error.name, stack: error.stack });
        }
        next(error);
    }
}

export async function updateUserHandler(req, res, next) {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        const validation = validateUpdateUserData(name, email, role);
        if (!validation.valid) {
            return next(new ValidationError(validation.message));
        }

        const user = await updateUserService(id, { name, email, role });
        res.status(200).json(user);
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            // eslint-disable-next-line no-console
            console.error('UpdateUserHandler error:', { status: error.status, message: error.message, name: error.name, stack: error.stack });
        }
        next(error);
    }
}

export async function deleteUserHandler(req, res, next) {
    try {
        const { id } = req.params;
        const user = await deleteUserService(id);
        res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            // eslint-disable-next-line no-console
            console.error('DeleteUserHandler error:', { status: error.status, message: error.message, name: error.name, stack: error.stack });
        }
        next(error);
    }
}

export async function changePasswordHandler(req, res, next) {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        const user = await getUserByIdService(id);
        
        const validation = validatePasswordChange(currentPassword, newPassword, user.name, user.email);
        if (!validation.valid) {
            return next(new ValidationError(validation.message));
        }

        const updatedUser = await changePasswordService(id, currentPassword, newPassword);
        res.status(200).json({ message: 'Password changed successfully', user: updatedUser });
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            // eslint-disable-next-line no-console
            console.error('ChangePasswordHandler error:', { status: error.status, message: error.message, name: error.name, stack: error.stack });
        }
        next(error);
    }
}
