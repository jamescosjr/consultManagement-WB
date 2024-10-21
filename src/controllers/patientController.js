import { 
    create,
    findAll,
    listByAge,
    findByName,
    deleteById,
    updateById
} from '../repository/patientRepository.js';

export function createPatientHandler(req, res) {
    const patient = req.body;
    try {
        const newPatient = create(patient);
        if (!newPatient) {
            return res.status(400).send('Patient not created.');
        }
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
};

export function listPatientsHandler(req, res) {
    try {
        const patients = findAll();
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).send(error.message);
    
};
};

export function listPatientsByAgeHandler(req, res) {
    const age = req.params.age;
    try {
        const patients = listByAge(age);
        if (!patients.length) {
            return res.status(404).send('Patients not found.');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
    
}

export function findPatientByNameHandler(req, res) {
    const name = req.query.name;
    try {
        const patient = findByName(name);
        if (!patient || patient.length === 0) {
            return res.status(404).send('Patient not found.');
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).send(error.message);
    }
   
}

export function deletePatientHandler(req, res) {
    const id = req.params.id;
    try {
        const deletedPatient = deleteById(id);
        if (!deletedPatient) {
            return res.status(404).send('Patient not found.');
        }
        res.status(200).json(deletedPatient);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
};

export function updatePatientHandler(req, res) {
    const id = req.params.id;
    const data = req.body;
    try {
        const updatedPatient = updateById(id, data);
        if (!updatedPatient) {
            return res.status(404).send('Patient not found.');
        }
        res.status(200).json(updatedPatient);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
};