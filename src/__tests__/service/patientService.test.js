/* eslint-disable no-undef */
import { 
    createPatient, 
    listPatients, 
    findPatientByName, 
    deletePatientById, 
    updatePatientById, 
    listPatientsByAge, 
} from '../../service/patientService.js';
import * as patientRepository from '../../repository/patientRepository.js';

jest.mock('../../repository/patientRepository.js');

describe('Patient Service', () => {
    it('should create a patient', () => {
        const createdPatient = { name: 'Test name', age: 22, id: null };
        jest.spyOn(patientRepository, 'create').mockReturnValue(createdPatient);
    
        const result = createPatient({ name: 'Test name', age: 22 });
    
        expect(result).toEqual(createdPatient);
        expect(patientRepository.create).toHaveBeenCalledWith({ name: 'Test name', age: 22, id: null });
    });

    it('should list all patients', () => {
        const mockPatients = [{ name: 'Test name', age: 22 }];
        patientRepository.findAll.mockReturnValue(mockPatients);

        const result = listPatients();

        expect(result).toEqual(mockPatients);
        expect(patientRepository.findAll).toHaveBeenCalled();
    });

    it('should find a patient by name', () => {
        const mockPatient = { name: 'Test name', age: 22 };
        patientRepository.findByName.mockReturnValue(mockPatient);

        const result = findPatientByName('Test name');

        expect(result).toEqual(mockPatient);
        expect(patientRepository.findByName).toHaveBeenCalledWith('Test name');
    });

    it('should list patients by age', () => {
        const mockPatients = [{ name: 'Test name', age: 22 }];
        patientRepository.listByAge.mockReturnValue(mockPatients);

        const result = listPatientsByAge(22);

        expect(result).toEqual(mockPatients);
        expect(patientRepository.listByAge).toHaveBeenCalledWith(22);
    });

    it('should return null if patient to delete is not found', () => {
        patientRepository.deleteById.mockReturnValue(null);

        const result = deletePatientById('999');

        expect(result).toBeNull();
        expect(patientRepository.deleteById).toHaveBeenCalledWith('999');
    });

    it('should delete a patient by id', () => {
        const mockPatient = { name: 'Test name', age: 22 };
        patientRepository.deleteById.mockReturnValue(mockPatient);

        const result = deletePatientById('999');

        expect(result).toEqual(mockPatient);
        expect(patientRepository.deleteById).toHaveBeenCalledWith('999');
    });

    it('should update a patient by id', () => {
        const updatedPatient = { name: 'Test name', age: 22, id: '999' };
        jest.spyOn(patientRepository, 'updateById').mockReturnValue(updatedPatient);

        const result = updatePatientById('999', { name: 'Test name', age: 22 });

        expect(result).toEqual(updatedPatient);
        expect(patientRepository.updateById).toHaveBeenCalledWith('999', { name: 'Test name', age: 22 });
    });

    it('should return null if patient to update is not found', () => {
        patientRepository.updateById.mockReturnValue(null);

        const result = updatePatientById('999', { name: 'Test name', age: 22 });

        expect(result).toBeNull();
        expect(patientRepository.updateById).toHaveBeenCalledWith('999', { name: 'Test name', age: 22 });
    });

    it('should log not found message if patient is not found', () => {
        jest.spyOn(patientRepository, 'deleteById').mockReturnValue(null);

        deletePatientById('1');
    });

});