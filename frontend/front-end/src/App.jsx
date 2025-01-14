import React,{ useState,useEffect } from 'react'
import axios from 'axios';

function App() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/hello/')
    .then((response) => {
      setMessage(response.data.message)
    })
      .catch((error) => {
        console.error("Error fetching data : ", error);
    })
  },[])

  return (
    <>
      <h1>App</h1>
      <h2>{message}</h2>
    </>
  )
}

export default App
