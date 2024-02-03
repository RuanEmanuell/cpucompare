import './App.css';
import { useSpring, animated } from 'react-spring';
import logo from './images/logo.png';
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
            <LoadingCpu loadingSkeleton={1} />
            <LoadingCpu loadingSkeleton={2} />
            <LoadingCpu loadingSkeleton={3} />
          </>
            : <></>}

          {dados ?
            <div className='cpu-box-container'>
              <div className="cpu-box">
                <h1>{dados['cpuName']}</h1>
                <h3>Preço: {dados['cpuPrice']}</h3>
                <img src={dados['cpuImage']}></img>
                <p>Desempenho: {dados['performanceRating']}</p>
                <p>Custo Benefício: {dados['costRating']}</p>
                <p>{dados['cpuSpecs']}</p>
                <p>Pontuação (CPU Mark): {dados['cpuScore']}</p>
              </div>
            </div>
            : <div className='logo-container'>
              {!loading ? <img src={logo} className="logo"></img> : <></>}
              </div>}
          <search>
            <div className="search-box">
              <div className="input-button">
                <input value={inputValue} onChange={handleInputChange} className="search-input" placeholder="Digite um processador..."></input>
                <button onClick={clickSearchCpu} className="search-button" disabled = {loading}>Pesquisar</button>
              </div>
              <div className="cpu-suggestions-box">
                <div className="cpu-suggestions">
                  {cpuSelectList.map((cpuSelect, index) => (
                    <div key={index} onClick={() => {
                      setInputValue(cpuSelect['cpu']);
                      setCpuList([]);
                    }} className="suggestion">
                      <h4>{cpuSelect['brand']} {cpuSelect['cpu']}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </search>
        </div>
      </main>
      <div className="div2">
        <div className="navbar"></div>
      </div>
    </div>
  );
};

function LoadingCpu({ loadingSkeleton }) {
  const loadingClass = `loading-skeleton${loadingSkeleton}`
  const animatedStyles = useSpring({
    loop: true,
    to: [
      { backgroundColor: '#808080' },
      { backgroundColor: '#c6c6c6' }
    ],
    from: { backgroundColor: '#c6c6c6' },
  });

  return (
    <div className="loading-skeleton-container">
      <div className="loading-skeleton-box">
        <animated.div className={loadingClass} style={{ ...animatedStyles }
        }></animated.div>
      </div>
    </div>
  )
}

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

    if (!response.ok) {
      alert(`Erro ${response.status}: Processador não encontrado.`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

function formatString(string) {
  let formatedString = string.toLowerCase().replaceAll(' ', '').trim();
  return formatedString;
}

export default App;
