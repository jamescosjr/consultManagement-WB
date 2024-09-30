import promptSync from "prompt-sync";
import {
    createConsultHandler,
    listConsultsHandler,
    listConsultsByDescriptionHandler,
    listConsultsByDateHandler,
    listConsultsByDoctorIdHandler,
    listConsultsByPatientIdHandler,
    deleteConsultHandler,
    updateConsultHandler,
 } from "../controllers/consultController.js";

const prompt = promptSync({ sigint: true });

export function createConsult() {
    const description = prompt("Enter the consult description: ");
    const date = prompt("Enter the consult date: ");
    const doctorId = prompt("Enter the doctor ID: ");
    const patientId = prompt("Enter the patient ID: ");

    createConsultHandler({ description, date, doctorId, patientId });
}

export function listConsults() {
    listConsultsHandler();
}

export function listConsultsByDescription() {
    const description = prompt("Enter the description to search: ");
    listConsultsByDescriptionHandler(description);
}

export function listConsultsByDate() {
    const date = prompt("Enter the date to search: ");
    listConsultsByDateHandler(date);
}

export function listConsultsByDoctorId() {
    const doctorId = prompt("Enter the doctor ID to search: ");
    listConsultsByDoctorIdHandler(doctorId);
}

export function listConsultsByPatientId() {
    const patientId = prompt("Enter the patient ID to search: ");
    listConsultsByPatientIdHandler(patientId);
}

export function deleteConsult() {
    const id = prompt("Enter the consult ID to delete: ");
    deleteConsultHandler(id);
}

export function updateConsult() {
    const id = prompt("Enter the consult ID to update: ");
    const description = prompt("Enter the consult description: ");
    const date = prompt("Enter the consult date: ");
    const doctorId = prompt("Enter the doctor ID: ");
    const patientId = prompt("Enter the patient ID: ");

    const updatedConsult = {};

    if (description) updatedConsult.description = description;
    if (date) updatedConsult.date = date;
    if (doctorId) updatedConsult.doctorId = doctorId;
    if (patientId) updatedConsult.patientId = patientId;

    updateConsultHandler(id, updatedConsult);
}