export function validateUpdateUserData(name, email, role) {
    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim() === '') {
            return { valid: false, message: 'The name should be a valid string' };
        }
    }

    if (email !== undefined) {
        if (typeof email !== 'string' || email.trim() === '') {
            return { valid: false, message: 'The email should be a valid string' };
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return { valid: false, message: 'The email address format is invalid' };
        }
    }

    if (role !== undefined) {
        if (typeof role !== 'string' || role.trim() === '') {
            return { valid: false, message: 'The role should be a valid string' };
        }

        const validRoles = ['root', 'client', 'doctor', 'employee'];
        if (!validRoles.includes(role)) {
            return { valid: false, message: `Role must be one of: ${validRoles.join(', ')}` };
        }
    }

    return { valid: true, message: 'User data is valid.' };
}

export function validatePasswordChange(currentPassword, newPassword, name, email) {
    if (typeof currentPassword !== 'string' || currentPassword.trim() === '') {
        return { valid: false, message: 'The current password should be a valid string' };
    }

    if (typeof newPassword !== 'string' || newPassword.trim() === '') {
        return { valid: false, message: 'The new password should be a valid string' };
    }

    if (currentPassword === newPassword) {
        return { valid: false, message: 'New password must be different from current password' };
    }

    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialCharOrSpace = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]/.test(newPassword);

    if (newPassword.length < minLength) {
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

    if (name) {
        const nameLower = name.toLowerCase().trim();
        const passwordLower = newPassword.toLowerCase();
        if (passwordLower.includes(nameLower) && nameLower.length > 2) {
            return { valid: false, message: 'Password should not contain your name.' };
        }
    }

    if (email) {
        const emailUserPart = email.split('@')[0].toLowerCase();
        const passwordLower = newPassword.toLowerCase();
        if (passwordLower.includes(emailUserPart) && emailUserPart.length > 2) {
            return { valid: false, message: 'Password should not contain part of your email address.' };
        }
    }

    return { valid: true, message: 'Password is valid.' };
}

export function validateUserRole(role) {
    if (typeof role !== 'string' || role.trim() === '') {
        return { valid: false, message: 'The role should be a valid string' };
    }

    const validRoles = ['root', 'client', 'doctor', 'employee'];
    if (!validRoles.includes(role)) {
        return { valid: false, message: `Role must be one of: ${validRoles.join(', ')}` };
    }

    return { valid: true, message: 'Role is valid.' };
}
