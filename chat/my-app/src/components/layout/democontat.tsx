import { useEffect, useState } from "react";

function ContactList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/contacts/")
      .then(res => res.json())
      .then(result => setData(result));
  }, []);

  return (
    <div>
      <h2>Contacts</h2>
      {data.map((item, index) => (
        <div key={index}>
          <p>Name: {item.name}</p>
          <p>Number: {item.number}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default ContactList;
