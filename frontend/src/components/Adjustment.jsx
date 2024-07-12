import React, { useState, useEffect } from 'react';
import "../components/app.css"
import Header from "./Header";
import Fbottom from "./Fbottom";
import { useNavigate } from "react-router-dom";
const Adjustment = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("please login first");
      navigate('/');
      // Redirect to the login page if token is not present
    }
  }, [navigate]);
  const [data, setData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [selectedMineId, setSelectedMineId] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedsidingName, setSelectedsidingname] = useState('');

  const [formData, setFormData] = useState({
    date: '',
    remark: '',

  });

  const [errors, setErrors] = useState({

    date: '',
    remark: '',

  });

  // const { mineId } = useMineId();

  useEffect(() => {
    fetch(`http://localhost:5000/update-request`) // Assuming your backend server runs on the same host
      .then(response => response.json())
      .then(result => {
        setData(result.request);
        setFilteredData(result.request);
        console.log(result.request);
      })
      .catch(error => console.error('Error:', error));
  }, []);
  const [filteredRequestIds, setFilteredRequestIds] = useState([]);
  const handleFilter = (e) => {
    const selectedId = e.target.value;
    setSelectedMineId(selectedId);
  };
  const handleFilter1 = (e) => {
    const selectedSidingName = e.target.value;
    setSelectedsidingname(selectedSidingName);

    // Filter the data based on the selected siding_name
    const filteredData = data.filter(item => item.siding_name === selectedSidingName);

    // Get unique request_ids from filteredData
    const uniqueRequestIds = [...new Set(filteredData.map(item => item.request_id))];

    // Update the filtered data based on the selected Siding_name
    setFilteredData(filteredData);

    // Update the options for the Request ID dropdown based on the filtered request IDs
    setFilteredRequestIds(uniqueRequestIds);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const requestData = {
      date: formData.date,
      remark: formData.remark,
      request_id: selectedMineId,// Assuming this is the field for request_id
    };
    fetch('http://localhost:5000/updated-entry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Error inserting user data:', error)
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    }
    setFormData(updatedFormData);
  };

  return (
    <>
      <Header />
      <div className='out-body'>



        {success ? (
          <section>
            <h1>Success!</h1>
          </section>
        ) : (
          <div className='data-form-container-out'>
            <form className='form-out1' onSubmit={handleFormSubmit} style={{ marginBottom: "10px" }}>
              <label htmlFor="mineIdFilter" style={{ marginBottom: "10px" }}>Siding_name :
                <select style={{ marginLeft: "40px", width: "230px" }} id="mineIdFilter" onChange={handleFilter1} value={selectedsidingName}>
                  <option value='0'>--Select--</option>
                  {[...new Set(data.map(item => item.siding_name))].map(id => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                    // 
                  ))}
                </select>
              </label>
              <label htmlFor="mineIdFilter" style={{ marginBottom: "10px" }}>Request Id :
                <select
                  style={{ marginLeft: "60px", width: "230px" }}
                  id="mineIdFilter"
                  onChange={handleFilter}
                  value={selectedMineId}
                >
                  <option value='0'>--Select Request ID--</option>
                  {filteredRequestIds.map(id => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </label>
              <br />
              <label style={{ marginBottom: "10px" }}>Date :
                <input style={{ marginLeft: "115px", width: "230px" }} type="date" name="date" value={formData.date} onChange={handleInputChange} placeholder="Date (YYYY-MM-DD)" autoComplete='off' required pattern="\d{4}-\d{2}-\d{2}" />
                {errors.date && <div className="error-message">{errors.date}</div>}
              </label><br />
              <label style={{ marginBottom: "10px" }}>Remark :
                <input style={{ marginLeft: "87px" }} type="text" name="remark" value={formData.remark} onChange={handleInputChange} placeholder="Remark..." autoComplete='off' required />
                {errors.rake_no && <div className="error-message">{errors.rake_no}</div>}
              </label><br />
              <button style={{ marginLeft: "240px" }} type="submit">Submit</button>
            </form>
          </div>


        )}

        <Fbottom />
      </div>

    </>
  );
};

export default Adjustment;
