/* eslint-disable no-undef */
import {
    createConsult,
    listConsults,
    listConsultsByDescription,
    listConsultsByDate,
    listConsultsByDoctorId,
    listConsultsByPatientId,
    deleteConsultById,
    updateConsultById
} from '../../service/consultService';
import * as consultRepository from '../../repository/consultRepository.js';
import {doctors} from '../../repository/doctorRepository.js';
import {patients} from '../../repository/patientRepository.js';

jest.mock('../../repository/consultRepository');

describe('Consult Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a consult', async () => {
        const createdConsult = { patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' };
        
        jest.spyOn(consultRepository, 'create').mockReturnValue(createdConsult);

        doctors.push({ id: '2', name: 'Test Doctor' });
        patients.push({ id: '1', name: 'Test Patient' });

        const result = createConsult({ patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' });

        expect(result).toEqual(createdConsult);
        expect(consultRepository.create).toHaveBeenCalledWith({ patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description', id: null });
    });

    it('should list all consults', () => {
        const mockConsults = [{ patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' }];
        consultRepository.findAll.mockReturnValue(mockConsults);

        const result = listConsults();

        expect(result).toEqual(mockConsults);
        expect(consultRepository.findAll).toHaveBeenCalled();
    });

    it('should find a consult by date', () => {
        const mockConsult = { patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' };
        consultRepository.findByDate.mockReturnValue(mockConsult);

        const result = listConsultsByDate('2021-09-01');

        expect(result).toEqual(mockConsult);
        expect(consultRepository.findByDate).toHaveBeenCalledWith('2021-09-01');
    });

    it('should list consults by description', () => {
        const mockConsults = [{ patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' }];
        consultRepository.findByDescription.mockReturnValue(mockConsults);

        const result = listConsultsByDescription('Test description');

        expect(result).toEqual(mockConsults);
        expect(consultRepository.findByDescription).toHaveBeenCalledWith('Test description');
    });

    it('should list consults by doctor id', () => {
        const mockConsults = [{ patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' }];
        consultRepository.findByDoctorId.mockReturnValue(mockConsults);

        const result = listConsultsByDoctorId('2');

        expect(result).toEqual(mockConsults);
        expect(consultRepository.findByDoctorId).toHaveBeenCalledWith('2');
    });

    it('should list consults by patient id', () => {
        const mockConsults = [{ patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' }];
        consultRepository.findByPatientId.mockReturnValue(mockConsults);

        const result = listConsultsByPatientId('1');

        expect(result).toEqual(mockConsults);
        expect(consultRepository.findByPatientId).toHaveBeenCalledWith('1');
    });

    it('should return null if consult to delete is not found', () => {
        consultRepository.deleteById.mockReturnValue(null);

        const result = deleteConsultById('999');

        expect(result).toBeNull();
        expect(consultRepository.deleteById).toHaveBeenCalledWith('999');
    });

    it('should delete a consult by id', () => {
        const mockConsult = { patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' };
        consultRepository.deleteById.mockReturnValue(mockConsult);

        const result = deleteConsultById('999');

        expect(result).toEqual(mockConsult);
        expect(consultRepository.deleteById).toHaveBeenCalledWith('999');
    });

    it('should update a consult by id', () => {
        const updatedConsult = { patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description', id: '999' };
        jest.spyOn(consultRepository, 'updateById').mockReturnValue(updatedConsult);

        const result = updateConsultById('999', { patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' });

        expect(result).toEqual(updatedConsult);
        expect(consultRepository.updateById).toHaveBeenCalledWith('999', { patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' });
    });

    it('should return null if consult to update is not found', () => {
        consultRepository.updateById.mockReturnValue(null);

        const result = updateConsultById('999', { patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' });

        expect(result).toBeNull();
        expect(consultRepository.updateById).toHaveBeenCalledWith('999', { patientId: '1', doctorId: '2', date: '2021-09-01', description: 'Test description' });
    });

    it('should log not found message if consult is not found', () => {
        jest.spyOn(consultRepository, 'deleteById').mockReturnValue(null);

        deleteConsultById('1');
    });
});