import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/HeroSection';
import ProductsSection from '@/components/sections/ProductsSection';
import CustomPurchaseSection from '@/components/sections/CustomPurchaseSection';
import NoticeSection from '@/components/sections/NoticeSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import Footer from '@/components/sections/Footer';

const ParticleBackground = dynamic(
  () => import('@/components/ui/ParticleBackground'),
  { ssr: false }
);
const Navbar = dynamic(() => import('@/components/ui/Navbar'), { ssr: false });
const CartSidebar = dynamic(() => import('@/components/ui/CartSidebar'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Global UI */}
      <ParticleBackground />
      <Navbar />
      <CartSidebar />

      {/* Page Sections */}
      <HeroSection />
      <ProductsSection />
      <CustomPurchaseSection />
      <NoticeSection />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
