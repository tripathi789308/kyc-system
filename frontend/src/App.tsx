import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import DashboardPage from "./pages/DashboardPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import KycFormPage from "./pages/KycFormPage";
import ProfilePage from "./pages/ProfilePage";
import { KycSystemProvider } from "./context/kycSystemContextProvider";
import { RoutePath } from "./enums";
import { SnackbarProvider } from "./context/snackbarContextProvider";
import Layout from "./pages/Layout";
import React from "react";

function App() {
  return (
    <Router>
      <SnackbarProvider>
        <KycSystemProvider>
          <Routes>
            <Route path={RoutePath.REGISTER} Component={RegisterPage} />
            <Route path={RoutePath.LOGIN} Component={LoginPage} />
            <Route path="/" Component={Layout}>
              <Route index Component={DashboardPage} />
              <Route path={RoutePath.KYC_FORM} Component={KycFormPage} />
              <Route path={RoutePath.PROFILE} Component={ProfilePage} />
            </Route>
          </Routes>
        </KycSystemProvider>
      </SnackbarProvider>
    </Router>
  );
}

export default React.memo(App);
