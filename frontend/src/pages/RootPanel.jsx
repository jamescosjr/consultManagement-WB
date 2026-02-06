import React from 'react';
import { ShieldCheck } from 'lucide-react';

const RootPanel = () => {
    return (
        <div className="page-shell">
            <div className="page-inner">
                <div className="card">
                    <div className="card-header">
                        <div>
                            <p className="section-subtitle">Administration</p>
                            <h1 className="section-title">Root panel</h1>
                        </div>
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="card-body">
                        <p className="text-sm text-slate-500">Administrative panel for managing the system.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RootPanel;