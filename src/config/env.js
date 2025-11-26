/**
 * Configurações centralizadas do ambiente
 * Este módulo garante que todos os componentes usem os mesmos valores
 */

export const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
export const NODE_ENV = process.env.NODE_ENV || 'development';
