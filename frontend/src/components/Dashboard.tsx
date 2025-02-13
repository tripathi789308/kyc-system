import { useKycSystem } from "../context/kycSystemContextProvider";
import { Status } from "../enums";
import ApprovalTable from "./ApprovalTable";
import Pagination from "./Pagination";
import Tabs from "./Tabs";
import AlternateDashBoardScreen from "./AlternateDashBoardScreen";

export default function Dashboard() {
  const {
    loading,
    loggedUserData,
    haveEnoughPermissionsToLoadTables,
    pendingApprovals,
    pendingCurrentPage,
    pendingTotalPages,
    approvedApprovals,
    approvedCurrentPage,
    approvedTotalPages,
    rejectedApprovals,
    rejectedCurrentPage,
    rejectedTotalPages,
  } = useKycSystem();

  const tabs = [
    {
      label: "Pending",
      content: (
        <>
          <ApprovalTable approvals={pendingApprovals} />
          <Pagination
            currentPage={pendingCurrentPage}
            totalPages={pendingTotalPages}
          />
        </>
      ),
    },
    {
      label: "Approved",
      content: (
        <>
          <ApprovalTable approvals={approvedApprovals} />
          <Pagination
            currentPage={approvedCurrentPage}
            totalPages={approvedTotalPages}
          />
        </>
      ),
    },
    {
      label: "Rejected",
      content: (
        <>
          <ApprovalTable approvals={rejectedApprovals} />
          <Pagination
            currentPage={rejectedCurrentPage}
            totalPages={rejectedTotalPages}
          />
        </>
      ),
    },
  ];

  if (!loggedUserData) return <></>;
  return (
    <div className="min-h-full">
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-8 w-8 text-indigo-600 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading ...
            </div>
          ) : haveEnoughPermissionsToLoadTables ? (
            <div className="container mx-auto mt-8">
              <Tabs tabs={tabs} />
            </div>
          ) : loggedUserData?.kycStatus === Status.PENDING ? (
            <AlternateDashBoardScreen type={Status.PENDING} />
          ) : loggedUserData?.kycStatus === Status.REJECTED ? (
            <AlternateDashBoardScreen type={Status.REJECTED} />
          ) : loggedUserData?.kycStatus === Status.APPROVED ? (
            // Since kycStatus is Approved , do not have admin permissions.
            <AlternateDashBoardScreen type={Status.APPROVED} />
          ) : (
            <></>
          )}
        </div>
      </main>
    </div>
  );
}
