import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./components/Pages/Home";
import Menu from "./components/Pages/Menu";
import Reservation from "./components/Pages/Reservation";

import Register from "./components/Authentification/Register";
import Login from "./components/Authentification/login";
import Cart from "./components/Cart/Cart";
import ProtectedRoute from "./components/Authentification/ProtectedRoute";
import { AuthProvider } from "./components/Authentification/AuthContext";
import Dashboard from "./components/Dashboard/Dashboard";
import ListCategory from "./components/Dashboard/Category/ListCategory";
import ListFood from "./components/Dashboard/Food/ListFood";
import ListOrder from "./components/Dashboard/Order/ListOrder";
import ListTable from "./components/Dashboard/Table/ListTable";
import ListReservation from "./components/Dashboard/Reservation/ListReservation";
import AddCategory from "./components/Dashboard/Category/AddCategory";
import EditCategory from "./components/Dashboard/Category/EditCategory";
import AddFood from "./components/Dashboard/Food/AddFood";
import EditFood from "./components/Dashboard/Food/EditFood";
import AddTable from "./components/Dashboard/Table/AddTable";
import EditTable from "./components/Dashboard/Table/EditTable";
import ListOrderC from "./components/Dashboard/Client/ListOrderC";
import ListReservationC from "./components/Dashboard/Client/ListReservationC";
function App() {
  return (
    <div className="App">
     <Router>
        <AuthProvider>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
            <Route path="/reservation" element={<ProtectedRoute><Reservation /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/dash" element={<Dashboard />}/>
            
            <Route path="/reservations" element={<ListReservation />}/>
            <Route path="/tables" element={<ListTable />}/>
            <Route path="/orders" element={<ListOrder />}/>


            <Route path="/categorie" element={<ListCategory />}/>
            <Route path="/categorie/add" element={<AddCategory />}/>
            <Route path="/categorie/edit/:id" element={<EditCategory />}/>


            <Route path="/food" element={<ListFood />}/>
            <Route path="/food/add" element={<AddFood />}/>
            <Route path="/food/edit/:id" element={<EditFood />}/>
            
            <Route path="/ordersC" element={<ListOrderC />}/>
            <Route path="/ListReservationC" element={<ListReservationC />}/>
            <Route path="/tables" element={<ListTable />}/>
            <Route path="/tables/add" element={<AddTable />}/>
            <Route path="/tables/edit/:id" element={<EditTable />}/>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;