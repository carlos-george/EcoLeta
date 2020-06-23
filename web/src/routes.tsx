import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home/index';
import CreatePoint from './pages/CreatePoint/index';
import Success from './pages/Success';
import Search from './pages/Search';
import ListPoints from './pages/List/index';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact/>
            <Route component={CreatePoint} path="/create-point"/>
            <Route component={CreatePoint} path="/update-point/:idPoint"/>
            <Route component={Success} path="/success"/>
            <Route component={Search} path="/search" />
            <Route component={ListPoints} path="/list-points" />
        </BrowserRouter>
    );
}

export default Routes;