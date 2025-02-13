import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../enums";
import { Role } from "../enums";
import { ILoggedUserData } from "../interfaces/User";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import apiService from "../service";
import { useSnackbar } from "../context/snackbarContextProvider";
import AvatarIcon from "../icons/AvatarIcon";
import ButtonWithSpinner from "../components/ButtonWithSpinner";

const VITE_S3_BUCKET_API_KEY =
  "https://qdlzodpdcgfxymgzvjfm.supabase.co/storage/v1/object/public/kyc-file-upload";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { getService, postService } = apiService();
  const { showSnackbar } = useSnackbar();
  const [userData, setUserData] = useState<ILoggedUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await getService("/user");
      if (response && response.data) {
        setUserData(response.data);
      } else {
        showSnackbar("Failed to fetch user data.", "error");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      showSnackbar("Error fetching user data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(RoutePath.DASHBOARD);
  };

  const handleRequestAdminAccess = async () => {
    setIsRequesting(true);
    const payload = {
      requiredRole: Role.ADMIN,
    };
    const response = await postService("/approvals/requestRole", payload);
    if (!response?.error) {
      showSnackbar(
        "Admin Access Request sent to the admin, please wait for approval.",
        "success",
      );
    } else {
      showSnackbar("Failed to request admin access", "error");
    }
    setIsRequesting(false);
  };

  if (isLoading) {
    return <div className="text-center">Loading profile...</div>; // Basic loading state
  }

  if (!userData) {
    return <div className="text-center">Failed to load profile.</div>; // Basic error state
  }
  // Check if fileSource is defined and not null
  const hasImage =
    userData.fileSource !== undefined &&
    userData.fileSource !== null &&
    userData.fileSource.length > 0;

  return (
    <div className="flex justify-center">
      <div className="w-full py-8 px-6 bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <ArrowLeftIcon className="h-6 w-6 inline-block mr-1" />
            Back
          </button>
        </div>

        <div className="mb-8 text-center">
          {hasImage ? (
            <img
              src={`${VITE_S3_BUCKET_API_KEY}/${userData.fileSource}`}
              alt="Profile"
              className="mx-auto rounded-full h-32 w-32 object-cover"
            />
          ) : (
            <div className="mx-auto rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center">
              <AvatarIcon />
            </div>
          )}
          <h2 className="text-2xl font-semibold mt-4">
            {userData.name || "No Name Provided"}
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-gray-700 font-medium">Email:</span>{" "}
            <span className="text-gray-900">{userData.email}</span>
          </div>
          <div>
            <span className="text-gray-700 font-medium">Age:</span>{" "}
            <span className="text-gray-900">
              {userData.age || "Not Provided"}
            </span>
          </div>
          <div>
            <span className="text-gray-700 font-medium">Assigned Role:</span>{" "}
            <span className="text-gray-900">{userData.assignedRole}</span>
          </div>
          <div>
            <span className="text-gray-700 font-medium">KYC Status:</span>{" "}
            <span className="text-gray-900">{userData.kycStatus}</span>
          </div>
        </div>

        {userData.assignedRole === Role.USER && (
          <div className="mt-8">
            <ButtonWithSpinner
              isLoading={isRequesting}
              label="Request Admin Access"
              onClick={handleRequestAdminAccess}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            ></ButtonWithSpinner>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
