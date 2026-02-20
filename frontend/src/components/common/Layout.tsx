import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useCart } from '../../contexts/CartContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { summary } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemsCount={summary.itemCount} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;