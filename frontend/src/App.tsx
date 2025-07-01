import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import AddCandidateForm from './components/AddCandidateForm';
import LoginPage from './pages/LoginPage';
import RequireAuth from './components/RequireAuth';
import CandidatesTablePage from './pages/CandidatesTablePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/nuevo-candidato" element={
          <RequireAuth>
            <AddCandidateForm />
          </RequireAuth>
        } />
        <Route path="/" element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        } />
        <Route path="/candidatos" element={
          <RequireAuth>
            <CandidatesTablePage />
          </RequireAuth>
        } />
      </Routes>
    </Router>
  );
}

export default App;
