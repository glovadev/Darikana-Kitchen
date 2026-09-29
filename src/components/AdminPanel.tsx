import React from 'react';
import { useCart } from '../context/CartContext';

/**
 * Backward compatibility stub.
 * All admin functionality is now hosted on the Dedicated Admin Page (/src/pages/AdminPage.tsx).
 */
export const AdminPanel: React.FC = () => {
  const { navigateTo } = useCart();
  return null;
};

export default AdminPanel;
