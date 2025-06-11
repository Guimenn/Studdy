import jwt from 'jsonwebtoken';

/**
 * Middleware de autenticação JWT para Next.js
 * Verifica e valida tokens de acesso em requisições API
 */

/**
 * Middleware que verifica a autenticação do usuário via JWT
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função para continuar o middleware
 */
export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token não fornecido'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};