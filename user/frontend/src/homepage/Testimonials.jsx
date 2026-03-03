import { useState, useEffect } from "react";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";
import axios from "axios";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/feedback");
        const approvedFeedback = response.data.filter(
          (feedback) => feedback.isApproved
        );
        setTestimonials(approvedFeedback);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: testimonials.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: testimonials.length > 1,
    autoplaySpeed: 3000,
    arrows: testimonials.length > 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (testimonials.length === 0) {
    return (
      <div className="section-container">
        <h2 className="title">What Our Customers Say About Us</h2>
        <p className="text-center text-gray-500">No testimonials yet.</p>
      </div>
    );
  }

  return (
    <div className="section-container">
      <h2 className="title">What Our Customers Say About Us</h2>
      <Slider {...sliderSettings} className="testimonial-slider">
        {testimonials.map((testimonial) => (
          <div key={testimonial._id} className="p-4 md:p-6">
            <blockquote className="my-4 md:my-5 text-secondary leading-relaxed">
              {testimonial.feedback}
            </blockquote>
            <div className="space-y-2">
              <h5 className="text-lg font-semibold">
                {testimonial.userId?.name || "Anonymous"}
              </h5>

              <div className="flex items-center gap-1 md:gap-2 justify-center">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`w-4 h-4 md:w-5 md:h-5 ${
                      index < Math.floor(testimonial.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="font-medium">
                  {testimonial.rating.toFixed(1)}
                </span>
                <span className="text-gray">
                  ({testimonial.createdAt.split("T")[0]})
                </span>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonials;
