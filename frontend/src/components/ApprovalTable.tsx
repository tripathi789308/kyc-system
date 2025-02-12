import React from "react";
import { Approval } from "../interfaces/User";
import { useKycSystem } from "../context/kycSystemContextProvider";
import { ApprovalType } from "../enums";
import { useSnackbar } from "../context/snackbarContextProvider";

interface ApprovalTableProps {
  approvals: Approval[];
}

const ApprovalTable: React.FC<ApprovalTableProps> = ({ approvals }) => {
  const { onApprove, onReject, loading } = useKycSystem();
  const { showSnackbar } = useSnackbar();

  const handleApproveClick = async (approvalId: string, type: ApprovalType) => {
    const done = await onApprove(approvalId, type);
    if (done) {
      showSnackbar("Request approved successfully", "success");
    } else {
      showSnackbar("Failed to approve request", "error");
    }
  };

  const handleRejectClick = async (approvalId: string, type: ApprovalType) => {
    const done = await onReject(approvalId, type);
    if (done) {
      showSnackbar("Request rejected successfully", "success");
    } else {
      showSnackbar("Failed to reject request", "error");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full min-h-100 divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Sl. No.
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Approval ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Requested By
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
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
                  Loading approvals...
                </div>
              </td>
            </tr>
          ) : (
            approvals.map((approval, index) => (
              <tr key={approval.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {approval.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {approval.user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(approval.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {approval.approval_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {approval.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() =>
                          handleApproveClick(
                            approval.id,
                            approval.approval_type,
                          )
                        }
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                        disabled={loading} // Disable the button when loading
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleRejectClick(approval.id, approval.approval_type)
                        }
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        disabled={loading} // Disable the button when loading
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500">
                      {approval.status === "APPROVED"
                        ? `Approved by ${approval.approvedByEmail}`
                        : `Rejected by ${approval.rejectedByEmail}`}
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovalTable;
