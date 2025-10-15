import React from 'react'
import './App.css'
import { ManageResourceAllocation } from './pages/ManageResourceAllocation'

const App: React.FC = () => {
    return (
        <div className="min-h-screen overflow-hidden">
            <ManageResourceAllocation />
        </div>
    );
};
export default App;

