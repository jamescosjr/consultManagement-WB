export function validateDoctorData(name, specialty) {
    if (typeof name !== 'string' || name.trim() === '') {
        return { valid: false, message: 'The name should be a valid string' };
    }
    if (typeof specialty !== 'string' || specialty.trim() === '') {
        return { valid: false, message: 'The specialty should be a valid string' };
    }
    return { valid: true };
};