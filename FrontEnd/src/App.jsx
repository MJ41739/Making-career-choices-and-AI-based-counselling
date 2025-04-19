import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TestPage from "./pages/TestPage";
import Results from "./pages/Results";
import TestForm from "./components/TestForm";
import Auth from "./pages/Auth";
import PrivateRoute from "./privateRoutes.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Auth isSignup={true} />} />
        <Route path="/login" element={<Auth isSignup={false} />} />
        
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
          <Route path="/test" element={<TestPage />} /> {/* Test page is protected */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<Profile />}/>
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
