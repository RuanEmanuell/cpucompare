import logo from './logo.svg';
import './App.css';
import background from './images/background.jpg';

import React, { useEffect, useState } from 'react';


const App = () => {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [cpuSelectList, setCpuList] = useState([]);

  const clickSearchCpu = async () => {
    setDados(null);
    setLoading(true);
    let formatedInput = formatString(inputValue);
    let dados = await searchCpu(formatedInput);

    setDados(dados);
    setLoading(false);
  }

  const handleInputChange = async (event) => {
    setInputValue(event.target.value);
    let cpus = await listCpu();
    let formatedInput = formatString(event.target.value);
    let inputCpuList = cpus.filter(cpu => formatString(cpu['cpu']).includes(formatedInput)
      || formatString(cpu['brand']).includes(formatedInput) || (formatString(cpu['brand']) + formatString(cpu['cpu'])).includes(formatedInput));
    setCpuList(inputCpuList);
  }

  return (
    <div className="container" style={{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover'
    }}>
      <div className="div1">
        <div className="navbar"></div>
      </div>
      <main>
        <div className="navbar navbar-content">
          <h1>CpuCompare</h1>
        </div>
        <div className="content">
          {loading ? <>
            <p>Carregando dados...</p>
          </>
            : <></>}

          {dados ?
            <div className='cpu-box-container'>
              <div className="cpu-box">
                <h1>{dados['cpuName']}</h1>
                <h3>Preço: {dados['cpuPrice']}</h3>
                <img src={dados['cpuImage']}></img>
                <p>Pontuação (CPU Mark): {dados['cpuScore']}</p>
              </div>
            </div>
            : <></>}
          <div className="search-box-container">
            <div className="search-box">
              <input value={inputValue} onChange={handleInputChange}></input>
              {cpuSelectList.map((cpuSelect, index) => (
                <div key={index} onClick={() => {
                  setInputValue(cpuSelect['cpu']);
                  setCpuList([]);
                }}>
                  {cpuSelect['cpu']}
                </div>
              ))}
              <button onClick={clickSearchCpu}>Pesquisar</button>
            </div>
          </div>
        </div>
      </main>
      <div className="div2">
        <div className="navbar"></div>
      </div>
    </div>
  );
};

async function listCpu() {
  const response = await fetch('http://localhost:3001/cpulist');
  const data = await response.json();
  JSON.stringify(data);
  return data;
}

async function searchCpu(value) {
  try {
    console.log(`http://localhost:3001/cpulist/${value}`);
    const response = await fetch(`http://localhost:3001/cpulist/${value}`);
    const data = await response.json();
    JSON.stringify(data);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

function formatString(string) {
  let formatedString = string.toLowerCase().replaceAll(' ', '').trim();
  return formatedString;
}

export default App;
