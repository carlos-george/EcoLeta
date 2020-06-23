import React from 'react';
import { FiXCircle } from 'react-icons/fi';

import './modal.css';

const Modal = ({ toogleModal, closeModal, deletePoint } : any) => {

    return (
        <aside id="modal" onClick={closeModal}>
            <header>
                <h2>Excluir ponto de coleta</h2>
                <FiXCircle className="modal-x-icon" onClick={toogleModal}/>
            </header>
            <main>
                <h2>Deseja realmente excluir o ponto?</h2>
            </main>
            <footer>
                <button className="danger" onClick={deletePoint}>OK</button>
                <button className="primary" onClick={toogleModal}>Cancelar</button>
            </footer>
        </aside>
    );
}

export default Modal;