import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ApprovalStatus,
  ApprovalType,
  Constants,
  Role,
  RoutePath,
  Status,
} from "../enums";
import { useNavigate } from "react-router-dom";
import { Approval, ILoggedUserData } from "../interfaces/User";
import apiService from "../service";

interface KycSystemContextType {
  isUserLoggedIn: boolean;
  haveEnoughPermissionsToLoadTables: boolean;
  loggedUserData: ILoggedUserData | undefined;
  setLoggedUserData: React.Dispatch<
    React.SetStateAction<ILoggedUserData | undefined>
  >;
  onSignOut: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  pendingApprovals: Approval[];
  approvedApprovals: Approval[];
  rejectedApprovals: Approval[];
  rejectedTotalPages: number;
  rejectedCurrentPage: number;
  pendingTotalPages: number;
  pendingCurrentPage: number;
  approvedTotalPages: number;
  approvedCurrentPage: number;
  setApprovedCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setPendingCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setRejectedCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  loadPendingApprovals: (page?: number) => Promise<void>;
  loadApprovedApprovals: (page?: number) => Promise<void>;
  loadRejectedApprovals: (page?: number) => Promise<void>;
  onApprove: (approvalId: string, type: ApprovalType) => Promise<boolean>;
  onReject: (approvalId: string, type: ApprovalType) => Promise<boolean>;
}

interface KycSystemProviderProps {
  children: ReactNode;
}

const getActiveTabKey = (index: number): Status => {
  switch (index) {
    case 0:
      return Status.PENDING;
    case 1:
      return Status.APPROVED;
    case 2:
      return Status.REJECTED;
    default:
      return Status.PENDING;
  }
};

const KycSystemContext = createContext<KycSystemContextType | undefined>(
  undefined,
);

export const useKycSystem = () => {
  const context = useContext(KycSystemContext);
  if (context === undefined) {
    throw new Error("useKycSystem must be used within an KycSystemProvider");
  }
  return context;
};

