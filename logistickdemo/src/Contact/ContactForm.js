import "./Contact.css";
import React, { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  async function submitcontact(event){
    event.preventDefault()
    await fetch('http://localhost:3002/api/contact',{
    method:'POST',
    headers:{
      'content-type':'application/json',
    },
      body:JSON.stringify({
        name,email,message
      }),
  })  
  setName('');
  setEmail('');
  setMessage('');
  setShowPopup(true);
  setTimeout(() => setShowPopup(false), 3000);
  }
  
  return (
    <div className="d-flex">
      <div id="quote">
      {showPopup && (
          <div className="message-popup" id="pop">
            Message forwarded successfully!
          </div>
        )}
        <h1 id="quotevalue">
          "Drop us a line! We're here to help and eager to hear from you."
        </h1>
      </div>
      <div className="contact-form  mt-5 p-3 bg-dark">
        <h2 className="text-warning">Contact Us</h2>
        <form onSubmit={submitcontact}>
          <label htmlFor="name" className="text-white">
            Name :
          </label>
          <input
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />

          <label htmlFor="email" className="text-white">
            Email :
          </label>
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <label htmlFor="message" className="text-white">
            Message :
          </label>
          <textarea
            
            type="text"
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
            rows="4"
            required
          ></textarea>

          <button type="submit" className="btn btn-success">
            Send Message
          </button>
        </form>
       
      </div>
    </div>
  );
}
