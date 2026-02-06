export function isValidString(str) { typeof str === 'string' && str.trim() !== '' };

export function isValidSalary(year) { typeof year === 'number' && year > 0 };

export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}