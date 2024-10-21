import { 
    create,
    findAll,
    listBySpecialty,
    findByName,
    deleteById,
    updateById
} from '../repository/doctorRepository.js';

export function createDoctorHandler(req, res) {
    const doctor = req.body;
    try {
        const newDoctor = create(doctor);
        if (!newDoctor) {
            return res.status(400).send('Doctor not created.');
        }
        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(500).send(error.message);
    }
   
};

export function listDoctorsHandler(req, res) {
    try {
        const doctors = findAll();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).send(error.message);
    
};
};

export async function listDoctorsBySpecialtyHandler(req, res) {
    const specialty = req.params.specialty;
    try {
        const doctors = await listBySpecialty(specialty);
        if (!doctors.length) {
            return res.status(404).send('Doctors not found.');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
    
}

export async function findDoctorByNameHandler(req, res) {
    const name = req.query.name;
    try {
        const doctor = await findByName(name);
        if (!doctor || doctor.length === 0) {
            return res.status(404).send('Doctor not found.');
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
}

export function deleteDoctorHandler(req, res) {
    const id = req.params.id;
    try {
        const deletedDoctor = deleteById(id);
        if (!deletedDoctor) {
            return res.status(404).send('Doctor not found.');
        }
        res.status(200).json(deletedDoctor);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
};

export async function updateDoctorHandler(req, res) {
    const id = req.params.id;
    const data = req.body;
    try {
        const updatedDoctor = await updateById(id, data);
        if (!updatedDoctor || updatedDoctor.length === 0) {
            return res.status(404).send('Doctor not found.');
        }
        res.status(200).json(updatedDoctor);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
};