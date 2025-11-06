import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors.js';
import { User } from '../infrastructure/schema/userSchema.js'; // Caminho correto

const JWT_SECRET = process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SEGURO_AQUI';

/**
 * Middleware de AUTENTICAÇÃO (AuthN)
 */
export async function ensureAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(new AppError('Token não fornecido', 401));
    }
    const [, token] = authHeader.split(' ');

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        
        // --- MUDANÇA SUTIL AQUI ---
        // O payload do token agora terá 'role' (singular)
        // (Vamos garantir isso no Ajuste 3)
        if (!payload.id || !payload.role) {
             return next(new AppError('Token mal formatado', 401));
        }

        // Não precisamos mais buscar o usuário no banco *só para pegar a role*
        // Isso torna o middleware muito mais rápido!
        // Podemos confiar no payload do JWT, pois ele é assinado.

        // ANEXA O USUÁRIO AO REQUEST (a partir do token)
        req.user = {
            id: payload.id,
            role: payload.role // Singular
        };
        // --- FIM DA MUDANÇA ---

        return next();
    } catch (error) {
        return next(new AppError('Token inválido ou expirado', 401));
    }
}

export const ensureRoles = (requiredRoles) => {
    return (req, res, next) => {

        const { role } = req.user;
        
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