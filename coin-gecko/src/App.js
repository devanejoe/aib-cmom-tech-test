import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [coinMarketsData, setCoinMarketsData] = useState(null);
  const [coinData, setCoinData] = useState({ name: '', symbol: '' });
  const [currentCoinID, setCurrentCoinID] = useState('');

  function onCurrentCoinChange(id) {
    setCurrentCoinID(id);
    fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
      .then((response) => response.json())
      .then(setCoinData);
  }

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=10&page=1')
      .then((response) => response.json())
      .then(setCoinMarketsData);
  }, []);

  if (coinMarketsData) {
    return (
      <>
        <div className="card">
          <header className="App-header card-header">
            Coin Gecko
          </header>

          <div className="card-body">
            <Coin coinData={coinData} />
            <Table tableData={coinMarketsData} onCurrentRowChange={onCurrentCoinChange} />
          </div>
        </div>
      </>
    );
  }

  return <div>No coin data available</div>
}

function Coin(props) {
  return (
    <div className="w-50 mx-auto p-3 bg-success text-center text-white">{props.coinData.symbol} - {props.coinData.name}</div>
  )
}

function Table(props) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Image</th>
          <th scope="col">Name</th>
          <th scope="col">Symbol</th>
          <th scope="col">Symbol</th>
          <th scope="col">High 24hr price</th>
          <th scope="col">Low 24hr price</th>
        </tr>
      </thead>
      <tbody>
        {props.tableData.map((rowData) =>
          <tr key={rowData.id} onClick={() => props.onCurrentRowChange(rowData.id)}>
            <td><img src={rowData.image} height="30px" /></td>
            <td>{rowData.name}</td>
            <td>{rowData.symbol}</td>
            <td>{rowData.current_price}</td>
            <td>{rowData.high_24h}</td>
            <td>{rowData.low_24h}</td>
          </tr>)}
      </tbody>
    </table>
  )
}

export default App;
