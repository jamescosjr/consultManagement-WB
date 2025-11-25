import { ValidationError } from "../../domain/error/customErros.js";
import { registerService } from "../../domain/services/authService.js";
import { validateRegisterData } from "../../domain/validation/auth.js";

export async function registerController(req, res, next) {
    const { name, email, password } = req.body;

    const validation = validateRegisterData(name, email, password);
        if (!validation.valid) {
            return next(new ValidationError(validation.message))
        }

    try {
        const { user, token } = await registerService(req.body);
        res.status(201).json({ user, token });
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            // eslint-disable-next-line no-console
            console.error('RegisterController error:', { status: error.status, message: error.message, name: error.name, stack: error.stack });
        }
        next(error);
    }
}