import React from 'react';
import { ClipboardList } from 'lucide-react';

const ClientRequests = () => {
    return (
        <div className="page-shell">
            <div className="page-inner">
                <div className="card">
                    <div className="card-header">
                        <div>
                            <p className="section-subtitle">Requests</p>
                            <h1 className="section-title">Client requests</h1>
                        </div>
                        <ClipboardList className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="card-body">
                        <p className="text-sm text-slate-500">View and create requests as a client.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientRequests;