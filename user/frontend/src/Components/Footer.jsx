import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <div>
      <footer className="footer xl:px-24 py-10 px-4 text-base-content bg-[#FAFAFA]">
        <aside>
          <Link to="/" className="text-xl font-bold text-green text-center ">
            Food Ordering Information System
          </Link>
          <p className="my-1 md:w-48 text-gray-600">
            Savor the artistry where every dish is a culinary masterpiece.
          </p>
        </aside>

        {/* Quick Links */}
        <nav>
          <header className="footer-title text-black">Quick Links</header>
          <a href="/" className="link link-hover">
            Home
          </a>
          <a href="/Menu" className="link link-hover">
            Menu
          </a>
          <a href="/custom" className="link link-hover">
            Custom Dish
          </a>
          <a href="/order" className="link link-hover">
            Orders
          </a>
          <a href="/Cart" className="link link-hover">
            Cart
          </a>
        </nav>

        {/* User Section */}
        <nav>
          <header className="footer-title text-black">User</header>
          <a href="/login" className="link link-hover">
            Login
          </a>
          <a href="/register" className="link link-hover">
            Register
          </a>
          <a href="/profile" className="link link-hover">
            Profile
          </a>
          <a href="/feedback" className="link link-hover">
            Feedback
          </a>
        </nav>

        {/* Contact Section */}
        <nav>
          <header className="footer-title text-black">Contact Us</header>
          <a href="/contact" className="link link-hover">
            Contact Page
          </a>
          <a className="link link-hover">
            support@Food Ordering Information System.com
          </a>
          <a className="link link-hover">+962 79 000 0000</a>
        </nav>
      </footer>

      <hr />

      {/* Bottom Footer */}
      <footer className="footer items-center xl:px-24 px-4 py-4 mt-2 bg-[#FAFAFA]">
        <aside className="items-center grid-flow-col">
          <p className="text-gray-700">
            <a href="/" className="font-bold text-green">
              Food Ordering Information System
            </a>{" "}
            © 2025 - All rights reserved
          </p>
        </aside>

        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="text-green hover:text-black transition-colors"
            >
              <path d="M24 4.557a9.835 9.835 0 0 1-2.828.775A4.932 4.932 0 0 0 23.337 3c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.388 4.482A13.978 13.978 0 0 1 1.671 3.149a4.902 4.902 0 0 0 1.523 6.574A4.935 4.935 0 0 1 .96 9.1v.062a4.93 4.93 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.084 4.936 4.936 0 0 0 4.604 3.417A9.867 9.867 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.092 10.092 0 0 0 24 4.557z" />
            </svg>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="text-green hover:text-black transition-colors"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.451.029 5.805 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 15.999V8l8 4-8 3.999z" />
            </svg>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="text-green hover:text-black transition-colors"
            >
              <path d="M9 8H6v4h3v12h5V12h3.642l.358-4h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
            </svg>
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
