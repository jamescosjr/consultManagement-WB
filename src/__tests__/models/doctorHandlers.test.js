/* eslint-disable no-undef */
import {
    createDoctorHandler,
    listDoctorsHandler,
    deleteDoctorHandler,
    updateDoctorHandler, 
    findDoctorByNameHandler,
    listDoctorsBySpecialtyHandler
 } from '../../controllers/doctorController.js';
import * as doctorService from '../../service/doctorService.js';

const logSpy = jest.spyOn(console, 'log').mockImplementation();
const errorSpy = jest.spyOn(console, 'error').mockImplementation();

afterEach(() => {
    jest.clearAllMocks();
});

describe('Doctor Handlers', () => {
    it('should log success message when registering a doctor', () => {
        const mockDoctor = { name: 'Test name', specialty: 'Test specialty' };
        jest.spyOn(doctorService, 'createDoctor').mockReturnValue(mockDoctor);

        createDoctorHandler(mockDoctor);

        expect(logSpy).toHaveBeenCalledWith('Doctor created successfully:', mockDoctor);
    });   

    it('should log error message when creating a doctor fails', () => {
        jest.spyOn(doctorService, 'createDoctor').mockImplementation(() => {
            throw new Error('Creation Error');
        });

        createDoctorHandler({ name: 'Test name', specialty: 'Test specialty' });

        expect(errorSpy).toHaveBeenCalledWith('Error registering doctor:', 'Creation Error');
    });

    it('should list all doctors', () => {
        const mockDoctors = [{ name: 'Test name', specialty: 'Test specialty' }];
        jest.spyOn(doctorService, 'listDoctors').mockReturnValue(mockDoctors);
    
        listDoctorsHandler();
    
        expect(logSpy).toHaveBeenCalledWith('doctors:', mockDoctors);
    });

    it('should find a doctor by name', () => {
        const mockDoctor = { name: 'Test name', specialty: 'Test specialty' };
        jest.spyOn(doctorService, 'findDoctorByName').mockReturnValue(mockDoctor);
    
        findDoctorByNameHandler('Test name');
    
        expect(logSpy).toHaveBeenCalledWith('doctor found:', mockDoctor);
    });
    
    it('should log not found message if doctor is not found', () => {
        jest.spyOn(doctorService, 'findDoctorByName').mockReturnValue(null);
    
        findDoctorByNameHandler('Nonexistent name');
    
        expect(logSpy).toHaveBeenCalledWith('Doctor not found.');
    });

    it('should list doctors by specialty', () => {
        const mockDoctors = [{ name: 'Test name', specialty: 'Test specialty' }];
        jest.spyOn(doctorService, 'listDoctorsBySpecialty').mockReturnValue(mockDoctors);
    });

    it('should log error message when listing doctors by specialty fails', () => {
        jest.spyOn(doctorService, 'listDoctorsBySpecialty').mockImplementation(() => {
            throw new Error('Doctor not found');
        });
    
        listDoctorsBySpecialtyHandler('Test specialty');
    
        expect(errorSpy).toHaveBeenCalledWith('Error listing doctors by specialty:', 'Doctor not found');
    });
    
    it('should delete a doctor by id', () => {
        const mockDoctor = { name: 'Test name', specialty: 'Test specialty', id: 1 };
        jest.spyOn(doctorService, 'deleteDoctorById').mockReturnValue(mockDoctor);

        deleteDoctorHandler(1);

        expect(logSpy).toHaveBeenCalledWith('Doctor deleted successfully:', mockDoctor);
    });

    it('should log not found message if doctor to delete is not found', () => {
        jest.spyOn(doctorService, 'deleteDoctorById').mockReturnValue(null);
    
        deleteDoctorHandler(999);
    
        expect(logSpy).toHaveBeenCalledWith('Doctor not found, nothing to delete.');
    });
    
    it('should log error message when deleting a doctor fails', () => {
        jest.spyOn(doctorService, 'deleteDoctorById').mockImplementation(() => {
            throw new Error('Deletion Error');
        });
    
        deleteDoctorHandler(1);
    
        expect(errorSpy).toHaveBeenCalledWith('Error deleting doctor:', 'Deletion Error');
    });

    it('should update a doctor by id', () => {
        const mockDoctor = { name: 'Test name', specialty: 'Test specialty', id: 1 };
        jest.spyOn(doctorService, 'updateDoctorById').mockReturnValue(mockDoctor);

        updateDoctorHandler(1, mockDoctor);

        expect(logSpy).toHaveBeenCalledWith('Doctor updated successfully:', mockDoctor);
    });

    it('should log not found message if doctor to update is not found', () => {
        jest.spyOn(doctorService, 'updateDoctorById').mockReturnValue(null);
    
        updateDoctorHandler(999, { name: 'Test name', specialty: 'Test specialty' });
    
        expect(logSpy).toHaveBeenCalledWith('Doctor not found, nothing to update.');
    });
});
