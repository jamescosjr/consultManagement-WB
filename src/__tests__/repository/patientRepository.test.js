/* eslint-disable no-undef */
import {
    create,
    findAll,
    findByName,
    deleteById,
    updateById,
    listByAge,
    patients,
 } from '../../repository/patientRepository.js';
import { generateId } from '../../utils/generateId.js';

jest.mock('../../utils/generateId.js');
const mockGenerateId = generateId;

describe('Patient Repository', () => {
    beforeEach(() => {
        patients.length = 0; 
        mockGenerateId.mockClear(); 
    });

    it('should create a new patient with a unique id', () => {
        const id = generateId();
        const patientData = { name: 'Test name', age: 22 };
        const createPatient = create(patientData);

        expect(createPatient).toMatchObject(patientData);
        expect(typeof createPatient.id).toEqual(expect.any(String));
        expect(findAll()).toContainEqual(createPatient);
        expect(id).toBe(createPatient.id);
    });

    it('should find all patients', () => {
        mockGenerateId.mockReturnValueOnce('id1').mockReturnValueOnce('id2');
        const patient1 = create({ name: 'name 1', age: 22 });
        const patient2 = create({ name: 'name 2', age: 22 });

        const allPatients = findAll();

        expect(allPatients).toEqual([patient1, patient2]);
    });

    it('should find a patient by name', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const patient = create({ name: 'Unique name', age: 22 });
        const foundPatient = findByName('Unique name');

        expect(foundPatient).toEqual(patient);
    });

    it('should return undefined when finding a patient by a non-existing name', () => {
        const foundPatient = findByName('Non-existing name');

        expect(foundPatient).toBeUndefined();
    });

    it('should list patients by age', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const patient1 = create({ name: 'name 1', age: 22 });
        const patient2 = create({ name: 'name 2', age: 22 });

        const patientsByAge = listByAge(22);

        expect(patientsByAge).toEqual([patient1, patient2]);
    });

    it('should return an empty array when no patients are found with the given age', () => {
        const patientsByAge = listByAge(22);

        expect(patientsByAge).toEqual([]);
    });

    it('should delete a patient by id', () => {
        mockGenerateId.mockReturnValueOnce('id1').mockReturnValueOnce('id2');
        const patient1 = create({ name: 'name 1', age: 22 });
        const patient2 = create({ name: 'name 2', age: 22 });

        const deletedPatient = deleteById('id1');

        expect(deletedPatient).toEqual(patient1);
        expect(findAll()).toEqual([patient2]);
    });

    it('should return null when trying to delete a non-existing patient', () => {
        mockGenerateId.mockReturnValueOnce('id1').mockReturnValueOnce('id2');
        create({ name: 'name 1', age: 22 });
        create({ name: 'name 2', age: 22 });

        const deletedPatient = deleteById('non-existing-id');

        expect(deletedPatient).toBeNull();
    });

    it('should update a patient by id', () => {
        mockGenerateId.mockReturnValue('unique-id');
        create({ name: 'name 1', age: 22 });
        const updatedPatient = updateById('unique-id', { name: 'name 2' });

        expect(updatedPatient).toEqual({ id: 'unique-id', name: 'name 2', age: 22 });
        expect(findAll()).toEqual([updatedPatient]);
    });

    it('should return null when trying to update a non-existing patient', () => {
        mockGenerateId.mockReturnValue('unique-id');
        create({ name: 'name 1', age: 22 });

        const updatedPatient = updateById('non-existing-id', { name: 'name 2' });

        expect(updatedPatient).toBeNull();
    });

    it('should return null when trying to update a patient with an invalid id', () => {
        mockGenerateId.mockReturnValue('unique-id');
        create({ name: 'name 1', age: 22 });

        const updatedPatient = updateById('invalid-id', { name: 'name 2' });

        expect(updatedPatient).toBeNull();
    });

});