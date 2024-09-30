/* eslint-disable no-undef */
import {
    createConsultHandler,
    listConsultsHandler,
    listConsultsByDescriptionHandler,
    listConsultsByDateHandler,
    listConsultsByDoctorIdHandler,
    listConsultsByPatientIdHandler,
    deleteConsultHandler,
    updateConsultHandler,
} from '../../controllers/consultController.js';
import * as consultService from '../../service/consultService.js';

const logSpy = jest.spyOn(console, 'log').mockImplementation();
const errorSpy = jest.spyOn(console, 'error').mockImplementation();

afterEach(() => {
    jest.clearAllMocks();
});

describe('Consult Handlers', () => {
    it('should log success message when creating a consult', () => {
        const mockConsult = { description: 'Test description', date: '2021-09-09', doctorId: 1, patientId: 1 };
        jest.spyOn(consultService, 'createConsult').mockReturnValue(mockConsult);

        createConsultHandler(mockConsult);

        expect(logSpy).toHaveBeenCalledWith('Consult created successfully:', mockConsult);
    });

    it('should log error message when creating a consult fails', () => {
        jest.spyOn(consultService, 'createConsult').mockImplementation(() => {
            throw new Error('Creation Error');
        });

        createConsultHandler({ description: 'Test description', date: '2021-09-09', doctorId: 1, patientId: 1 });

        expect(errorSpy).toHaveBeenCalledWith('Error registering consult:', 'Creation Error');
    });

    it('should list all consults', () => {
        const mockConsults = [{ description: 'Test description', date: '2021-09-09', doctorId: 1, patientId: 1 }];
        jest.spyOn(consultService, 'listConsults').mockReturnValue(mockConsults);

        listConsultsHandler();

        expect(logSpy).toHaveBeenCalledWith('consults:', mockConsults);
    });

    it('should list consults by description', () => {
        const mockConsults = [{ description: 'Test description', date: '2021-09-09', doctorId: 1, patientId: 1 }];
        jest.spyOn(consultService, 'listConsultsByDescription').mockReturnValue(mockConsults);

        listConsultsByDescriptionHandler('Test description');

        expect(logSpy).toHaveBeenCalledWith('Consult found:', mockConsults);
    });

    it('should list consults by date', () => {
        const mockConsults = [{ description: 'Test description', date: '2021-09-09', doctorId: 1, patientId: 1 }];
        jest.spyOn(consultService, 'listConsultsByDate').mockReturnValue(mockConsults);

        listConsultsByDateHandler('2021-09-09');

        expect(logSpy).toHaveBeenCalledWith('Consult found:', mockConsults);
    });

    it('should list consults by doctor id', () => {
        const mockConsults = [{ description: 'Test description', date: '2021-09-09', doctorId: 1, patientId: 1 }];
        jest.spyOn(consultService, 'listConsultsByDoctorId').mockReturnValue(mockConsults);
        
        listConsultsByDoctorIdHandler(1);

        expect(logSpy).toHaveBeenCalledWith('Consults found:', mockConsults);
    });

    it('should list consults by patient id', () => {
        const mockConsults = [{ description: 'Test description', date: '2021-09-09', doctorId: 1, patientId: 1 }];
        jest.spyOn(consultService, 'listConsultsByPatientId').mockReturnValue(mockConsults);

        listConsultsByPatientIdHandler(1);

        expect(logSpy).toHaveBeenCalledWith('Consults found:', mockConsults);
    });

    it('should log error message when deleting a consult fails', () => {
        jest.spyOn(consultService, 'deleteConsultById').mockImplementation(() => {
            throw new Error('Delete Error');
        });

        deleteConsultHandler(1);

        expect(errorSpy).toHaveBeenCalledWith('Error deleting consult:', 'Delete Error');
    });

    it('should log success message when updating a consult', () => {
        const mockConsult = { description: 'Test description', date: '2021-09-09', doctorId: 1, patientId: 1 };
        jest.spyOn(consultService, 'updateConsultById').mockReturnValue(mockConsult);

        updateConsultHandler(1, mockConsult);

        expect(logSpy).toHaveBeenCalledWith('Consult updated successfully:', mockConsult);
    });

    it('should log error message when updating a consult fails', () => {
        jest.spyOn(consultService, 'updateConsultById').mockImplementation(() => {
            throw new Error('Update Error');
        });

        updateConsultHandler(1, { description: 'Test description', date: '2021-09-09', doctorId: 1, patientId: 1 });

        expect(errorSpy).toHaveBeenCalledWith('Error updating consult:', 'Update Error');
    });

    it('should log not found message if consult is not found', () => {
        jest.spyOn(consultService, 'updateConsultById').mockReturnValue(null);

        updateConsultHandler(1, { description: 'Test description', date: '2021-09-09', doctorId: 1, patientId: 1 });

        expect(logSpy).toHaveBeenCalledWith('Consult not found, nothing to update.');
    });
});