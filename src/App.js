import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';

// Import pages
import Home from './pages/Home';
import About from './pages/About';
import Exchange from './pages/Exchange';
import AmlCheck from './pages/AmlCheck';
import Referral from './pages/Referral';
import Requests from './pages/Requests';
import Support from './pages/Support';
import Rates from './pages/Rates';
import Rules from './pages/Rules';

function App() {
  return (
    <Router>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/aml-check" element={<AmlCheck />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/support" element={<Support />} />
        <Route path="/rates" element={<Rates />} />
        <Route path="/rules" element={<Rules />} />
      </Routes>
    </Router>
  );
}

export default App; 