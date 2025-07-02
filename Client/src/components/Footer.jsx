import React from "react";

const Footer = () => {
  return (
    <div>
      <div className="footer-container   bg-[#F9F9F9] p-[6vw] h-[18vw] items-center justify-center mt-[4vw]">
        <div className=" flex items-center justify-between">
          <img
            src="/assets/Logo.png"
            alt="Logo"
            className="w-[4.5vw] h-[4.5vw]"
          />
          <a href="#" className="font-medium text-normal">Terms & Conditions</a>
          <a href="#" className="font-medium text-normal">Privacy Policy</a>
          <a href="#" className="font-medium text-normal">Contact Us</a>
          <a href="#" className="font-medium text-normal">List your events</a>
          <span className="flex items-center justify-between gap-2">
            <img src="/assets/facebook.png" alt="facebook" className="w-[1.5vw] h-[1.5vw]"/>
            <img src="/assets/twitter.png" alt="twitter" className="w-[1.5vw] h-[1.5vw]" />
            <img src="/assets/mail.png" alt="mail" className="w-[1.5vw] h-[2vw]" />
            <img src="/assets/instagram.png" alt="instagram" className="w-[1.5vw] h-[1.5vw]" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;