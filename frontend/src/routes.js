import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DoctorRequests from './pages/requests/DoctorRequests';
import ClientRequests from './pages/requests/ClientRequests';
import RootPanel from './pages/RootPanel';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/requests/doctor" element={<DoctorRequests />} />
                <Route path="/requests/client" element={<ClientRequests />} />
                <Route path="/root-panel" element={<RootPanel />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;