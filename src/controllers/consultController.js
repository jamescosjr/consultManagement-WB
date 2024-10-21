import {
    create,
    findAll,
    findByPatientId,
    findByDoctorId,
    findByDate,
    findByDescription,
    deleteById,
    updateById
} from '../repository/consultRepository.js';

export function createConsultHandler(req, res) {
    const consult = req.body;
    try {
        const newConsult = create(consult);
        if (!newConsult) {
            return res.status(400).send('Consult not created.');
        }
        res.status(201).json(newConsult);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
};

export function listConsultsHandler(req, res) {
    try {
        const consults = findAll();
        res.status(200).json(consults);
    } catch (error) {
        res.status(500).send(error.message);
    
};
};

export function listConsultsByDoctorIdHandler(req, res) {
    const doctorId = req.params.doctorId;
    try {
        const consults = findByDoctorId(doctorId);
        if (!consults.length) {
            return res.status(404).send('Consults not found.');
        }
        res.status(200).json(consults);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export function listConsultsByPatientIdHandler(req, res) {
    const patientId = req.params.patientId;
    try {
        const consults = findByPatientId(patientId);
        if (!consults.length) {
            return res.status(404).send('Consults not found.');
        }
        res.status(200).json(consults);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export function listConsultsByDescriptionHandler(req, res) {
    const description = req.query.description;
    try {
        const consults = findByDescription(description);
        if (!consults.length || !description) {
            return res.status(404).send('Consults not found.');
        }
        res.status(200).json(consults);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export function listConsultsByDateHandler(req, res) {
    const date = req.query.date;
    try {
        const consults = findByDate(date);
        if (!consults.length) {
            return res.status(404).send('Consults not found.');
        }
        res.status(200).json(consults);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
}

export function deleteConsultHandler(req, res) {
    const id = req.params.id;
    try {
        const deletedConsult = deleteById(id);
        if (!deletedConsult) {
            return res.status(404).send('Consult not found.');
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json(error.message);
    }
   
};

export function updateConsultHandler(req, res) {
    const id = req.params.id;
    const data = req.body;
    try {
        const updatedConsult = updateById(id, data);
        if (!updatedConsult) {
            return res.status(404).send('Consult not found.');
        }
        res.status(200).json(updatedConsult);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
};