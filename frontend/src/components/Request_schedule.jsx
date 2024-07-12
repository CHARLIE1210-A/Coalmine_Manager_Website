import React from "react";
import '../components/app.css'
import Header from "./Header";
import Fbottom from "./Fbottom";
import { useState, useEffect} from "react";
import { useMineId } from "../api/context";
function RequestScheduleStatus() {

    const [data, setData] = useState([]);
    const [selectedMineId, setSelectedMineId] = useState('');
    const [filteredData, setFilteredData] = useState([]);
//----------------------------
const handleAccept = (requestId,remark) => {
  // Assuming your backend server is running on http://localhost:5000
  const apiUrl = "http://localhost:5000/confirm-request";

  // Make a fetch request to the backend
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({requestId,remark}),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // You can perform any additional actions here after the request is accepted
      // For example, update the UI or show a success message
      if (onAccept) {
        onAccept();
      }
    })
    .catch((error) => {
      console.error("Error accepting request:", error);
      // Handle errors as needed
      });
  };

  const [success, setSuccess] = useState(false);

  const { mineId } = useMineId();
  useEffect(() => {
    fetch(`http://localhost:5000/requestScheduled?mineId=${mineId}`) // Assuming your backend server runs on the same host
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
      const filtered = data.filter(item => item.mine_id === selectedId);
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
    <Header/>  
      {success ? (
        <section>
          <h1>Success!</h1>
        </section>
      ) : (
     <div className="data1">
   
   <div className="Rtable">
   <h1>Request Scheduled Data</h1>
     
      <div className="Rt">
        <div style={{marginBottom:"10px"}}>
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
   <table className="Rtable1">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Siding ID</th>
            <th>Siding Name</th>
            <th>Stock</th>
            <th>No Of Rakes</th>
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
              <td>{item.no_rake}</td>
              <td>{item.Scheduled_In_Time}</td>
              <td>{formatDateToDDMMYYYY(item.Scheduled_In_Date)}</td>
              <td >{item.remark}</td>
              <button onClick={()=> handleAccept(item.Request_ID,item.remark)}>Accept</button>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
   </div>
        </div>
        
      )}
   <Fbottom/>
      </> 
  );
}

export default RequestScheduleStatus;