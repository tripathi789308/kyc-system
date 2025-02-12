import React, { ReactNode } from "react";
import { useKycSystem } from "../context/kycSystemContextProvider";

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const {
    activeTab,
    setActiveTab,
    setLoading,
    loadApprovedApprovals,
    loadPendingApprovals,
    loadRejectedApprovals,
  } = useKycSystem();

  const handleTabSwitch = async (index: number) => {
    setLoading(true);
    setActiveTab(index);
    switch (index) {
      case 0:
        await loadPendingApprovals();
        break;
      case 1:
        await loadApprovedApprovals();
        break;
      case 2:
        await loadRejectedApprovals();
        break;
      default:
        return;
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="border-gray-200">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => handleTabSwitch(index)}
              className={`py-4 px-1 text-sm font-medium text-gray-500 whitespace-nowrap border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 ${
                activeTab === index ? "text-indigo-600 border-indigo-600" : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">{tabs[activeTab].content}</div>
    </div>
  );
};

export default Tabs;
