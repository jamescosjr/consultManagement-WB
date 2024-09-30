/* eslint-disable no-undef */
import {
    createPatientHandler,
    listPatientsHandler,
    deletePatientHandler,
    updatePatientHandler, 
    findPatientByNameHandler,
    listPatientsByAgeHandler
 } from '../../controllers/patientController.js';
import * as patientService from '../../service/patientService.js';

const logSpy = jest.spyOn(console, 'log').mockImplementation();
const errorSpy = jest.spyOn(console, 'error').mockImplementation();

afterEach(() => {
    jest.clearAllMocks();
});

describe('Patient Handlers', () => {
    it('should log success message when registering a patient', () => {
        const mockPatient = { name: 'Test name', age: 22 };
        jest.spyOn(patientService, 'createPatient').mockReturnValue(mockPatient);

        createPatientHandler(mockPatient);

        expect(logSpy).toHaveBeenCalledWith('Patient created successfully:', mockPatient);
    });   

    it('should log error message when creating a patient fails', () => {
        jest.spyOn(patientService, 'createPatient').mockImplementation(() => {
            throw new Error('Creation Error');
        });

        createPatientHandler({ name: 'Test name', age: 22 });

        expect(errorSpy).toHaveBeenCalledWith('Error registering patient:', 'Creation Error');
    });

    it('should list all patients', () => {
        const mockPatients = [{ name: 'Test name', age: 22 }];
        jest.spyOn(patientService, 'listPatients').mockReturnValue(mockPatients);
    
        listPatientsHandler();
    
        expect(logSpy).toHaveBeenCalledWith('patients:', mockPatients);
    });

    it('should find a patient by name', () => {
        const mockPatient = { name: 'Test name', age: 22 };
        jest.spyOn(patientService, 'findPatientByName').mockReturnValue(mockPatient);
    
        findPatientByNameHandler('Test name');
    
        expect(logSpy).toHaveBeenCalledWith('patient found:', mockPatient);
    });
    
    it('should log not found message if patient is not found', () => {
        jest.spyOn(patientService, 'findPatientByName').mockReturnValue(null);
    
        findPatientByNameHandler('Nonexistent name');
    
        expect(logSpy).toHaveBeenCalledWith('Patient not found.');
    });

    it('should list patients by age', () => {
        const mockPatients = [{ name: 'Test name', age: 22 }];
        jest.spyOn(patientService, 'listPatientsByAge').mockReturnValue(mockPatients);
    });

    it('should log error message when listing patients by age fails', () => {
        jest.spyOn(patientService, 'listPatientsByAge').mockImplementation(() => {
            throw new Error('List Error');
        });

        listPatientsByAgeHandler(22);

        expect(errorSpy).toHaveBeenCalledWith('Error listing patients by age:', 'List Error');
    });

    it('should log success message when deleting a patient', () => {
        const mockPatient = { name: 'Test name', age: 22 };
        jest.spyOn(patientService, 'deletePatientById').mockReturnValue(mockPatient);

        deletePatientHandler(1);

        expect(logSpy).toHaveBeenCalledWith('Patient deleted successfully:', mockPatient);
    });

    it('should log not found message if patient is not found', () => {
        jest.spyOn(patientService, 'deletePatientById').mockReturnValue(null);

        deletePatientHandler(1);

        expect(logSpy).toHaveBeenCalledWith('Doctor not found, nothing to delete.');
    });

    it('should log error message when deleting a patient fails', () => {
        jest.spyOn(patientService, 'deletePatientById').mockImplementation(() => {
            throw new Error('Delete Error');
        });

        deletePatientHandler(1);

        expect(errorSpy).toHaveBeenCalledWith('Error deleting patient:', 'Delete Error');
    });

    it('should log success message when updating a patient', () => {
        const mockPatient = { name: 'Test name', age: 22 };
        jest.spyOn(patientService, 'updatePatientById').mockReturnValue(mockPatient);

        updatePatientHandler(1, mockPatient);

        expect(logSpy).toHaveBeenCalledWith('Patient updated successfully:', mockPatient);
    });

    it('should log not found message if patient is not found', () => {
        jest.spyOn(patientService, 'updatePatientById').mockReturnValue(null);

        updatePatientHandler(1, { name: 'Test name', age: 22 });

        expect(logSpy).toHaveBeenCalledWith('Patient not found, nothing to update.');
    });

    it('should log error message when updating a patient fails', () => {
        jest.spyOn(patientService, 'updatePatientById').mockImplementation(() => {
            throw new Error('Update Error');
        });

        updatePatientHandler(1, { name: 'Test name', age: 22 });

        expect(errorSpy).toHaveBeenCalledWith('Error updating patient:', 'Update Error');
    });

});