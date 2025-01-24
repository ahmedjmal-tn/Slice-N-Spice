import React from 'react'
import Header from "../header/Header";
import Footer from "../footer/Footer";
import ChooseUs from '../header/choose-us/ChooseUs';
import Table from '../Table/Table';
const Reservation = () => {
  return (
    <div>
            <Header />
      <div style={{ margin: "20px 0" }}></div> {/* Ajoute un espace de 20px */}
      <Table/>
      <Footer />
    </div>
  )
}

export default Reservation
