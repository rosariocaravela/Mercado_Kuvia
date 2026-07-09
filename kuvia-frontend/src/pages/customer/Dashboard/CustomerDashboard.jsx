import React from 'react';
import Header from './../../public/Explore/components/ExploreHeader';
import Sidebar from './../../customer/components/customerSlidebar';
import Footer from '../../public/Explore/components/ExploreFooter';


const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-24 md:pb-12">
        <div className="mx-auto px-margin-page flex gap-8 mt-8">
          <Sidebar />

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
              {/* <NotificationCenter /> */}
              {/* <InfoRequests /> */}
            </div>

            {/* Favorite Stores & Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {/*<FavoriteStores />
              <Wishlist />*/}
            </div>
          </main>
          {/* Aqui você pode adicionar os componentes e funcionalidades do dashboard */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;