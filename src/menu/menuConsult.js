import PromptSync from "prompt-sync";
import {
    createConsult,
    listConsults,
    listConsultsByDescription,
    listConsultsByDate,
    listConsultsByDoctorId,
    listConsultsByPatientId,
    deleteConsult,
    updateConsult,
} from "./menuActionsConsult.js";
import { backToGeneralMenu } from "./commonFunction.js";

const prompt = PromptSync({ sigint: true });

export function showConsultMenu() {
    console.log('1. Create Consult');
    console.log('2. List Consults');
    console.log('3. List Consults by Description');
    console.log('4. List Consults by Date');
    console.log('5. List Consults by Doctor ID');
    console.log('6. List Consults by Patient ID');
    console.log('7. Delete Consult');
    console.log('8. Update Consult');
    console.log('0. Back');
}

export function handleConsultMenuOption(option) {
    switch (option) {
        case 1:
            createConsult();
            break;
        case 2:
            listConsults();
            break;
        case 3:
            listConsultsByDescription();
            break;
        case 4:
            listConsultsByDate();
            break;
        case 5:
            listConsultsByDoctorId();
            break;
        case 6:
            listConsultsByPatientId();
            break;
        case 7:
            deleteConsult();
            break;
        case 8:
            updateConsult();
            break;
        case 0:
            backToGeneralMenu();
            break;
        default:
            console.log('Invalid option, please try again.');
    }
}

export function menuLoopConsult() {
    while (true) {
        showConsultMenu();
        const option = parseInt(prompt('Select an option: '), 10);
        handleConsultMenuOption(option);
    }
}