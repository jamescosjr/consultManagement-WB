# Consult Management API

## Overview
The **Consult Management API** is a RESTful API designed to facilitate the management of medical consultations. It allows users to create, retrieve, update, and delete consultations, doctors, and patients.

## Features
- Manage medical consultations
- CRUD operations for patients and doctors
- Retrieve consultations by date, doctor, or patient
- Retrieve doctors by specialty

## Installation

### Prerequisites
- Node.js (>=16.x)
- MongoDB

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/jamescosjr/consultManagement-WB.git
   ```
2. Navigate to the project directory:
   ```sh
   cd consultManagement-WB
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up the environment variables in a `.env` file.
5. Start the server:
   ```sh
   npm start
   ```

## API Documentation

### Endpoints

#### Consultations
- **POST** `/consults` - Create a new consultation
- **GET** `/consults` - Retrieve all consultations
- **GET** `/consults/id/{id}` - Get a consultation by ID
- **PUT** `/consults/id/{id}` - Update a consultation
- **DELETE** `/consults/id/{id}` - Delete a consultation
- **GET** `/consults/doctor/{doctorId}` - Get consultations by doctor
- **GET** `/consults/patient/{patientId}` - Get consultations by patient
- **GET** `/consults/date/{date}` - Get consultations by date

#### Patients
- **POST** `/patients` - Create a new patient
- **GET** `/patients` - Retrieve all patients
- **GET** `/patients/id/{id}` - Get a patient by ID
- **PUT** `/patients/id/{id}` - Update a patient
- **DELETE** `/patients/id/{id}` - Delete a patient
- **GET** `/patients/name/{name}` - Get a patient by name
- **GET** `/patients/age/{age}` - Get patients by age

#### Doctors
- **POST** `/doctors` - Create a new doctor
- **GET** `/doctors` - Retrieve all doctors
- **GET** `/doctors/id/{id}` - Get a doctor by ID
- **PUT** `/doctors/id/{id}` - Update a doctor
- **DELETE** `/doctors/id/{id}` - Delete a doctor
- **GET** `/doctors/name/{name}` - Get a doctor by name
- **GET** `/doctors/specialty/{specialty}` - Get doctors by specialty

## Contributing
Contributions are welcome! Feel free to submit a pull request or report issues.

## License
This project is licensed under the MIT License.

## Contact
For any questions, reach out via LinkedIn or GitHub: [GitHub](https://github.com/jamescosjr/consultManagement-WB).
