import React, { useState } from 'react';
import './Form.css';

const Form = () => {
  const [entryName, setEntryName] = useState('Not Set');
  const [entryCategory, setEntryCategory] = useState('Not Set');
  const [entryPrice, setEntryPrice] = useState(0);

  const handleChange = (e) => {
    const { value } = e.target;
   
    switch(e.target.name) {
      case "name":
        setEntryName(value);
        break;
      case "category":
        setEntryCategory(value);
        break;
      case "price":
        console.log(typeof parseInt(value))
        setEntryPrice(parseInt(value));
        break;
      default:
        console.log('Category of submission is not supported');
    }
  }

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    const data = { 
      name: entryName,
      category: entryCategory, 
      price: entryPrice
    };

    fetch('http://localhost:3001/createproduct', { 
      method: 'POST', 
      body: JSON.stringify(data),
      headers:{ 'Content-Type': 'application/json' } 
    })
    .then(res => res.json())
    .catch(err => console.error(err))
   }


  return (
    <form className="form__product" onSubmit={handleSubmit}>
      <label>Enter name</label>
      <input id="name" name="name" type="text" onChange={handleChange} />

      <label>Enter your category</label>
      <input id="category" name="category" type="text" onChange={handleChange} />

      <label>Enter a price</label>
      <input id="price" name="price" type="number" onChange={handleChange} />

      <button>Append to DB</button>
    </form>
  );
}

export default Form; 