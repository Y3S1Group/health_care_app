interface NavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'patient-flow', label: 'Patient Flow' },
        { id: 'resource-utilization', label: 'Resource Utilization' },
        { id: 'allocation-plan', label: 'Allocation Plan' },
        { id: 'reports', label: 'Reports' }
    ];

    return (
        <div className="pt-12 bg-gray-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex space-x-4 sm:space-x-6 lg:space-x-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};