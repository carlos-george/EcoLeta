import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { FiArrowLeftCircle } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import ReactTooltip from 'react-tooltip';
import axios from 'axios';

import Dropzone from '../../components/dropzone/index';
import './create-point.css';
import logo from '../../assets/logo.svg';
import api from '../../services/api';

interface Item {
    id_item: number;
    titulo: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

interface Params {
    idPoint: string;
}

const CreatePoint = () => {

    const history = useHistory();

    const params = useParams<Params>();

    const [ idPoint, setIdPoint ] = useState();

    const [ action, setAction ] = useState('Cadastrar')
    const [ formData, setFormData ] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });
    const [ items, setItems ] = useState<Item[]>([]);
    const [ ufs, setUfs ] = useState<string[]>([]);
    const [ selectedUf, setSelectedUf ] = useState('0');
    const [ cities, setCities ] = useState<string[]>([]);
    const [ selectedCity, setSelectedCity ] = useState('0');
    const [ selectedPosition, setSelectedposition ] = useState<[number, number]>([0,0]);
    const [ initialPosition, setInitialposition ] = useState<[number, number]>([0,0]);
    const [ selectedItems, setSelectedItems ] = useState<number[]>([]);
    const [ selectedFile, setSelectedFile ] = useState<File>();
    const [ imageUrl, setImageUrl ] = useState('');
    
    function handleMapClick(event: LeafletMouseEvent) {
        const latLng = event.latlng;
        setSelectedposition([
            latLng.lat, latLng.lng
        ]);
    }

    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    };

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);
    };

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        
        const { name, value } = event.target;

        setFormData({
            ...formData, [name]: value
        });
    }

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

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [ latitude, longitude ] = selectedPosition;
        const items = selectedItems;


        const data = new FormData();

        data.append('name',name);
        data.append('email',email);
        data.append('whatsapp',whatsapp);
        data.append('uf',uf);
        data.append('city',city);
        data.append('latitude', String(latitude));
        data.append('longitude',String(longitude));
        data.append('items',items.join(','));
        
        if(selectedFile) {

            data.append('image', selectedFile);
        }


        if(!idPoint) {

            await api.post('points', data).then((res) => {
                
                const msg = res.data.message;
    
                history.push({
                    pathname: '/success', 
                    state: { action: msg}
                });
            });
        } else {

            await api.put(`points/${idPoint}`, data).then((res) => {
                
                const msg = res.data.message;
    
                history.push({
                    pathname: '/success', 
                    state: { action: msg}
                });
            });    
        }

    }

    useEffect(() => {
        if(idPoint) {

            api.get(`points/${idPoint}`).then((res) => {
                const point = res.data;
                // console.log(point);
                setFormData({
                        name: point.name,
                        email: point.email,
                        whatsapp: point.whatsapp
                    });
                setImageUrl(point.image);    
                setSelectedUf(point.uf);
                setSelectedCity(point.city);
                setSelectedposition([point.latitude, point.longitude]);
                setInitialposition([point.latitude, point.longitude]);
                const idItems = point.items.map( (item: Item) => item.id_item);
                setSelectedItems(idItems); 
            });
        }

    }, [idPoint]);

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        });
    }, []);

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

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;

            setInitialposition([latitude, longitude]);
        });
    }, []);

    useEffect(() => {
        if(params && params.idPoint) {
            setIdPoint(params.idPoint);
            setAction('Editar');
        }else {
            setIdPoint(null);
            setAction('Cadastrar');
        }

    }, [params]);

    useEffect(() => {

        const image = imageUrl.split('uploads/')[1];

        if(image) {

            api.get(`/uploads/${image}`, { responseType: 'arraybuffer'})
                 .then(res => {

                    const blob1 = new Blob([res.data], {
                        type: 'image/*',
                      });

                    const img = image.split('-')[1];
                    const file = new File([blob1], img);
                    setSelectedFile(file);
                });
        }
    }, [imageUrl]);

    return (
        <div id="page-create-point">
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

            <form onSubmit={handleSubmit}>
                <h1>{action} Ponto de Coleta</h1>

                {imageUrl ? 
                    <img className="place-image" data-tip data-for="registerTip" 
                            src={imageUrl} 
                            alt={formData.name} 
                            onClick={() => setImageUrl('')}
                    /> 
                    : <Dropzone onFileUploaded={setSelectedFile}/> }
                
                <ReactTooltip id="registerTip" place="top" effect="solid">
                    Clique para adicionar uma nova imagem
                </ReactTooltip>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input type="text" 
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" 
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text" 
                                    name="whatsapp"
                                    id="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    {/* <Map center={[-15.800512501152594, -47.86193847656251]} zoom={15} onClick={handleMapClick}> */}
                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer 
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        
                        <Marker position={selectedPosition} />   
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectedUf}>
                                <option value="o">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de Coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>
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
                </fieldset>

                <button type="submit">{action} ponto de coleta</button>    
            </form>
        </div>
    );
}

export default CreatePoint;
