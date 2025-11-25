import jwt from 'jsonwebtoken';
import { AppError } from '../../domain/error/customErros.js';
import { User } from '../../infrastructure/schemas/user.schema.js';

const JWT_SECRET = process.env.JWT_SECRET;

export async function ensureAuthenticated(req, res, next) {
    if (process.env.NODE_ENV === 'test') {
        return next();
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(new AppError('Token não fornecido', 401));
    }
    const [, token] = authHeader.split(' ');

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        
        if (!payload.id || !payload.role) {
             return next(new AppError('Token mal formatado', 401));
        }

        req.user = {
            id: payload.id,
            role: payload.role
        };

        return next();
    } catch (error) {
        return next(new AppError('Token inválido ou expirado', 401));
    }
}

export const ensureRoles = (requiredRoles) => {
    return (req, res, next) => {
        if (process.env.NODE_ENV === 'test') {
            return next();
        }

        const { role } = req.user || {};
        
        if (role === 'root') {
            return next();
        }

        const hasPermission = requiredRoles.includes(role);

        if (!hasPermission) {
            return next(new AppError('Acesso negado. Permissão insuficiente.', 403));
        }

        return next();
    };
};