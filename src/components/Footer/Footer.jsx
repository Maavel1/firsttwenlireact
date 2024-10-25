import React from "react";
import clasess from "./footer.module.scss";
import logo from "../../assets/logo.png";
import inst from "../../assets/inst.svg";
import telegram from "../../assets/icons-telegram.svg";
export default function Footer() {
  return (
    <>
      <footer className={clasess.footer}>
        <div className="container">
          <div className={clasess.footerContainer}>
            <div className={clasess.logoFooter}>
              <img src={logo} alt="" />
            </div>
            <div className={clasess.Author}>
              <h3>© 2024 FirstTwenli. Все права защищены. </h3>
            </div>
            <div className={clasess.Social}>
              <a
                href="https://cs9.pikabu.ru/post_img/2017/06/20/7/1497955228126370905.jpg"
                target="_blank"
              >
                {" "}
                <img src={inst} alt="" />
              </a>
              <a
                href="https://cs9.pikabu.ru/post_img/2017/06/20/7/1497955228126370905.jpg"
                target="_blank"
              >
                {" "}
                <img src={telegram} alt="" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
