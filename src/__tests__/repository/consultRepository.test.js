/* eslint-disable no-undef */
import {
    create,
    findAll,
    findByPatientId,
    findByDoctorId,
    findByDate,
    findByDescription,
    deleteById,
    updateById,
    consults
} from '../../repository/consultRepository.js';
import { generateId } from '../../utils/generateId.js';

jest.mock('../../utils/generateId.js');
const mockGenerateId = generateId;

describe('Consult Repository', () => {
    beforeEach(() => {
        consults.length = 0;
        mockGenerateId.mockClear();
    });

    it('should create a new consult with a unique id', () => {
        const id = generateId();
        const consultData = { patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' };
        const createConsult = create(consultData);

        expect(createConsult).toMatchObject(consultData);
        expect(typeof createConsult.id).toEqual(expect.any(String));
        expect(findAll()).toContainEqual(createConsult);
        expect(id).toBe(createConsult.id);
    });

    it('should find all consults', () => {
        mockGenerateId.mockReturnValueOnce('id1').mockReturnValueOnce('id2');
        const consult1 = create({ patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' });
        const consult2 = create({ patientId: '2', doctorId: '3', date: '2021-09-02', description: 'Test description' });

        const allConsults = findAll();

        expect(allConsults).toEqual([consult1, consult2]);
    });

    it('should find a consult by patient id', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const consult = create({ patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' });
        const foundConsult = findByPatientId('1');

        expect(foundConsult).toEqual([consult]);
    });

    it('should return undefined when finding a consult by a non-existing patient id', () => {
        const foundConsult = findByPatientId('999');

        expect(foundConsult).toEqual([]);
    });

    it('should find a consult by doctor id', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const consult = create({ patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' });
        const foundConsult = findByDoctorId('2');

        expect(foundConsult).toEqual([consult]);
    });

    it('should return undefined when finding a consult by a non-existing doctor id', () => {
        const foundConsult = findByDoctorId('999');

        expect(foundConsult).toEqual([]);
    });

    it('should find a consult by date', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const consult = create({ patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' });
        const foundConsult = findByDate('2021-09-01');

        expect(foundConsult).toEqual([consult]);
    });

    it('should return undefined when finding a consult by a non-existing date', () => {
        const foundConsult = findByDate('2021-09-01');

        expect(foundConsult).toEqual([]);
    });

    it('should find a consult by description', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const consult = create({ patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' });
        const foundConsult = findByDescription('Test description');

        expect(foundConsult).toEqual([consult]);
    });

    it('should return undefined when finding a consult by a non-existing description', () => {
        const foundConsult = findByDescription('Test description');

        expect(foundConsult).toEqual([]);
    });

    it('should delete a consult by id', () => {
        mockGenerateId.mockReturnValueOnce('id1').mockReturnValueOnce('id2');
        const consult1 = create({ patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' });
        const consult2 = create({ patientId: '2', doctorId: '3', date: '2021-09-02', description: 'Test description' });

        const deletedConsult = deleteById('id1');

        expect(deletedConsult).toEqual(consult1);
        expect(findAll()).toEqual([consult2]);
    });

    it('should return null when trying to delete a non-existing consult', () => {
        mockGenerateId.mockReturnValueOnce('id1').mockReturnValueOnce('id2');
        create({ patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' });
        create({ patientId: '2', doctorId: '3', date: '2021-09-02', description: 'Test description' });

        const deletedConsult = deleteById('non-existing-id');

        expect(deletedConsult).toBeNull();
    });

    it('should update a consult by id', () => {
        mockGenerateId.mockReturnValueOnce('id1').mockReturnValueOnce('id2');
        const consult1 = create({ patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' });
        const consult2 = create({ patientId: '2', doctorId: '3', date: '2021-09-02', description: 'Test description' });

        const updatedConsult = updateById('id1', { date: '2021-09-03' });

        expect(updatedConsult).toEqual({ ...consult1, date: '2021-09-03' });
        expect(findAll()).toEqual([{ ...consult1, date: '2021-09-03' }, consult2]);
    });

    it('should return null when trying to update a non-existing consult', () => {
        mockGenerateId.mockReturnValueOnce('id1').mockReturnValueOnce('id2');
        create({ patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' });
        create({ patientId: '2', doctorId: '3', date: '2021-09-02', description: 'Test description' });

        const updatedConsult = updateById('non-existing-id', { date: '2021-09-03' });

        expect(updatedConsult).toBeNull();
    });
});