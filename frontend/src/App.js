import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Editprofile from "./pages/editprofile/Editprofile";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./state/AuthContext";
import Privacy from "./pages/privacy/Privacy";
import Termsofservice from "./pages/termsofservice/Termsofservice";
import Editpage from "./pages/editpage/Editpage";
import Following from "./pages/following/Following";
import Loading from "./components/loading/Loading";


function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Register />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/editprofile/:username" element={<Editprofile />} />
        <Route path="/termsofservice" element={<Termsofservice />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/editpage" element={<Editpage />} />
        <Route path="/following/:username" element={<Following />} />
        <Route path="/loading" element={<Loading />} />
      </Routes>
    </Router>
  );
}

export default App;
