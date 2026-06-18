import { Outlet } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import SellerTopBar from './SellerTopBar';
import MobileBottomNav from './MobileBottomNav';

export default function SellerLayout({ title }) {
  return (
    <div className="flex min-h-screen">
      <SellerSidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-background-subtle">
        <SellerTopBar title={title} />
        <div className="pb-20 md:pb-0">
          <Outlet />
        </div>
        <MobileBottomNav />
      </main>
    </div>
  );
}