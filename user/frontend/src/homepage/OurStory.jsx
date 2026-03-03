import { useNavigate } from "react-router-dom";

const OurStore = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  return (
    <div className="section-container my-16 story px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div data-aos="fade-up" className="w-full md:w-1/2 mb-8 md:mb-0">
          <img
            src="/OurStory/story.jpg"
            alt="Our Story"
            className="w-full h-auto object-cover"
            height={"80px"}
          />
        </div>
        <div
          data-aos="fade-up"
          className="w-full md:w-1/2 md:ml-8 text-center md:text-left"
        >
          <p className="subtitle text-lg md:text-xl">Discover Our Store</p>
          <h2 className="title text-2xl md:text-3xl font-bold mt-4 mb-6">
            Experience Excellence in Every Bite
          </h2>
          <p className="text-base md:text-lg text-black leading-[30px]">
            At Food Ordering Information System, we transform the meal experience by offering customized
            dishes tailored to your specific dietary needs. Whether you're
            managing health conditions, pursuing fitness goals, or simply
            seeking personalized cuisine, our Food Ordering Information System platform ensures a seamless
            and efficient process. Our team crafts each meal with care and
            quality, delivering exactly what you need.
          </p>

          <button
            onClick={() => navigate("/Menu")}
            className="bg-green font-semibold btn text-white px-8 py-2 rounded-full mt-3"
          >
            Explore Our Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default OurStore;
