/* eslint-disable no-undef */
import { 
    createDoctor, 
    listDoctors, 
    findDoctorByName, 
    deleteDoctorById, 
    updateDoctorById, 
    listDoctorsBySpecialty, 
} from '../../service/doctorService.js';
import * as doctorRepository from '../../repository/doctorRepository.js';

jest.mock('../../repository/doctorRepository.js');

describe('Doctor Service', () => {
    it('should create a doctor', () => {
        const createdDoctor = { name: 'Test name', specialty: 'Test specialty', id: null };
        jest.spyOn(doctorRepository, 'create').mockReturnValue(createdDoctor);
    
        const result = createDoctor({ name: 'Test name', specialty: 'Test specialty'});
    
        expect(result).toEqual(createdDoctor);
        expect(doctorRepository.create).toHaveBeenCalledWith({ name: 'Test name', specialty: 'Test specialty', id: null });
    });

    it('should list all doctor', () => {
        const mockDoctors = [{ name: 'Test name', specialty: 'Test specialty' }];
        doctorRepository.findAll.mockReturnValue(mockDoctors);

        const result = listDoctors();

        expect(result).toEqual(mockDoctors);
        expect(doctorRepository.findAll).toHaveBeenCalled();
    });

    it('should find a doctor by name', () => {
        const mockDoctor = { name: 'Test name', specialty: 'Test specialty', salary: 2022, position: 'Test position' };
        doctorRepository.findByName.mockReturnValue(mockDoctor);

        const result = findDoctorByName('Test name');

        expect(result).toEqual(mockDoctor);
        expect(doctorRepository.findByName).toHaveBeenCalledWith('Test name');
    });

    it('should list doctors by specialty', () => {
        const mockDoctors = [{ name: 'Test name', specialty: 'Test specialty' }];
        doctorRepository.listBySpecialty.mockReturnValue(mockDoctors);

        const result = listDoctorsBySpecialty('Test specialty');

        expect(result).toEqual(mockDoctors);
        expect(doctorRepository.listBySpecialty).toHaveBeenCalledWith('Test specialty');
    });

    it('should return null if doctor to delete is not found', () => {
        doctorRepository.deleteById.mockReturnValue(null);

        const result = deleteDoctorById('999');

        expect(result).toBeNull();
        expect(doctorRepository.deleteById).toHaveBeenCalledWith('999');
    });

    it('should delete a doctor by id', () => {
        const mockDoctor = { name: 'Test name', specialty: 'Test specialty' };
        doctorRepository.deleteById.mockReturnValue(mockDoctor);

        const result = deleteDoctorById('123');

        expect(result).toEqual(mockDoctor);
        expect(doctorRepository.deleteById).toHaveBeenCalledWith('123');
    });

    it('should return null if doctor to update is not found', () => {
        doctorRepository.updateById.mockReturnValue(null);

        const result = updateDoctorById('999', { name: 'Test name', specialty: 'Test specialty' });

        expect(result).toBeNull();
        expect(doctorRepository.updateById).toHaveBeenCalledWith('999', { name: 'Test name', specialty: 'Test specialty' });
    });

    it('should update a doctor by id', () => {
        const mockDoctor = { name: 'Test name', specialty: 'Test specialty' };
        doctorRepository.updateById.mockReturnValue(mockDoctor);

        const result = updateDoctorById('123', { name: 'Test name', specialty: 'Test specialty' });

        expect(result).toEqual(mockDoctor);
        expect(doctorRepository.updateById).toHaveBeenCalledWith('123', { name: 'Test name', specialty: 'Test specialty' });
    });
});
