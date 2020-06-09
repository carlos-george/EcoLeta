import React, { useState, useEffect } from 'react';
import { FiArrowLeftCircle } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

import './list.css';
import logo from '../../assets/logo.svg';
import api from '../../services/api';

interface Params {
    uf: string;
    city: string;
}

interface Point {
    id_point: number;
    name: string;
    image: string;
    uf: string;
    city: string;
    items: {
        titulo:string
    }[]
}  

const ListPoints = () => {

    const location = useLocation();

    const state = location.state ? location.state as Params : {uf: '', city: ''};

    const [ points, setPoints ] = useState<Point[]>([]);

    useEffect(() => {

        api.get('list-points', {
            params: {
              city: state.city,
              uf: state.uf,
              items: '1,2,3,4,5,6'
            }
          }).then(response => {

            setPoints(response.data);
          })
    }, [state]);

    return (
        <div id="page-list">
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
            <main>
                <p><strong>{points.length} pontos</strong> encontrados</p>
                <div className="items-points">
                    {points.map(point => (
                        <div key={point.id_point} className="item">
                            <img src={point.image} alt={point.name}/>
                            <h2>{point.name}</h2>
                            <p>
                                <span>
                                    {point.items ? point.items.map(item => item.titulo).join(', ') : ''}
                                </span>
                            </p>
                            <p>{point.city + ', ' + point.uf}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default ListPoints;
