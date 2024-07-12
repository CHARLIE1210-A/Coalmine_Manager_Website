import React, { useState ,useEffect} from 'react';
import "../components/app.css"
import Fbottom from "./Fbottom";
import { useNavigate } from "react-router-dom";
import Header from './Header';
const RailwayForm = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("please login first") ;
      navigate('/'); // Redirect to the login page if token is not present
    }
  }, [navigate]);
  const [mines, setMines] = useState([]);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    request_id: '',
    siding_id:'',
    siding_name:'',
    received_quantity: '',
    Schedule_in_time: '',
    Schedule_in_date: '',
    remark:'',
    no_rake:'',
  });

  const handleChange = (e) => {
    const {name , value} = e.target;
    const updatedFormData = {
        ...formData,
        [name]:value,
    }
    setFormData(updatedFormData);
    console.log(updatedFormData);
  };
  const handleChange1 = (e) => {
    const {name , value} = e.target;
    const updatedFormData = {
        ...formData,
        [name]:value,
    }
    setFormData(updatedFormData);
    console.log(updatedFormData);
  };

  const handleSubmit = (e) => {
      e.preventDefault();
  
      fetch('http://localhost:5000/Request-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); 
        })
        .catch((error) => {
          console.error('Error inserting user data:', error)
        });
    };



  return (
    < > 
<Header/>
    <div className='in-body'>
      {success ? (
        <section>
          <h1>Success!</h1>
        </section>
      ) : (
    <div className="data-form-container">
      <h2>Request Form</h2>

      <form onSubmit={handleSubmit} className='inward-form'>
      
          <label>
            Request ID:
            <input type="text" name="request_id" value={formData.request_id} onChange={handleChange} />
          </label>
          <label>
            siding ID:
            <input type="text" name="siding_id" value={formData.siding_id} onChange={handleChange} />
          </label>
          <label>
            siding Name:
            <input type="text" name="siding_name" value={formData.siding_name} onChange={handleChange} />
          </label>
          <label>
         Quantity:
            <input type="number" name="received_quantity" value={formData.received_quantity} onChange={handleChange1} />
          </label> 
          <label>
         Number Of Rake :
            <input type="number" name="no_rake" value={formData.no_rake} onChange={handleChange1} />
          </label> 
          <label>
          Schedule_in_Date:
            <input type="date" name="Schedule_in_date" value={formData.Schedule_in_date} onChange={handleChange} />
          </label>
        
          <label>
          Schedule_in_time:
            <input type="time" name="Schedule_in_time" value={formData.Schedule_in_time} onChange={handleChange} />
          </label>
          <label>
            Remark:
            <input type="text" name="remark" value={formData.remark} onChange={handleChange} />
          </label>
        <button type="submit">Submit</button>
      </form>
     
    </div>
      )}
      </div>
      <Fbottom/>
         </> 
  );
};

export default RailwayForm;