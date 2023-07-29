import React, { useState, useEffect } from 'react';
import './App.css';
import moment from 'moment';

function App() {
    const [A, setA] = useState(0);
    const [B, setB] = useState(0);
    const [records, setRecords] = useState([]);
    const [formData, setFormData] = useState({
      date: '',
      title: '',
      amount: '',
    })

    const fetchData = async () => {
      const response = await fetch(
        "https://64c365c0eb7fd5d6ebd0d24d.mockapi.io/recods"
      ).then((response) => response.json())
      .catch((eror) => alert('Lỗi lấy dữ liệu'));
      setRecords(response);
      const positiveAmounts = response.filter(record => record.amount > 0);
      const totalPositiveAmounts = positiveAmounts.reduce((sum, record) => sum + record.amount, 0);
      const negativeAmounts = response.filter(record => record.amount < 0);
      const totalNegativeAmounts = negativeAmounts.reduce((sum, record) => sum + parseInt(record.amount, 10), 0);
      setA(totalPositiveAmounts);
      setB(parseInt(totalNegativeAmounts));
    };

    useEffect(() => {
      fetchData();
    }, []);

    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };
    

    const handleCreateRecord = (event) => {
        event.preventDefault();
        fetch('https://64c365c0eb7fd5d6ebd0d24d.mockapi.io/recods/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Tạo thành công rồi!!!!');
        fetchData();
        setFormData({
          date: '',
          title: '',
          amount: '',
        })
      })
      .catch((error) => {
        alert(`Lỗi rồi!!!!, lỗi là ${error?.message}`);
      });
      
    };

    const handleDetelteItem = async (item) => {
      const response = await fetch(
          "https://64c365c0eb7fd5d6ebd0d24d.mockapi.io/recods/" + item?.id, {
            method: 'DELETE',
          }
        ).then((response) => response.json())
        .catch((eror) => alert('Lỗi xoá'));
        console.log('response', response);
        if(response) {
          alert('Xoá thành công');
          fetchData();
        }
    }

    return (
        <div className="App">
            <div className="container">
                <div style={{display: 'flex', flexDirection: 'column', margin: '1rem'}}>
                    <div>Credit: {A}</div>
                    <div>Debit: {B}</div>
                    <div>Balance: {A + B}</div>
                </div>

                <form onSubmit={handleCreateRecord} style={{display: 'flex', flexDirection: 'row', margin: '1rem'}}>
                    <input type="date" name="date" required onChange={handleChange}/>
                    <input type="text" name="title" placeholder="Title" required onChange={handleChange}/>
                    <input type="number" name="amount" placeholder="Amount" required onChange={handleChange}/>
                    <button type="submit">Create Record</button>
                </form>

                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => (
                            <tr key={index}>
                                <td>{moment(record.date).format('DD/MM/YYYY')}</td>
                                <td>{record.title}</td>
                                <td>{record.amount}</td>
                                <td>
                                  <button style={{backgroundColor: 'red', color: 'white', padding: 10}} onClick={() => handleDetelteItem(record)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
