import promptSync from 'prompt-sync';
import { 
    createPatient,
    listPatients,
    findPatientByName,
    listPatientsByAge,
    deletePatient,
    updatePatient
} from './menuActionsPatient.js';
import { backToGeneralMenu } from './commonFunction.js';

const prompt = promptSync({ sigint: true });

export function showMenuPatient() {
    console.log('1. Create Patient');
    console.log('2. List Patients');
    console.log('3. Find Patient by name');
    console.log('4. List Patients by Age');
    console.log('5. Delete Patient');
    console.log('6. Update Patient');
    console.log('0. Back');
};

export function handleMenuOption(option) {
    switch (option) {
        case 1:
            createPatient();
            break;
        case 2:
            listPatients();
            break;
        case 3:
            findPatientByName();
            break;
        case 4:
            listPatientsByAge();
            break;
        case 5:
            deletePatient();
            break;
        case 6:
            updatePatient();
            break;
        case 0:
            backToGeneralMenu();
            break;
        default:
            console.log('Invalid option, please try again.');
    }       console.log('Invalid option, please try again.');
    
};

export function menuLoopPatient()  {
    while (true) {
        showMenuPatient();
        const option = parseInt(prompt('Select an option: '), 10);
        handleMenuOption(option);
    }
};