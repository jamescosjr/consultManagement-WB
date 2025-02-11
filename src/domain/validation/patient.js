export function validatePatientData(name, age) {
    if (typeof name !== 'string' || name.trim() === '') {
        return { valid: false, message: 'The name should be a valid string' };
    }
    if (typeof age !== 'number' || isNaN(age)) {
        return { valid: false, message: 'The age should be a valid number' };
    }
    return { valid: true };
};