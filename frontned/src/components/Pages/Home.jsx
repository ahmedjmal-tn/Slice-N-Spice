import React, { Fragment } from "react";
import Header from "../header/Header";
import HeroSlider from "../header/hero-slider/HeroSlider";
import PopularMenu from "../header/popular-menu/PopularMenu";
import ChooseUs from "../header/choose-us/ChooseUs";
import Testimonials from "../Testimonials/Testimonials";
import Footer from "../footer/Footer";

function Home() {
  return (
    <Fragment>
      <Header />
      <HeroSlider />
      <ChooseUs />
      <Testimonials />
      <Footer />
    </Fragment>
  );
}

export default Home;