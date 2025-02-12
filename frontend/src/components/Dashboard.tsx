import {
  Disclosure,
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import MainLogo from "../icons/MainLogo";
import { useKycSystem } from "../context/kycSystemContextProvider";
import AvatarIcon from "../icons/AvatarIcon";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RoutePath, Status } from "../enums";
import ApprovalTable from "./ApprovalTable";
import Pagination from "./Pagination";
import Tabs from "./Tabs";
import AlternateDashBoardScreen from "./AlternateDashBoardScreen";

export default function Dashboard() {
  const {
    loading,
    loggedUserData,
    haveEnoughPermissionsToLoadTables,
    onSignOut,
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
  const navigate = useNavigate();

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

  const userNavigation = useMemo(
    () => [
      {
        name: "Your Profile",
        onClick: () => {
          navigate(RoutePath.PROFILE);
        },
      },
      {
        name: "Sign out",
        onClick: () => {
          onSignOut();
        },
      },
    ],
    [onSignOut],
  );
  if (!loggedUserData) return <></>;
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="">
          <div className="mx-auto bg-gray-200 px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex flex-row items-center">
                <div className="shrink-0">
                  <MainLogo />
                </div>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Dashboard
                  </h1>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex max-w-xs items-center rounded-full text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <AvatarIcon />
                      </MenuButton>
                    </div>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          <a
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                            onClick={item.onClick}
                          >
                            {item.name}
                          </a>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon
                    aria-hidden="true"
                    className="block size-6 group-data-open:hidden"
                  />
                  <XMarkIcon
                    aria-hidden="true"
                    className="hidden size-6 group-data-open:block"
                  />
                </DisclosureButton>
              </div>
            </div>
          </div>
        </Disclosure>
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
            ) : (
              <AlternateDashBoardScreen type={Status.REJECTED} />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
