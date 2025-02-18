import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TestPage from "./pages/TestPage";
import Results from "./pages/Results";
import TestForm from "./components/TestForm";
import Auth from "./pages/Auth";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Auth isSignup={true} />} />
        <Route path="/login" element={<Auth isSignup={false} />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/testform" element={<TestForm />} />
      </Routes>
    </Router>
  );
}

export default App;
