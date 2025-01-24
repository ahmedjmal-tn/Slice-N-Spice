import React, { Fragment } from "react";
import Header from "../header/Header";
import MenuPack from "../menu-pack/MenuPack";
import Footer from "../footer/Footer";

function Menu() {
  return (
    <Fragment>
      <Header />
      <div style={{ margin: "20px 0" }}></div> {/* Ajoute un espace de 20px */}
      <MenuPack />
      <Footer />
    </Fragment>
  );
}

export default Menu;