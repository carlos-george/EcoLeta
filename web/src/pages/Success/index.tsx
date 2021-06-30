import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi'

import './success.css';

interface Params {
    action: string;
}

const Success = () => {

    const history = useHistory();
    const location = useLocation();

    const { action } = location.state as Params;

    const title = action ? action : 'Cadastro concluído!';

    setTimeout(() => {
        history.push('/')
    }, 2000);

    return (
        <div id="create-point-success">
            <span>
                <FiCheckCircle color="#34CB79" size={32} />
            </span>
            <h1>
                {title}
            </h1>
        </div>
    );
};

export default Success;