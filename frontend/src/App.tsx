import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import DashboardPage from "./pages/DashboardPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import KycFormPage from "./pages/KycFormPage";
import ProfilePage from "./pages/ProfilePage";
import { KycSystemProvider } from "./context/kycSystemContextProvider";
import { RoutePath } from "./enums";
import { SnackbarProvider } from "./context/snackbarContextProvider";

function App() {
  return (
    <Router>
      <SnackbarProvider>
        <KycSystemProvider>
          <Routes>
            <Route
              path={RoutePath.DASHBOARD}
              Component={() => <DashboardPage />}
            ></Route>
            <Route
              path="/"
              Component={() => <Navigate replace to={RoutePath.DASHBOARD} />}
            ></Route>
            <Route
              path={RoutePath.KYC_FORM}
              Component={() => <KycFormPage />}
            ></Route>
            <Route
              path={RoutePath.PROFILE}
              Component={() => <ProfilePage />}
            ></Route>
            <Route
              path={RoutePath.REGISTER}
              Component={() => <RegisterPage />}
            ></Route>
            <Route
              path={RoutePath.LOGIN}
              Component={() => <LoginPage />}
            ></Route>
          </Routes>
        </KycSystemProvider>
      </SnackbarProvider>
    </Router>
  );
}

export default App;
