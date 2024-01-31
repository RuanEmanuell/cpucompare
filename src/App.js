import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from 'react';

const App = () => {
    const [dados, setDados] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3001/cpulist/ryzen54600g'); 
                const data = await response.json();
                JSON.stringify(data);
                setDados(data);
            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
            }
        };

        fetchData();
    }, []);

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
                <p>Carregando dados...</p>
            )}
        </div>
    );
};

export default App;
