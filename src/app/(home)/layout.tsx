import Footer from "./footer";
import { NavBar } from "./navbar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 bg-[#f4f4f0]">{children}</main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
