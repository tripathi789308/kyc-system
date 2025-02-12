import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../service";
import { useKycSystem } from "../context/kycSystemContextProvider";
import { RequestedType, Status } from "../enums";
import { useSnackbar } from "../context/snackbarContextProvider";

interface AlternateDashBoardScreenProps {
  type: Status;
}

const AlternateDashBoardScreen: React.FC<AlternateDashBoardScreenProps> = ({
  type,
}) => {
  const { getService } = apiService();
  const { onSignOut } = useKycSystem();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [submitStatus, setSubmitStatus] = useState<RequestedType | null>(null); // Make nullable

  useEffect(() => {
    fetchSubmittedRequests();
  }, []);

  const fetchSubmittedRequests = async () => {
    try {
      const response = await getService("/approvals/getSubmittedRequest");
      if (!response?.error) {
        const status = response.data.status as RequestedType;
        if (status !== RequestedType.Approved) {
          setSubmitStatus(status);
        } else {
          showSnackbar(
            "Something went wrong. Please Signout and try again",
            "error",
          );
        }
      } else {
        onSignOut();
      }
      console.log(response);
    } catch (error) {
      console.error("Error fetching submitted request:", error);
    }
  };

  const handleCompleteKyc = () => {
    navigate("/kyc-form");
  };

  const handleEditKyc = () => {
    navigate("/profile");
  };

  if (type === Status.PENDING) {
    if (submitStatus === null) {
      return <div>Loading...</div>;
    }

    if (submitStatus === RequestedType.NotSubmitted) {
      return (
        <div className="p-4">
          <p className="mb-4">
            You have not submitted your KYC information. Please complete your
            KYC.
          </p>
          <button
            onClick={handleCompleteKyc}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Complete KYC
          </button>
        </div>
      );
    } else if (submitStatus === RequestedType.Submitted) {
      return (
        <div className="p-4">
          <p className="mb-4">
            You have submitted your KYC. Please wait for the administrator to
            approve or reject your submission.
          </p>
          <button
            onClick={handleEditKyc}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit Submitted KYC
          </button>
        </div>
      );
    }
  }

  if (type === Status.REJECTED) {
    return (
      <div className="p-4">
        <p className="mb-4">
          Your KYC submission has been rejected. Please complete the KYC form
          again.
        </p>
        <button
          onClick={handleCompleteKyc}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Complete KYC
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <p>Unhandled Status Type: {type}</p>
    </div>
  );
};

export default AlternateDashBoardScreen;
