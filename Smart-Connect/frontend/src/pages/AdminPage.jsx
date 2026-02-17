import React from 'react';
import { useParams } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';

const AdminPage = () => {
  const { businessId } = useParams();
  return <AdminDashboard businessId={businessId} />;
};

export default AdminPage;