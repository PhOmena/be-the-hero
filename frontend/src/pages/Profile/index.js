import React, { useState, useEffect } from 'react';
import logoImg from '../../assets/logo.svg';
import { Link, useHistory } from 'react-router-dom'
import { FiPower } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';
import './styles.css'


export default function Profile() {
    const [incidents, setIncidents] = useState([]);
    const ongName = localStorage.getItem('ongName');
    const ongId = localStorage.getItem('ongId');
    const history = useHistory();
    useEffect(() => {
        api.get('profile', {headers : { Authorization: ongId}})
            .then(response => {
                setIncidents(response.data);
            })
    }, [ongId]);

    async function handleDeleteIncident(id){
        try {
            await api.delete(`incidents/${id}`, {
                headers : {
                    Authorization : ongId,
                }
            });

            setIncidents(incidents.filter(incident => incident.id !== id));
        } catch (err) {
            alert('Erro ao deletar caso, tente novamente');
        }
    }

    function handleLogout() {
        localStorage.clear();
        history.push('/');

    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be the Hero" />
                <span>Bem vindo (a), <strong>{ongName}</strong>!</span>

                <Link className="button-new-case" to="incidents/new">Cadastrar novo caso</Link>
                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#fff" />
                </button>
            </header>

            <h1>Casos Cadastrados</h1>

            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                        <strong>CASO</strong>
                        <hr />
                        <p>{incident.title}</p>
                        <strong>DESCRIÇÃO</strong>
                        <hr />
                        <p>{incident.description}</p>
                        <strong>VALOR</strong>
                        <hr />
                        <p>{Intl.NumberFormat('pt-BR',{ style: 'currency', currency: 'BRL'}).format(incident.value)}</p>

                        <button onClick={() => handleDeleteIncident(incident.id)} type="button">
                            <FiTrash2 className="trash" size={20} />
                        </button>
                    </li>
                ))}

                
            </ul>
        </div>
    );
}