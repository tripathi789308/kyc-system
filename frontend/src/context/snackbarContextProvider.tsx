// src/context/SnackbarContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface SnackbarContextProps {
  showSnackbar: (message: string, type: "success" | "error") => void;
}

interface SnackbarProviderProps {
  children: ReactNode;
}

interface SnackbarState {
  message: string;
  type: "success" | "error" | null;
  isOpen: boolean;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(
  undefined,
);

export const useSnackbar = (): SnackbarContextProps => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: "",
    type: null,
    isOpen: false,
  });

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type, isOpen: true });
  };

  useEffect(() => {
    if (snackbar.isOpen) {
      const timer = setTimeout(() => {
        setSnackbar((prevState) => ({ ...prevState, isOpen: false }));
      }, 3000); // Adjust duration as needed (3 seconds)

      return () => clearTimeout(timer); // Cleanup on unmount or if snackbar changes
    }
  }, [snackbar.isOpen]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {snackbar.isOpen && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${
            snackbar.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex-1 md:w-0">
              <p className="text-sm font-medium truncate">{snackbar.message}</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                type="button"
                className="bg-transparent rounded-md p-2 inline-flex text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                onClick={() =>
                  setSnackbar((prevState) => ({ ...prevState, isOpen: false }))
                }
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </SnackbarContext.Provider>
  );
};
