import React, {Component} from 'react';
import './App.scss';


import {BrowserRouter} from 'react-router-dom';
import Routes from "./components/Routes";

class App extends Component {
    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Routes/>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
