import './App.css'
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useUserStore from './features/auth/userAuth';
import Login from './pages/Login'
import Home from './pages/Home';
import Admin from './pages/Admin';
import Sidebar from './components/Sidebar';
import NewPost from './pages/NewPost';
import MapsCamp from './pages/MapsCamp';

function App() {
  const init = useUserStore(state => state.init);
  const user = useUserStore(state => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    init(); 
    setIsLoading(false);
  }, []); 

  function MainContent() {
    const location = useLocation();
    const shouldShowSidebar = user && location.pathname !== '/login';

    return (
      <div className={`${shouldShowSidebar ? 'sm:ml-64 p-4 mt-12' : ''} flex-grow`}>
        {isLoading ? (
          <p>Cargando...</p>
        ) : (
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route
              path="/"
              element={
                user ? (
                  user.role === 'User' ? <Home /> : <Navigate to="/admin" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin"
              element={
                user && user.role === 'Admin' ? <Admin /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/newpost"
              element={
                user && user.role === 'User' ? <NewPost /> : <Navigate to="/" />
              }
            />
            <Route
              path="/maps"
              element={
                user && user.role === 'User' ? <MapsCamp /> : <Navigate to="/" />
              }
            />
          </Routes>
        )}
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex">
        {user && <Sidebar />}
        <MainContent />
      </div>
    </BrowserRouter>
  );
}

export default App
