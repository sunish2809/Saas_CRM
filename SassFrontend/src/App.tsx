import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import LibraryDashboard from './pages/dashboards/LibraryDashboard';
import GymDashboard from './pages/dashboards/GymDashboard';
import FlatDashboard from './pages/dashboards/FlatDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* Protected Dashboard Routes */}
      <Route path="/dashboard">
        <Route 
          path="library" 
          element={
            <ProtectedRoute>
              <LibraryDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="gym" 
          element={
            <ProtectedRoute>
              <GymDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="flat" 
          element={
            <ProtectedRoute>
              <FlatDashboard />
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  );
}

export default App;
