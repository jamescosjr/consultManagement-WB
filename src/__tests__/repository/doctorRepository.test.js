/* eslint-disable no-undef */
import {
    create,
    findAll,
    findByName,
    deleteById,
    updateById,
    listBySpecialty,
    doctors,
 } from '../../repository/doctorRepository.js';
import { generateId } from '../../utils/generateId.js';

jest.mock('../../utils/generateId.js');
const mockGenerateId = generateId;

describe('Doctor Repository', () => {
    beforeEach(() => {
        doctors.length = 0; 
        mockGenerateId.mockClear(); 
    });

    it('should create a new doctor with a unique id', () => {
        const id = generateId();
        const doctorData = { name: 'Test name', specialty: 'Test specialty' };
        const createDoctor = create(doctorData);

        expect(createDoctor).toMatchObject(doctorData);
        expect(typeof createDoctor.id).toEqual(expect.any(String));
        expect(findAll()).toContainEqual(createDoctor);
        expect(id).toBe(createDoctor.id);
    });

    it('should find all doctors', () => {
        mockGenerateId.mockReturnValueOnce('id1').mockReturnValueOnce('id2');
        const doctor1 = create({ name: 'name 1', specialty: 'specialty 1' });
        const doctor2 = create({ name: 'name 2', specialty: 'specialty 2' });

        const allDoctors = findAll();

        expect(allDoctors).toEqual([doctor1, doctor2]);
    });

    it('should find a doctor by name', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const doctor = create({ name: 'Unique name', specialty: 'Unique specialty' });
        const foundDoctor = findByName('Unique name');

        expect(foundDoctor).toEqual(doctor);
    });

    it('should return undefined when finding a doctor by a non-existing name', () => {
        const foundDoctor = findByName('Non-existing name');

        expect(foundDoctor).toBeUndefined();
    });

    it('should list doctors by specialty', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const doctor1 = create({ name: 'name 1', specialty: 'specialty 1' });
        const doctor2 = create({ name: 'name 2', specialty: 'specialty 2' });

        const doctorsBySpecialty = listBySpecialty('specialty 1');
        const doctorsBySpecialty2 = listBySpecialty('specialty 2');

        expect(doctorsBySpecialty2).toEqual([doctor2]);
        expect(doctorsBySpecialty).toEqual([doctor1]);
    });

    it('should list doctors by specialty', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const doctor1 = create({ name: 'name 1', specialty: 'specialty 1' });
        const doctor2 = create({ name: 'name 2', specialty: 'specialty 2' });

        const doctorsBySpecialty = listBySpecialty('specialty 2');
        const doctorsBySpecialty2 = listBySpecialty('specialty 1');

        expect(doctorsBySpecialty).toEqual([doctor2]);
        expect(doctorsBySpecialty2).toEqual([doctor1]);
    });

    it('should return an empty array when listing doctors by a non-existing specialty', () => {
        const doctorsBySpecialty = listBySpecialty('specialty');

        expect(doctorsBySpecialty).toEqual([]);
    });

    it('should delete a doctor by id', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const doctor = create({ name: 'name to Delete', specialty: 'specialty' });
        const deletedDoctor = deleteById(doctor.id);

        expect(deletedDoctor).toEqual(doctor);
        expect(findAll()).not.toContainEqual(doctor);
    });

    it('should return null when deleting a doctor by a non-existing id', () => {
        const deletedDoctor = deleteById('non-existing-id');

        expect(deletedDoctor).toBeNull();
    });

    it('should update a doctor by id', () => {
        mockGenerateId.mockReturnValue('unique-id');
        const doctor = create({ name: 'name to Update', specialty: 'specialty' });
        const updatedDoctor = updateById(doctor.id, { name: 'Updated name' });

        expect(updatedDoctor).toMatchObject({ ...doctor, name: 'Updated name' });
    });

    it('should return null when updating a doctor by a non-existing id', () => {
        const updatedDoctor = updateById('non-existing-id', { name: 'Updated name' });

        expect(updatedDoctor).toBeNull();
    });
});
