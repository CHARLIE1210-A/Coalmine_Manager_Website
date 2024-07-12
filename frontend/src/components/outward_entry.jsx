import React, { useState, useEffect } from 'react';
import "../components/app.css"
import Header from "./Header";
import Fbottom from "./Fbottom";
// import { useMineId } from "../api/context";
import { useNavigate } from "react-router-dom";
const OutwardEntryForm = () => {
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


  const [formData, setFormData] = useState({

    out_quantity: '',
    date: '',
    rake_no: '',
    remark: '',

  });

  const [errors, setErrors] = useState({

    out_quantity: '',
    date: '',
    rake_no: '',
    remark: '',

  });

  // const { mineId } = useMineId();

  useEffect(() => {
    fetch(`http://localhost:5000/requestScheduled`) // Assuming your backend server runs on the same host
      .then(response => response.json())
      .then(result => {
        setData(result.request_scheduled);
        setFilteredData(result.request_scheduled);
        console.log(result.request_scheduled);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  const handleFilter = (e) => {
    const selectedId = e.target.value;
    setSelectedMineId(selectedId);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const requestData = {
      out_quantity: formData.out_quantity,
      date: formData.date,
      rake_no: formData.rake_no,
      remark: formData.remark,
      request_id:selectedMineId, // Assuming this is the field for request_id
    };
    fetch('http://localhost:5000/outward-entry', {
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
            <form className='form-out' onSubmit={handleFormSubmit}style={{ marginBottom: "10px" }}>
              <label htmlFor="mineIdFilter" style={{ marginBottom: "10px" }}>Request Id :
                {/* <input style={{marginLeft:"60px"}} type="text" name="request_id" value={formData.request_id} onChange={handleInputChange} placeholder="Enter request Id..." autoComplete='off' />
            {errors.request_id && <div className="error-message">{errors.request_id}</div>} */}



                <select style={{ marginLeft: "60px",width:"230px" }}id="mineIdFilter" onChange={handleFilter} value={selectedMineId}>
                  <option value='0'>--Select Request ID--</option>
                  {[...new Set(data.map(item => item.Request_ID))].map(id => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                    // 
                  ))}
                </select>
              </label>
              <br />
              <label style={{ marginBottom: "10px" }}>Out Quantity :
                <input style={{ marginLeft: "37px" }} type="text" name="out_quantity" value={formData.out_quantity} onChange={handleInputChange} placeholder="Enter Quantity..." autoComplete='off' required />
                {errors.out_quantity && <div className="error-message">{errors.out_quantity}</div>}
              </label>
              <br />
              <label style={{ marginBottom: "10px" }}>Date :
                <input style={{ marginLeft: "115px", width: "230px" }} type="date" name="date" value={formData.date} onChange={handleInputChange} placeholder="Date (YYYY-MM-DD)" autoComplete='off' required pattern="\d{4}-\d{2}-\d{2}" />
                {errors.date && <div className="error-message">{errors.date}</div>}
              </label><br />
              <label style={{ marginBottom: "10px" }}>Rake No :
                <input style={{ marginLeft: "81px" }} type="text" name="rake_no" value={formData.rake_no} onChange={handleInputChange} placeholder="Rake number..." autoComplete='off' required />
                {errors.rake_no && <div className="error-message">{errors.rake_no}</div>}
              </label><br />
              <label style={{ marginBottom: "10px" }}>Remark :
                <input style={{ marginLeft: "87px" }} type="text" name="remark" value={formData.remark} onChange={handleInputChange} placeholder="Remark..." autoComplete='off' required />
                {errors.rake_no && <div className="error-message">{errors.rake_no}</div>}
              </label><br />
              <button style={{ marginLeft: "240px" }}type="submit">Submit</button>
            </form>
          </div>


        )}

        <Fbottom />
      </div>

    </>
  );
};

export default OutwardEntryForm;
