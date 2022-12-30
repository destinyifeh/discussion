import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Forgot from "./components/user/Forgot";
import Verify from "./components/user/Verify";
import VerifyCode from "./components/user/VerifyCode";

import Reset from "./components/user/Reset";
import UpdateProfile from "./components/user/UpdateProfile";
import Profile from "./components/user/Profile";
import Home from "./components/Home";
import New from "./components/features/New";
import UserPosts from "./components/user/UserPosts";
import Show from "./components/features/Show";
import SearchResults from "./components/features/SearchResults";
import Update from "./components/features/Update";
import NotFoundPage from "./components/NotFoundPage";
import Check from "./components/Check";
import Report from "./components/Report";
function App() {
  let userId = localStorage.getItem("userId");

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={<> {userId ? <Home /> : <Login />}</>}
          />
          <Route path="user/login" element={<Login />} />
          <Route path="/user/register" element={<Register />} />
          <Route path="/user/forgot-password" element={<Forgot />} />
          <Route path="/user/verify-email" element={<Verify />} />
          <Route path="/user/reset-password/:id" element={<Reset />} />
          <Route path="/user/reset-code" element={<VerifyCode />} />

          <Route
            path="/user/edit/:username"
            element={<>{userId ? <UpdateProfile /> : <Login />}</>}
          />
          <Route
            path="/user/:username"
            element={<>{userId ? <Profile /> : <Login />}</>}
          />
          <Route
            path="/feature/new"
            element={<>{userId ? <New /> : <Login />}</>}
          />
          <Route
            path="/user/features"
            element={<>{userId ? <UserPosts /> : <Login />}</>}
          />
          <Route path="/feature/:slug" element={<Show />} />
          <Route
            path="/search/query=:query"
            element={<>{userId ? <SearchResults /> : <Login />}</>}
          />
          <Route
            path="/edit/feature/:slug"
            element={<>{userId ? <Update /> : <Login />}</>}
          />
          <Route
            path="/user/security-check"
            element={<>{userId ? <Check /> : <Login />}</>}
          />
          <Route
            path="/report/feature/:title"
            element={<>{userId ? <Report /> : <Login />}</>}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer className="text-center" position="top-center" />
    </div>
  );
}

export default App;
