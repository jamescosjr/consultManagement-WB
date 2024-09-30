import { menuLoopDoctor } from "./menuDoctor.js";
import { menuLoopPatient } from "./menuPatient.js";
import { menuLoopConsult } from "./menuConsult.js";
import process from 'process';
import PromptSync from "prompt-sync";

const prompt = PromptSync({ sigint: true });

export function showGeneralMenu() {
    console.log('1. Doctor Menu');
    console.log('2. Patient Menu');
    console.log('3. Consult Menu');
    console.log('0. Exit');
}

export function handleGeneralMenuOption(option) {
    switch (option) {
        case 1:
            menuLoopDoctor();
            break;
        case 2:
            menuLoopPatient();
            break;
        case 3:
            menuLoopConsult();
            break;
        case 0:
            process.exit();
            break;
        default:
            console.log('Invalid option, please try again.');
    }
}

export function menuLoopGeneral() {
    while (true) {
        showGeneralMenu();
        const option = parseInt(prompt('Select an option: '), 10);
        handleGeneralMenuOption(option);
    }
}