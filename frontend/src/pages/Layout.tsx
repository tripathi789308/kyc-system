import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  DisclosureButton,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useKycSystem } from "../context/kycSystemContextProvider";
import { RoutePath } from "../enums";
import AvatarIcon from "../icons/AvatarIcon";
import MainLogo from "../icons/MainLogo";

const Layout = () => {
  const navigate = useNavigate();
  const { onSignOut } = useKycSystem();
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
    [onSignOut, navigate],
  );

  return (
    <>
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
      <Outlet />
    </>
  );
};

export default Layout;
