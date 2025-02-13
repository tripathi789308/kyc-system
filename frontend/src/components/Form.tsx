import React, { useState, useCallback } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useDropzone } from "react-dropzone";
import { useKycSystem } from "../context/kycSystemContextProvider";
import { useNavigate } from "react-router-dom";
import apiService from "../service";
import { useSnackbar } from "../context/snackbarContextProvider";
import { RoutePath } from "../enums";
import ButtonWithSpinner from "./ButtonWithSpinner";

interface FormValues {
  name: string;
  age: number;
  fileSource: string | null;
}

const Form: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const { getService, postService } = apiService();
  const { loading } = useKycSystem();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    age: 0,
    fileSource: null,
  });
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file.size > 2 * 1024 * 1024) {
        showSnackbar("File size exceeds 2MB limit.", "error");
        return;
      }

      try {
        const fileName = file.name;
        const response = await getService(
          `/user/upload-image?fileName=${fileName}`,
        );

        if (response?.data?.signedUrl && response?.data?.path) {
          await uploadToSignedUrl(response.data.signedUrl, file);
          setFormValues((prev) => ({
            ...prev,
            fileSource: response.data.path,
          }));
          showSnackbar("Image uploaded successfully!", "success");
        } else {
          showSnackbar("Failed to get signed URL.", "error");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        showSnackbar("Error uploading image.", "error");
      }
    },
    [getService, showSnackbar],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".png"],
    },
    maxFiles: 1,
  });

  const uploadToSignedUrl = async (signedUrl: string, file: File) => {
    try {
      await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
    } catch (error) {
      console.error("Error uploading to signed URL:", error);
      throw error;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.name || !formValues.age || !formValues.fileSource) {
      showSnackbar("Please fill in all required fields.", "error");
      return;
    }
    setIsRequesting(true);
    const payload = {
      name: formValues.name,
      age: formValues.age,
      fileSource: formValues.fileSource,
    };
    const response = await postService("/approvals/requestKYC", payload);
    if (!response.error) {
      showSnackbar("KYC Requested sucessfully", "success");
      navigate(RoutePath.DASHBOARD);
    } else {
      showSnackbar("Error occurred while requesting KYC", "error");
    }
    setIsRequesting(false);
  };

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="w-1/2">
        <div className="space-y-6">
          <div className="border-b border-gray-900/10 pb-6">
            <h2 className="text-base/7 font-semibold text-gray-900">
              Enter KYC details
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      onChange={handleChange}
                      value={formValues.name}
                      className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="age"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Age
                </label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                    <input
                      id="age"
                      name="age"
                      type="number"
                      required
                      onChange={handleChange}
                      value={formValues.age}
                      className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-6">
                <label
                  htmlFor="fileSource"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Upload photoID
                </label>
                <div
                  {...getRootProps()}
                  className={`mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 cursor-pointer ${
                    isDragActive ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="text-center">
                    <PhotoIcon
                      aria-hidden="true"
                      className="mx-auto size-12 text-gray-300"
                    />
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <p className="pl-1">
                        Drag 'n' drop some files here, or click to select files
                      </p>
                    </div>
                    <p className="text-xs/5 text-gray-600">
                      PNG, JPG up to 2MB
                    </p>
                    {formValues.fileSource && (
                      <div className="mt-2">
                        <p>Uploaded file: {formValues.fileSource}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm/6 font-semibold text-gray-900"
            onClick={() => navigate(RoutePath.DASHBOARD)}
          >
            Cancel
          </button>
          <ButtonWithSpinner
            isLoading={isRequesting}
            label="Request KYC"
            className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          ></ButtonWithSpinner>
        </div>
      </form>
    </div>
  );
};

export default Form;
