export function validateConsultData(date, doctorId, patientId, description) {
  if (typeof date !== 'string' || date.trim() === '') {
    return { valid: false, message: 'The date should be a valid string' };
  }

  if (typeof doctorId !== 'string' || doctorId.trim() === '') {
    return { valid: false, message: 'The doctorId should be a valid string' };
  }

  if (typeof patientId !== 'string' || patientId.trim() === '') {
    return { valid: false, message: 'The patientId should be a valid string' };
  }

  if (typeof description !== 'string' || description.trim() === '') {
    return { valid: false, message: 'The description should be a valid string' };
  }

  if ( shift !== 'MORNING' || shift !== 'AFTERNOON') {
    return { valid: false, message: 'The description should be a valid string' };
  }

  return { valid: true };
}