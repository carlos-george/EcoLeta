import React, { useState, useEffect } from 'react';
import { FiArrowLeftCircle } from 'react-icons/fi';
import { Link, useLocation, useHistory } from 'react-router-dom';

import './list.css';
import logo from '../../assets/logo.svg';
import api from '../../services/api';
import Modal from '../../components/modal/index';

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

interface Item {
    id_item: number;
    titulo: string;
    image_url: string;
}

const ListPoints = () => {

    const location = useLocation();
    const history = useHistory();

    const state = location.state ? location.state as Params : {uf: '', city: ''};

    const [ points, setPoints ] = useState<Point[]>([]);
    const [ items, setItems ] = useState<Item[]>([]);
    const [ selectedItems, setSelectedItems ] = useState<number[]>([]);
    const [ showModal, setShowModal ] = useState(false);
    const [ idPointToDelete, setIdPointToDelete ] = useState<number>();

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const closeModal = (event: any) => {
        if (event.target.id === 'modal') {
            toggleModal();
        }
    };

    const deletePoint = () => {
        if(idPointToDelete && idPointToDelete !== 0) {
            
           api.delete(`/points/${idPointToDelete}`).then((res) => {

                const msg = res.data.message;

                console.log(msg);

                setShowModal(false);
                history.push({
                    pathname: '/success', 
                    state: { action: msg}
                });
           });

            

        }
    };

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        });
    }, []);

    useEffect(() => {

        api.get('list-points', {
            params: {
              city: state.city,
              uf: state.uf,
              items: selectedItems
            }
          }).then(response => {

            setPoints(response.data);
          })
    }, [state, selectedItems]);

    function handleSelectItem(id: number) {

        const alreadySelected = selectedItems.findIndex(item => item === id)

        if ( alreadySelected >= 0) {

            const filteredItems = selectedItems.filter(item => item !== id);
            
            setSelectedItems(filteredItems);
        } else {

            setSelectedItems([
                ...selectedItems, id
            ]);
        }

    }

    function handleEditPoint(id: number) {
        history.push(`/update-point/${id}`);
    }

    function handleDeletePoint(id: number) {
        setIdPointToDelete(id);
        setShowModal(true);
    }

    return (
        <>
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
                    <div className="location">
                        <p>Localização: <strong>{state.city}, {state.uf}</strong></p>
                        <Link to="/search">
                            <span>
                                <FiArrowLeftCircle />
                            </span>
                            <strong>
                                Nova busca
                            </strong>
                        </Link>
                    </div>
                    <h2>Itens de coleta</h2>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id_item} 
                                onClick={() => handleSelectItem(item.id_item)}
                                className={selectedItems.includes(item.id_item) ? 'selected' : '' }    
                            >
                                <img src={item.image_url} alt={item.titulo}/>
                                <span>{item.titulo}</span>
                            </li>
                        ))}
                    </ul>
                    <p><strong>{points.length} pontos</strong> encontrados</p>
                    <div className="grid-points">
                        {points.map(point => (
                            <div key={point.id_point} className="point">
                                <img src={point.image} alt={point.name}/>
                                <h2>{point.name}</h2>
                                <p>
                                    <span>
                                        {point.items ? point.items.map(item => item.titulo).join(', ') : ''}
                                    </span>
                                </p>
                                <p>{point.city + ', ' + point.uf}</p>
                                <div className="point-button">
                                    <button className="primary" onClick={() => handleEditPoint(point.id_point)}>Editar</button>
                                    <button className="danger" onClick={() => handleDeletePoint(point.id_point)}>Excluir</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
            {showModal && 
            <Modal toogleModal={toggleModal}
                    closeModal={closeModal}
                    deletePoint={deletePoint}
            />}
        </>
    );
}

export default ListPoints;
