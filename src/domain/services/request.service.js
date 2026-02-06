import { ValidationError } from "../error/customErros.js";
import { Request } from "../../infrastructure/schemas/request.schema.js";

export async function createRequestService(data) {
    if (!data.title || !data.description) {
        throw new ValidationError("Title and description are required.");
    }
    const newRequest = new Request(data);
    return await newRequest.save();
}

export async function getRequestByIdService(id) {
    return await Request.findById(id);
}

export async function listRequestsService() {
    return await Request.find();
}