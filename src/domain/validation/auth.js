export function validateRegisterData(name, email, password) {
    if (typeof name !== 'string' || name.trim() === '') {
        return { valid: false, message: 'The name should be a valid string' };
    }

    if (typeof email !== 'string' || email.trim() === '') {
        return { valid: false, message: 'The email should be a valid string' };
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'The email address format is invalid' };
    }

    if (typeof password !== 'string' || password.trim() === '') {
        return { valid: false, message: 'The password should be a valid string' };
    }

    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialCharOrSpace = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]/.test(password);

    if (password.length < minLength) {
        return { valid: false, message: `Password must be at least ${minLength} characters long.` };
    }

    if (!hasUpperCase) {
        return { valid: false, message: 'Password must contain at least one uppercase letter.' };
    }

    if (!hasLowerCase) {
        return { valid: false, message: 'Password must contain at least one lowercase letter.' };
    }

    if (!hasNumber) {
        return { valid: false, message: 'Password must contain at least one number.' };
    }

    if (!hasSpecialCharOrSpace) {
        return { valid: false, message: 'Password must contain at least one special character or a space.' };
    }

    const nameLower = name.toLowerCase().trim();
    const emailUserPart = email.split('@')[0].toLowerCase();
    const passwordLower = password.toLowerCase();

    if (passwordLower.includes(nameLower) && nameLower.length > 2) {
        return { valid: false, message: 'Password should not contain your name.' };
    }

    if (passwordLower.includes(emailUserPart) && emailUserPart.length > 2) {
        return { valid: false, message: 'Password should not contain part of your email address.' };
    }
    
    return { valid: true, message: 'Registration data is valid.' };
}