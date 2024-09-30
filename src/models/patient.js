function validatePatientData({ name, age }) {
    if (!name || typeof name !== 'string') {
        throw new Error('Invalid name');
    }
    if (!age || typeof age !== 'number' || age < 0) {
        throw new Error('Invalid age');
    }
};

export function createPatientModel({ name, age }) {
    validatePatientData({ name, age });
    return { name, age,  id: null };
};