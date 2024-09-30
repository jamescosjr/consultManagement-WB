import promptSync from 'prompt-sync';
import { 
    createDoctor,
    listDoctors,
    findDoctorByName,
    listDoctorsBySpecialty,
    deleteDoctor,
    updateDoctor
} from './menuActionsDoctor.js';
import { backToGeneralMenu } from './commonFunction.js';

const prompt = promptSync({ sigint: true });

export function showMenuDoctor() {
    console.log('1. Create Doctor');
    console.log('2. List Doctors');
    console.log('3. Find Doctor by name');
    console.log('4. List Doctors by Specialty');
    console.log('5. Delete Doctor');
    console.log('6. Update Doctor');
    console.log('0. Back');
};

export function handleMenuOption(option) {
    switch (option) {
        case 1:
            createDoctor();
            break;
        case 2:
            listDoctors();
            break;
        case 3:
            findDoctorByName();
            break;
        case 4:
            listDoctorsBySpecialty();
            break;
        case 5:
            deleteDoctor();
            break;
        case 6:
            updateDoctor();
            break;
        case 0:
            backToGeneralMenu();
            break;
        default:
            console.log('Invalid option, please try again.');
    }       console.log('Invalid option, please try again.');
    
};

export function menuLoopDoctor  ()  {
    while (true) {
        showMenuDoctor();
        const option = parseInt(prompt('Select an option: '), 10);
        handleMenuOption(option);
    }
};