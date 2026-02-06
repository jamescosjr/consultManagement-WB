import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Search, Stethoscope } from 'lucide-react';
import api from '../services/api';

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorConsults, setDoctorConsults] = useState([]);
  const [consultsLoading, setConsultsLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async (nameFilter = '') => {
    setLoading(true);
    try {
      const endpoint = nameFilter.trim()
        ? `/doctors/name/${encodeURIComponent(nameFilter.trim())}`
        : '/doctors';
      const response = await api.get(endpoint);
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    fetchDoctors(search);
  };

  const handleClear = async () => {
    setSearch('');
    fetchDoctors();
  };

  const handleViewConsults = async (doctor) => {
    setSelectedDoctor(doctor);
    setConsultsLoading(true);
    try {
      const response = await api.get(`/consults/doctor/${doctor._id}`);
      setDoctorConsults(response.data);
    } catch (error) {
      console.error('Failed to fetch doctor consults:', error);
      setDoctorConsults([]);
    } finally {
      setConsultsLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-inner">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <p className="section-subtitle">Clinical staff</p>
              <h1 className="section-title">Doctors</h1>
            </div>
          </div>
          <Link to="/root" className="btn-secondary">Back to dashboard</Link>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Doctors list</h2>
                <p className="section-subtitle">{doctors.length} professionals</p>
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
                <div className="text-sm text-slate-500">Loading doctors...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-separate border-spacing-0">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Specialty</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-600">
                      {doctors.map((doctor) => (
                        <tr key={doctor._id} className="border-t border-slate-100">
                          <td className="py-3 font-medium text-slate-900">{doctor.name}</td>
                          <td className="py-3">{doctor.specialty}</td>
                          <td className="py-3">
                            <button className="btn-secondary" onClick={() => handleViewConsults(doctor)}>
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
                <p className="section-subtitle">Selected doctor overview</p>
              </div>
              <CalendarDays className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="card-body">
              {!selectedDoctor ? (
                <div className="text-sm text-slate-500">Select a doctor to view consults.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Doctor</p>
                    <p className="text-lg font-semibold text-slate-900">{selectedDoctor.name}</p>
                    <p className="text-sm text-slate-500">{selectedDoctor.specialty}</p>
                  </div>
                  {consultsLoading ? (
                    <div className="text-sm text-slate-500">Loading consults...</div>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {doctorConsults.map((consult) => (
                        <li key={consult._id} className="rounded-lg border border-slate-200 px-4 py-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-900">
                              {new Date(consult.date).toLocaleDateString()}
                            </span>
                            <span className="badge badge-indigo">{consult.shift}</span>
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