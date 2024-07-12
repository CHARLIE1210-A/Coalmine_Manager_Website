import React from "react";
import "../components/app.css"
import Fbottom from './Fbottom';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// import { Link } from "react-router-dom";


function Register() {
  

  
  const [pin, setPin] = useState("");
  const [primeId, setPrimeId] = useState("");
  
  const navigate = useNavigate();
  function handleClick() {
    navigate("/Dashboard");
  } 

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send data to the server
    fetch('http://localhost:5000/manager/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pin, primeId }),
    })
      .then(response => response.json())
      .then(data => {
       alert("Mine Registered Successfully")
       handleClick();
        })
      .catch(error => console.error('Error:', error));
       setPin("")
       setPrimeId("")
       

  };
  
  return (
    <> 
      <div>
    <div className="bodyR">
    
    <div className="loginformR">
              {/*put router link here*/}
            
      
        
      
        <section className="s">
         
          <h2> Area Manager Login</h2>

          <form
          className="Rform" action="" onSubmit={handleSubmit}>
            <label className=".Rlable"
            htmlFor="Pin">
              Enter Pin:
              
              
            </label>
            <input
            className="Rinput"
              type="number"
              id="Pin"
              
              name="pin"
              autoComplete="off"
              onChange={(e) => setPin(e.target.value)}
              value={pin}
              required
              
             
            />
            

            <label
            className="Rlable" htmlFor="PrimeID">
              Enter Prime Id:
              
              
            </label>
            <input
            className="Rinput"
              type="number"
              id="PrimeId"
              
              name="id"
              autoComplete="off"
              onChange={(e) => setPrimeId(e.target.value)}
              value={primeId}
              required
              
            />
            

            

            

            <button 
            className="Rbutton"
              >
              Log In
            </button>
          </form>
         
        </section>
      
      </div>
      </div>
      <Fbottom/>
    </div>
    </>
  );
}

export default Register;
