import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Banner from "../Components/Banner";
import Cards from "../Components/Cards";
import Testimonials from "../homepage/Testimonials";
import OurServices from "../homepage/OurServices";
import FAQ from "../homepage/FAQ";
import UpcomingFood from "../homepage/upcomingFood";
import OurStore from "../homepage/OurStory";
import Articles from "../homepage/Articles";
import FavoriteFoods from "./FavoriteFoods";
export default function Home() {
  return (
    <div>
      <Navbar />
      <Banner />
      <OurStore />
      <Cards />
      <Testimonials />
      <OurServices />
      <Articles />
      <FavoriteFoods />
      <FAQ />
      <UpcomingFood />
      <Footer />
    </div>
  );
}
