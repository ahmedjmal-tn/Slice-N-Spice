import React, { useState, useEffect } from "react";
import axios from "axios";
import "./table.css";

function Table() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get("http://localhost:5047/api/Table/available", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTables(response.data);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchTables();
  }, [token]);

  const handleTableClick = (table) => {
    setSelectedTable(table);
  };

  const handleReservation = async () => {
    if (!user) {
      alert("Please log in to make a reservation.");
      return;
    }

    const reservation = {
      StartTime: startTime,
      EndTime: endTime,
      TableId: selectedTable.id,
      UserId: user.id,
    };

    try {
      await axios.post("http://localhost:5047/api/Reservation", reservation, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Reservation made successfully!");
      setSelectedTable(null);
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error("Error making reservation:", error);
      alert("Failed to make reservation.");
    }
  };

  const renderChairs = (capacity) => {
    const chairPositions = Array.from({ length: capacity });
    return chairPositions.map((_, index) => (
      <div
        key={index}
        className="chair"
        style={{
          transform: `rotate(${(360 / capacity) * index}deg) translate(70px) rotate(-${(360 / capacity) * index}deg)`,
        }}
      />
    ));
  };

  return (
    <div className="choose-us-section">
      <h2 className="section-title">Available Tables</h2>
      <div className="tables-grid">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`table-container ${selectedTable?.id === table.id ? "selected" : ""}`}
            onClick={() => handleTableClick(table)}
          >
            <div
              className={`table-box ${
                table.status === "available" ? "available" : "occupied"
              }`}
            >
              <span>Table {table.number}</span>
            </div>
            {renderChairs(table.capacity)}
          </div>
        ))}
      </div>
      {selectedTable && (
        <div className="reservation-form">
          <h4>Reserve Table {selectedTable.number}</h4>
          <label htmlFor="startTime">Start Time</label>
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <label htmlFor="endTime">End Time</label>
          <input
            type="datetime-local"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <button onClick={handleReservation}>Reserve</button>
        </div>
      )}
    </div>
  );
}

export default Table;