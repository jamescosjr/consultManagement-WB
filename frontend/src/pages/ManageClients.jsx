import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Search, UserRound } from 'lucide-react';
import api from '../services/api';

export default function ManageClients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientConsults, setPatientConsults] = useState([]);
  const [consultsLoading, setConsultsLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async (nameFilter = '') => {
    setLoading(true);
    try {
      const endpoint = nameFilter.trim()
        ? `/patients/name/${encodeURIComponent(nameFilter.trim())}`
        : '/patients';
      const response = await api.get(endpoint);
      setPatients(response.data);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    fetchPatients(search);
  };

  const handleClear = async () => {
    setSearch('');
    fetchPatients();
  };

  const handleViewConsults = async (patient) => {
    setSelectedPatient(patient);
    setConsultsLoading(true);
    try {
      const response = await api.get(`/consults/patient/${patient._id}`);
      setPatientConsults(response.data);
    } catch (error) {
      console.error('Failed to fetch patient consults:', error);
      setPatientConsults([]);
    } finally {
      setConsultsLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-inner">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="section-subtitle">Patient directory</p>
              <h1 className="section-title">Patients</h1>
            </div>
          </div>
          <Link to="/root" className="btn-secondary">Back to dashboard</Link>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">All patients</h2>
                <p className="section-subtitle">{patients.length} records</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    className="input-field pl-9"
                    type="text"
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button className="btn-secondary" onClick={handleSearch}>Search</button>
                <button className="btn-ghost" onClick={handleClear}>Clear</button>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-sm text-slate-500">Loading patients...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-separate border-spacing-0">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Age</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-600">
                      {patients.map((patient) => (
                        <tr key={patient._id} className="border-t border-slate-100">
                          <td className="py-3 font-medium text-slate-900">{patient.name}</td>
                          <td className="py-3">{patient.age}</td>
                          <td className="py-3">
                            <button className="btn-secondary" onClick={() => handleViewConsults(patient)}>
                              View consults
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Consult timeline</h2>
                <p className="section-subtitle">Selected patient details</p>
              </div>
              <CalendarDays className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="card-body">
              {!selectedPatient ? (
                <div className="text-sm text-slate-500">Select a patient to view consults.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Patient</p>
                    <p className="text-lg font-semibold text-slate-900">{selectedPatient.name}</p>
                  </div>
                  {consultsLoading ? (
                    <div className="text-sm text-slate-500">Loading consults...</div>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {patientConsults.map((consult) => (
                        <li key={consult._id} className="rounded-lg border border-slate-200 px-4 py-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-900">
                              {new Date(consult.date).toLocaleDateString()}
                            </span>
                            <span className="badge badge-emerald">{consult.shift}</span>
                          </div>
                          <p className="mt-2 text-sm text-slate-500">{consult.description}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}