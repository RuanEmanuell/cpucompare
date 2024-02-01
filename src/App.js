import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from 'react';

const App = () => {
  const [dados, setDados] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const clickSearchCpu = async () => {
    setDados(null);
    let dados = await searchCpu(inputValue);

    setDados(dados);
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }


  return (
    <div>
      {dados ? (
        <>
          <h1>{dados['cpuName']}</h1>
          <h3>Preço: {dados['cpuPrice']}</h3>
          <img src={dados['cpuImage']}></img>
          <p>Pontuação (CPU Mark): {dados['cpuScore']}</p>
        </>
      ) : (
        <>
          <p>Carregando dados...</p>
        </>
      )}
      <input value={inputValue} onChange={handleInputChange}></input>
      <button onClick={clickSearchCpu}>Pesquisar</button>
    </div>
  );
};

async function searchCpu(value) {
  try {
    const response = await fetch(`http://localhost:3001/cpulist/${value}`);
    const data = await response.json();
    JSON.stringify(data);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export default App;
