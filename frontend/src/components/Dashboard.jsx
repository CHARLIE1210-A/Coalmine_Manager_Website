import React, { useRef } from "react";
import '../components/app.css'
import Header from "./Header";
import Fbottom from "./Fbottom";
import html2pdf from "html2pdf.js"
import { useState, useEffect } from "react";
import { useMineId } from "../api/context";

function Dashboard() {

  const [data, setData] = useState([]);
  const [selectedMineId, setSelectedMineId] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //----------------------------
  // const handleAccept = (requestId, remark) => {
  //   // Assuming your backend server is running on http://localhost:5000
  //   const apiUrl = "http://localhost:5000/confirm-request";

  //   // Make a fetch request to the backend
  //   fetch(apiUrl, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ requestId, remark }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       // You can perform any additional actions here after the request is accepted
  //       // For example, update the UI or show a success message
  //       if (onAccept) {
  //         onAccept();
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error accepting request:", error);
  //       // Handle errors as needed
  //     });
  // };


  // pdf download

  const tableref = useRef(null)
  const handleDownloadPdf = () => {
    const element = tableref.current;
    if (element) {
      html2pdf(element)
    }
  }

  const [success, setSuccess] = useState(false);

  const { mineId } = useMineId();
  useEffect(() => {
    fetch(`http://localhost:5000/requestScheduled`) // Assuming your backend server runs on the same host
      .then(response => response.json())
      .then(result => {
        setData(result.request_scheduled);
        setFilteredData(result.request_scheduled);
        console.log(result.request_scheduled);
      })
      .catch(error => console.error('Error:', error));
  }, [mineId]);

  // Handle filtering by using mine_id
  const handleFilter = e => {
    const selectedId = e.target.value;
    setSelectedMineId(selectedId);

    if (selectedId === 'all') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item => item.siding_id === selectedId);
      setFilteredData(filtered);
    }
  };

  function formatDateToDDMMYYYY(isoDate) {
    const date = new Date(isoDate);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  }

  return (
    < >
      <div className="headerH">
        <img src="./src/Assets/ashok.png" alt="Logo 1" className="logo" id="logo1" />
        <h1 className="ministry_of_coal">Ministry of coal</h1>
        <img src="./src/Assets/G20.png" alt="Logo 2" className="logo" id="logo2" />
      </div>
      <div className="navbar" style={{ display: 'inline-block', width: '100%' }}>
        <img src="/src/Assets/actual_logo.png" alt="" style={{ height: "50px", width: "100px", marginLeft: "5px", marginTop: "3px" }} />
      </div>
      {success ? (
        <section>
          <h1>Success!</h1>
        </section>
      ) : (
        <div className="data1">

          <div className="Rtable">
            <h1>Area Report</h1>

            <div className="Rt">
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="mineIdFilter">Select Mine ID: </label>
                <select id="mineIdFilter" onChange={handleFilter} value={selectedMineId}>
                  <option value="all">All</option>
                  {/* mine IDs are available in the data */}
                  {[...new Set(data.map(item => item.siding_id))].map(id => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select></div>


              <button onClick={handleDownloadPdf} style={{backgroundColor:"gray", color:"white",borderRadius:"3px"}}>Download Report</button>
                    <br />
                    <br />
              <table ref={tableref} className="Rtable1">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Siding ID</th>
                    <th>Siding Name</th>
                    <th>Requested Quantity</th>
                    <th>Current Stock</th>
                    <th>Scheduled InTime</th>
                    <th>Scheduled InDate</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={item.Request_ID}>
                      <td >{item.Request_ID}</td>
                      <td>{item.siding_id}</td>
                      <td>{item.siding_name}</td>
                      <td>{item.Quantity}</td>
                      <td>{item.curr_stock}</td>
                      <td>{item.Scheduled_In_Time}</td>
                      <td>{formatDateToDDMMYYYY(item.Scheduled_In_Date)}</td>
                      <td >{item.remark}</td>
                      {/* <button onClick={() => handleAccept(item.Request_ID, item.remark)}>Accept</button> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      )}
      <Fbottom />
    </>
  );
}

export default Dashboard;