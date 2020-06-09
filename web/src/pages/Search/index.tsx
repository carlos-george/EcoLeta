import React, { useState, useEffect, ChangeEvent }  from 'react';
import { FiSearch, FiArrowLeftCircle } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

import './search.css';
import logo from '../../assets/logo.svg';

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const Search = () => {

    const history = useHistory();

    const [ ufs, setUfs ] = useState<string[]>([]);
    const [ selectedUf, setSelectedUf ] = useState('0');
    const [ cities, setCities ] = useState<string[]>([]);
    const [ selectedCity, setSelectedCity ] = useState('0');

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(
            response => {
                const ufInitials = response.data.map(uf => uf.sigla);
                setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {
        if (selectedUf === '0') {
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(
            response => {
                const cities = response.data.map(city => city.nome);
                setCities(cities);
            });
    }, [selectedUf]);

    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    };

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);
    };

    function handleSearchPoints() {
        
        history.push({
            pathname: '/list-points',
            state: {
                uf: selectedUf,
                city: selectedCity
            }
        });
    }

    return (
        <div id="page-search-points">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <span>
                        <FiArrowLeftCircle />
                    </span>
                    <strong>
                        Voltar para Home
                    </strong>
                </Link>
            </header>
            <div className="content">
                <h1>Pontos de coleta</h1>
                
                <fieldset>
                    <div className="field-group">
                        <div className="field">
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectedUf}>
                                <option value="o">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                    </div>    
                    <div className="field-group">
                        <div className="field">
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="field-group">
                        <div className="field">
                            {/* <Link to="/list-points">
                                <span>
                                    <FiSearch />
                                </span>
                                <strong>Buscar pontos de Coleta</strong>
                            </Link> */}
                            <button onClick={handleSearchPoints}>
                                <span>
                                    <FiSearch />
                                </span>
                                <strong>Buscar pontos de Coleta</strong>
                            </button>
                        </div>
                    </div>
                </fieldset> 
            </div>   
        </div>
    );
};

export default Search;
