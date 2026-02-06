import logger from '../../infrastructure/observability/logger.js';
import { ValidationError, AppError } from "../../domain/error/customErros.js";
import {
    getAllUsersService,
    getUserByIdService,
    getUserByNameService,
    getUserByEmailService,
    getUserByRoleService,
    updateUserService,
    deleteUserService,
    changePasswordService,
    checkEmailExistsService
} from "../../domain/services/user.service.js";
import {
    validateUpdateUserData,
    validatePasswordChange,
    validateUserRole
} from "../../domain/validation/user.js";
import { validateEmail } from '../../domain/utils/validation.js';

export async function listUsersHandler(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const users = await getAllUsersService(page, limit);
        res.status(200).json(users);
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            logger.error({ status: error.status, message: error.message, name: error.name, stack: error.stack }, 'ListUsersHandler error');
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
            logger.error({ status: error.status, message: error.message, name: error.name, stack: error.stack }, 'GetUserByIdHandler error');
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
            logger.error({ status: error.status, message: error.message, name: error.name, stack: error.stack }, 'FindUserByNameHandler error');
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
            logger.error({ status: error.status, message: error.message, name: error.name, stack: error.stack }, 'FindUserByEmailHandler error');
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
            logger.error({ status: error.status, message: error.message, name: error.name, stack: error.stack }, 'ListUsersByRoleHandler error');
        }
        next(error);
    }
}

export async function updateUserHandler(req, res, next) {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;
        const requester = req.user;

        if (!requester) {
            return next(new ValidationError('Requisição sem autenticação'));
        }

        // Verificar se o usuário existe antes de qualquer operação
        const user = await getUserByIdService(id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Apenas root ou o próprio usuário podem atualizar os dados
        if (requester.role !== 'root' && requester.id !== id) {
            return next(new AppError('Acesso negado. Apenas root ou o próprio usuário podem atualizar os dados.', 403));
        }

        // Validar campos antes de atualizar
        if (!name && !email && !role) {
            return next(new ValidationError('Nenhum campo para atualizar foi fornecido'));
        }

        if (email && !validateEmail(email)) {
            return next(new ValidationError('Email inválido'));
        }

        if (role && !['root', 'client', 'employee'].includes(role)) {
            return next(new ValidationError('Role inválido'));
        }

        // Verificar se o email já está em uso
        if (email && email !== user.email) {
            const emailExists = await checkEmailExistsService(email);
            if (emailExists) {
                return next(new AppError('Email já está em uso', 409));
            }
        }

        const updatedUser = await updateUserService(id, { name, email, role });
        res.status(200).json(updatedUser);
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            logger.error({ status: error.status, message: error.message, name: error.name, stack: error.stack }, 'UpdateUserHandler error');
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
            logger.error({ status: error.status, message: error.message, name: error.name, stack: error.stack }, 'DeleteUserHandler error');
        }
        next(error);
    }
}

export async function changePasswordHandler(req, res, next) {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        // Apenas root pode alterar senha de outros; usuário pode alterar própria senha
        const requester = req.user;
        if (!requester) {
            return next(new ValidationError('Requisição sem autenticação'));
        }

        const user = await getUserByIdService(id);

        // Se usuário alvo não existe, retornar 404 antes de checar permissões
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        if (requester.role !== 'root' && requester.id !== id) {
            return next(new AppError('Acesso negado. Apenas root ou o próprio usuário podem alterar a senha.', 403));
        }

        const validation = validatePasswordChange(currentPassword, newPassword, user.name, user.email);
        if (!validation.valid) {
            return next(new ValidationError(validation.message));
        }

        const updatedUser = await changePasswordService(id, currentPassword, newPassword, requester.role === 'root');
        res.status(200).json({ message: 'Password changed successfully', user: updatedUser });
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            logger.error({ status: error.status, message: error.message, name: error.name, stack: error.stack }, 'ChangePasswordHandler error');
        }
        next(error);
    }
}
