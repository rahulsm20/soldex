import Footer from "./footer";
import Navbar from "./navbar";

const PageLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex items-start justify-center font-sans min-h-screen">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default PageLayout;
