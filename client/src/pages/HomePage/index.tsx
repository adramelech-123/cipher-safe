import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Security from "./Security";
import CallToAction from "./CallToAction";
import Footer from "./Footer";

const HomePage = () => {
  return (
    <div className="relative z-10 h-screen w-full overflow-y-auto scroll-smooth">
      <Navbar />
      <Hero />
      <Features />
      <Security />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default HomePage;