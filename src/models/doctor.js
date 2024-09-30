function validateDoctorData({ name, specialty }) {
    if (!name || typeof name !== 'string') {
        throw new Error('Invalid name');
    }
    if (!specialty || typeof specialty !== 'string') {
        throw new Error('Invalid specialty');
    }
};

export function createDoctorModel({ name, specialty }) {
    validateDoctorData({ name, specialty });
    return { name, specialty,  id: null };
};