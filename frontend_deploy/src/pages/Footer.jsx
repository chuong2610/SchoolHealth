import React from "react";
import { FaEnvelope, FaFacebookF, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaPhoneAlt, FaTwitter, FaYoutube } from "react-icons/fa";
import footerStyles from "./Footer.module.css";
import { Link } from "react-router-dom";
const Footer = () => (
     <footer className={footerStyles.footer}>
     <div className={footerStyles.container}>
       <div className={footerStyles.topRow}>
         <div className={footerStyles.col}>
           <h5 className={footerStyles.title}>Hệ thống Quản lý Y tế Học đường</h5>
           <p className={footerStyles.desc}>
             Giải pháp quản lý y tế học đường toàn diện, giúp theo dõi và chăm sóc sức khỏe học sinh hiệu quả.
           </p>
         </div>
         <div className={footerStyles.col}>
           <h5 className={footerStyles.title}>Liên kết nhanh</h5>
           <ul className={footerStyles.linkList}>
             <li><Link to="/about" className={footerStyles.link}>Giới thiệu</Link></li>
             <li><Link to="/faq" className={footerStyles.link}>Câu hỏi thường gặp</Link></li>
             <li><Link to="/privacy" className={footerStyles.link}>Chính sách bảo mật</Link></li>
           </ul>
         </div>
         <div className={footerStyles.col}>
           <h5 className={footerStyles.title}>Liên hệ</h5>
           <ul className={footerStyles.contactList}>
             <li><FaMapMarkerAlt className={footerStyles.icon} /> 123 Đường ABC, Quận XYZ, TP.HCM</li>
             <li><FaPhoneAlt className={footerStyles.icon} /> (028) 1234 5678</li>
             <li><FaEnvelope className={footerStyles.icon} /> contact@schoolhealth.com</li>
           </ul>
         </div>
       </div>
       <hr className={footerStyles.divider} />
       <div className={footerStyles.bottomRow}>
         <div className={footerStyles.copyright}>
           &copy; 2024 Hệ thống Quản lý Y tế Học đường. All rights reserved.
         </div>
         <div className={footerStyles.socials}>
           <a href="#" className={footerStyles.social} aria-label="Facebook"><FaFacebookF /></a>
           <a href="#" className={footerStyles.social} aria-label="Twitter"><FaTwitter /></a>
           <a href="#" className={footerStyles.social} aria-label="LinkedIn"><FaLinkedinIn /></a>
           <a href="#" className={footerStyles.social} aria-label="YouTube"><FaYoutube /></a>
         </div>
       </div>
     </div>
   </footer>
);

export default Footer; 