import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

// Hash pré-calculado para 'TestPass123!' com bcrypt rounds=4 para performance em testes
export const MOCK_PASSWORD_HASH = '$2b$04$S1VN/l88knup3tuXbZesieUrcHDRos98N8i90ySWRKB8da/61Qwc2';

export function generateToken(userId, role) {
    // Converte o userId para string para garantir consistência
    return jwt.sign({ id: userId.toString(), role }, JWT_SECRET, { expiresIn: '8h' });
}
