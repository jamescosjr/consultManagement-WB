export function validateRegisterData(name, email, password, role = 'client', roleDetails = null) {
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

    // Validate role
    const validRoles = ['root', 'client', 'doctor', 'employee'];
    if (!validRoles.includes(role)) {
        return { valid: false, message: `Role must be one of: ${validRoles.join(', ')}` };
    }

    // Validate roleDetails based on role
    if (role === 'doctor') {
        if (!roleDetails || typeof roleDetails !== 'object') {
            return { valid: false, message: 'Doctor role requires roleDetails with specialty' };
        }
        if (typeof roleDetails.specialty !== 'string' || roleDetails.specialty.trim() === '') {
            return { valid: false, message: 'Doctor specialty is required and must be a valid string' };
        }
    }

    if (role === 'client') {
        if (!roleDetails || typeof roleDetails !== 'object') {
            return { valid: false, message: 'Client role requires roleDetails with age' };
        }
        if (typeof roleDetails.age !== 'number' || roleDetails.age <= 0 || roleDetails.age > 150) {
            return { valid: false, message: 'Patient age is required and must be a valid number between 1 and 150' };
        }
    }
    
    return { valid: true, message: 'Registration data is valid.' };
}

export function validateLoginData(email, password) {
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
    return { valid: true, message: 'Login data is valid.' };
}