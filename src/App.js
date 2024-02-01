import logo from './logo.svg';
import './App.css';

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
    || formatString(cpu['brand']).includes(formatedInput)  || (formatString(cpu['brand']) + formatString(cpu['cpu'])).includes(formatedInput));
    setCpuList(inputCpuList);
  }


  return (
    <div>
      {loading ? <>
        <p>Carregando dados...</p>
      </>
        : <></>}

      {dados ?
        <>
          <h1>{dados['cpuName']}</h1>
          <h3>Preço: {dados['cpuPrice']}</h3>
          <img src={dados['cpuImage']}></img>
          <p>Pontuação (CPU Mark): {dados['cpuScore']}</p>
        </>
        : <></>}
      <input value={inputValue} onChange={handleInputChange}></input>
      <select onClick = {handleInputChange}>
        {cpuSelectList.map((cpuSelect) =><option>{cpuSelect['cpu']}</option>)}
      </select>
      <button onClick={clickSearchCpu}>Pesquisar</button>
    </div>
  );
};

async function listCpu(){
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

function formatString(string){
  let formatedString = string.toLowerCase().replaceAll(' ', '').trim();
  return formatedString;
}

export default App;
