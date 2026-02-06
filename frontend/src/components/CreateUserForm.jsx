import React, { useState } from 'react';
import api from '../services/api';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';

export default function CreateUserForm({ initialRole = 'client', onCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: initialRole,
    roleDetails: {}
  });
  const [submitting, setSubmitting] = useState(false);
  const { notification, showError, showSuccess, closeToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      roleDetails: name === 'role' ? {} : prev.roleDetails
    }));
  };

  const handleRoleDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      roleDetails: {
        ...prev.roleDetails,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/users', formData);
      showSuccess('Usuário criado com sucesso!');
      setFormData((prev) => ({
        name: '',
        email: '',
        password: '',
        role: prev.role,
        roleDetails: {}
      }));
      if (onCreated) onCreated();
    } catch (error) {
      showError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Name</label>
        <input
          className="input-field"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Email</label>
        <input
          className="input-field"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Password</label>
        <input
          className="input-field"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Role</label>
        <select className="input-field" name="role" value={formData.role} onChange={handleChange}>
          <option value="client">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="root">Root</option>
        </select>
      </div>

      {formData.role === 'doctor' && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Specialty</label>
          <input
            className="input-field"
            type="text"
            name="specialty"
            value={formData.roleDetails.specialty || ''}
            onChange={handleRoleDetailsChange}
            required
          />
        </div>
      )}

      {formData.role === 'client' && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Age</label>
          <input
            className="input-field"
            type="number"
            name="age"
            value={formData.roleDetails.age || ''}
            onChange={handleRoleDetailsChange}
            required
          />
        </div>
      )}

      <button type="submit" className="btn-primary justify-center" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create user'}
      </button>

      {notification && (
        <Toast 
          message={notification.message} 
          type={notification.type} 
          duration={notification.duration}
          onClose={closeToast}
        />
      )}
    </form>
  );
}