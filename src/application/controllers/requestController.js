import { ValidationError } from "../../domain/error/customErros.js";
import { createRequestService, getRequestByIdService, listRequestsService } from "../../domain/services/request.service.js";

export async function createRequestController(req, res, next) {
    try {
        const requestData = req.body;
        const newRequest = await createRequestService(requestData);
        res.status(201).json(newRequest);
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.message });
        } else {
            next(error);
        }
    }
}

export async function getRequestByIdController(req, res, next) {
    try {
        const { id } = req.params;
        const request = await getRequestByIdService(id);
        res.status(200).json(request);
    } catch (error) {
        next(error);
    }
}

export async function listRequestsController(req, res, next) {
    try {
        const requests = await listRequestsService();
        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
}