import { Navigate } from 'react-router-dom';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const userRole = localStorage.getItem('userRole');

  if (userRole !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
