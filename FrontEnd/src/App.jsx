import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TestPage from "./pages/TestPage";
import Results from "./pages/Results";
import TestForm from "./components/TestForm";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/testform" element={<TestForm />} />
        {/* <Route path="/results" element={<Results />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
