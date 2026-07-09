import React from 'react';
/**import NotificationCenter from '../../components/dashboard/NotificationCenter';
import InfoRequests from '../../components/dashboard/InfoRequests';
import FavoriteStores from '../../components/dashboard/FavoriteStores';
import Wishlist from '../../components/dashboard/Wishlist';
**/
import Footer from '../../components/Footer';

const Dashboard = () => {
  return (
    <main className="flex-1 px-margin-page py-8 pb-32 md:pb-8 bg-background">
      {/* Welcome Header */}
      <header className="mb-10">
        <h1 className="font-headline-lg text-headline-lg text-ink-black mb-2">
          Olá, Ricardo! 👋
        </h1>
        <p className="font-body-md text-body-md text-ink-gray">
          Bem-vindo ao seu painel pessoal. Aqui está um resumo da sua atividade.
        </p>
      </header>

      {/* Stats/Bento Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <NotificationCenter />
        <InfoRequests />
      </div>

      {/* Favorite Stores & Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <FavoriteStores />
        <Wishlist />
      </div>

    </main>
  );
};

export default Dashboard;