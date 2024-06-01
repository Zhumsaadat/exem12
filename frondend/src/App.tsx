import './App.css';
import {Route, Routes } from 'react-router-dom';
import AppToolbar from './components/UI/AppToolbar.tsx';
import Register from './features/Users/Register.tsx';
import Login from './features/Users/Login.tsx';
import {Alert} from '@mui/material';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import {selectUser} from './features/Users/usersSlice.ts';
import {useAppSelector} from './App/hooks.ts';
import PhotoGalleryForm from './features/PhotoGallery/PhotoGalleryForm.tsx';

function App() {
  const user = useAppSelector(selectUser);
  return (
    <>
      <header>
        <AppToolbar />
      </header>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addPhoto" element={
          <ProtectedRoute isAllowed={user && user.role !== ''}>
            <PhotoGalleryForm />
          </ProtectedRoute>}
        />
        <Route path="*" element={<Alert severity="error">Страница не найдена!</Alert>} />
      </Routes>
    </>
  )
}

export default App;