export const KycSystemProvider: React.FC<KycSystemProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { getService, postService } = apiService();
  const [loading, setLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loggedUserData, setLoggedUserData] = useState<ILoggedUserData>();
  const [activeTab, setActiveTab] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState<Approval[]>([]);
  const [approvedApprovals, setApprovedApprovals] = useState<Approval[]>([]);
  const [rejectedApprovals, setRejectedApprovals] = useState<Approval[]>([]);

  const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
  const [approvedCurrentPage, setApprovedCurrentPage] = useState(1);
  const [rejectedCurrentPage, setRejectedCurrentPage] = useState(1);

  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [approvedTotalPages, setApprovedTotalPages] = useState(1);
  const [rejectedTotalPages, setRejectedTotalPages] = useState(1);

  const haveEnoughPermissionsToLoadTables = useMemo(() => {
    return loggedUserData
      ? (loggedUserData?.assignedRole === Role.ADMIN ||
          loggedUserData?.assignedRole === Role.SUPER) &&
          loggedUserData?.kycStatus === Status.APPROVED
      : false;
  }, [loggedUserData]);

  useEffect(() => {
    const token = localStorage.getItem(Constants.TOKEN);
    if (!token) {
      resetUser();
      navigate(RoutePath.LOGIN);
    }
    if (token) {
      setIsUserLoggedIn(true);
      fetchUserData();
    }
  }, [localStorage]);

  useEffect(() => {
    if (loggedUserData) loadPendingApprovals();
  }, [loggedUserData]);

  const resetUser = () => {
    setLoggedUserData(undefined);
    setIsUserLoggedIn(false);
    setLoading(false);
    setActiveTab(0);
    setPendingApprovals([]);
    setApprovedApprovals([]);
    setRejectedApprovals([]);
    setPendingCurrentPage(1);
    setApprovedCurrentPage(1);
    setRejectedCurrentPage(1);
    setPendingTotalPages(1);
    setApprovedTotalPages(1);
    setRejectedTotalPages(1);
  };
  const fetchUserData = async () => {
    setLoading(true);
    const response = await getService("/user");
    if (response?.error) {
      resetUser();
      navigate(RoutePath.LOGIN);
      localStorage.removeItem(Constants.TOKEN);
    }
    setLoggedUserData(response.data);
    setLoading(false);
  };

  async function fetchApprovals(
    status: ApprovalStatus,
    page: number = 1,
  ): Promise<{ approvals: Approval[]; totalPages: number }> {
    if (!loggedUserData || !haveEnoughPermissionsToLoadTables)
      return { approvals: [], totalPages: 0 };
    const response = await getService(
      `/approvals/fetch?status=${status}&page=${page}`,
    );
    if (!response.error) {
      return response.data;
    }
    return { approvals: [], totalPages: 0 };
  }

  const loadPendingApprovals = async (p?: number) => {
    setLoading(true);
    const page = p || pendingCurrentPage;
    const { approvals, totalPages } = await fetchApprovals(
      ApprovalStatus.PENDING,
      page,
    );
    setPendingApprovals(approvals);
    setPendingTotalPages(totalPages);
    setPendingCurrentPage(page);
    setLoading(false);
  };

  const loadApprovedApprovals = async (p?: number) => {
    setLoading(true);
    const page = p || approvedCurrentPage;
    const { approvals, totalPages } = await fetchApprovals(
      ApprovalStatus.APPROVED,
      page,
    );
    setApprovedApprovals(approvals);
    setApprovedTotalPages(totalPages);
    setApprovedCurrentPage(page);
    setLoading(false);
  };

  const loadRejectedApprovals = async (p?: number) => {
    setLoading(true);
    const page = p || rejectedCurrentPage;
    const { approvals, totalPages } = await fetchApprovals(
      ApprovalStatus.REJECTED,
      page,
    );
    setRejectedApprovals(approvals);
    setRejectedTotalPages(totalPages);
    setRejectedCurrentPage(page);
    setLoading(false);
  };

  const onSignOut = () => {
    localStorage.removeItem(Constants.TOKEN);
    resetUser();
    navigate(RoutePath.LOGIN);
  };

  const onApprove = async (approvalId: string, type: ApprovalType) => {
    const tab = getActiveTabKey(activeTab);
    const response = await postService(
      `/approvals/${type === ApprovalType.KYC ? "approveKYC" : "approveRole"}`,
      { approvalId },
    );
    if (!response.error) {
      switch (tab) {
        case Status.PENDING:
          await loadPendingApprovals();
          break;
        case Status.APPROVED:
          await loadApprovedApprovals();
          break;
        case Status.REJECTED:
          await loadRejectedApprovals();
          break;
        default:
          break;
      }
      return true;
    }
    return false;
  };

  const onReject = async (approvalId: string, type: ApprovalType) => {
    const tab = getActiveTabKey(activeTab);
    const response = await postService(
      `/approvals/${type === ApprovalType.KYC ? "rejectKYC" : "rejectRole"}`,
      { approvalId },
    );
    if (!response.error) {
      switch (tab) {
        case Status.PENDING:
          await loadPendingApprovals();
          break;
        case Status.APPROVED:
          await loadApprovedApprovals();
          break;
        case Status.REJECTED:
          await loadRejectedApprovals();
          break;
        default:
          break;
      }
      return true;
    }
    return false;
  };
  return (
    <KycSystemContext.Provider
      value={{
        isUserLoggedIn,
        haveEnoughPermissionsToLoadTables,
        loggedUserData,
        setLoggedUserData,
        onSignOut,
        loading,
        setLoading,
        activeTab,
        setActiveTab,
        pendingApprovals,
        approvedApprovals,
        rejectedApprovals,
        pendingCurrentPage,
        setPendingCurrentPage,
        approvedCurrentPage,
        setApprovedCurrentPage,
        rejectedCurrentPage,
        setRejectedCurrentPage,
        pendingTotalPages,
        approvedTotalPages,
        rejectedTotalPages,
        loadPendingApprovals,
        loadApprovedApprovals,
        loadRejectedApprovals,
        onApprove,
        onReject,
      }}
    >
      {children}
    </KycSystemContext.Provider>
  );
};
