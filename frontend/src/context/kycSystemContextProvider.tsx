import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Constants } from "../enums";
import { useNavigate } from "react-router-dom";

interface KycSystemContextType {
  isUserLoggedIn: boolean;
}

interface KycSystemProviderProps {
  children: ReactNode;
}

const KycSystemContext = createContext<KycSystemContextType | undefined>(
  undefined,
);

export const useKycSystem = () => {
  const context = useContext(KycSystemContext);
  if (context === undefined) {
    throw new Error(
      "useApiManagement must be used within an ApiManagementProvider",
    );
  }
  return context;
};

export const KycSystemProvider: React.FC<KycSystemProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem(Constants.TOKEN);
    if (!token) navigate("/login");
    if (token) setIsUserLoggedIn(true);
  }, [localStorage]);

  return (
    <KycSystemContext.Provider value={{ isUserLoggedIn }}>
      {children}
    </KycSystemContext.Provider>
  );
};
