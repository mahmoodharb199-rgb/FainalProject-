import { useState } from "react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4" data-aos="fade-up">
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-gray-600 hover:text-green">
          {question}
        </span>
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      <div
        className={`mt-2 transition-all duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        } overflow-hidden`}
      >
        <p className="text-gray-600 px-4">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "How can I place an order?",
      answer:
        "You can easily place an order on our website by browsing our product catalog, selecting the items you want, and adding them to your cart. Then, proceed to checkout, where you can provide your shipping and payment information to complete the order.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods, including credit cards, debit cards, net banking, and mobile wallet payments. You can choose the payment option that is most convenient for you during the checkout process.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Shipping times may vary depending on your location and the shipping method chosen. Typically, orders are processed within 1-2 business days, and delivery can take 3-7 business days within India. You will receive a tracking notification once your order is shipped.",
    },
    {
      question: "Can I return a product if I'm not satisfied?",
      answer:
        "Yes, we have a hassle-free return policy. If you are not satisfied with your purchase, you can initiate a return within 30 days of receiving the product. Please contact our customer support at example@gmail.com for assistance.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Currently, we only provide shipping services within India. However, we may consider expanding our shipping options to international locations in the future. Please stay updated with our website for any changes in shipping destinations.",
    },
    {
      question: "What is your customer support contact?",
      answer:
        "If you have any questions, concerns, or need assistance, you can reach our customer support team at 9911083755 during our business hours, Monday to Saturday from 10 am to 6 pm. You can also contact us via email at example@gmail.com.",
    },
    {
      question: "What are your terms and conditions?",
      answer:
        "You can find our detailed terms and conditions by visiting our Terms of Service page on our website. It includes information about our policies, user guidelines, and more.",
    },
  ];

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
      <section className="py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
