import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { ROUTES } from "@/constants/routes";

type NavLinks = {
  to: string;
  label: string;
};

const navLinks: NavLinks[] = [
  { to: "Home", label: "Home" },
  { to: "Doctors", label: "Doctors" },
  { to: "Specialities", label: "Specialities" },
  { to: "About", label: "About" },
  { to: "About", label: "Contact" },
];

const NavBar = () => {
  return (
    <section className="w-screen max-w-325 p-6 mx-auto my-0 flex justify-between">
      <div className="flex gap-2 items-center">
        <div className="p-3 bg-linear-to-br from-primary to-[#06B6D4] rounded-xl">
          <FaRegHeart color="white" />
        </div>
        <h1 className="font-bold font-inter">MediBook</h1>
      </div>

      <nav className="flex gap-8 text-[#4A5565] ">
        {navLinks.map((link) => (
          <ScrollLink
            key={link.label}
            to={link.to}
            smooth={true}
            duration={500}
            className="cursor-pointer hover:text-primary transition duration-300 ease"
          >
            {link.label}
          </ScrollLink>
        ))}
      </nav>

      <div className="flex items-center gap-8">
        <Link className="text-primary font-medium " to={ROUTES.LOGIN}>
          Sign in
        </Link>
        <Link to={ROUTES.ROLE_SELECT} className=" bg-linear-to-br from-primary to-[#06B6D4] text-white  px-4 py-2 font-medium rounded-xl">
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default NavBar;
