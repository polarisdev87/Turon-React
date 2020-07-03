import React from 'react';
import history from "./../services/history";
import { actionLogOut } from '../actions/actions';
import {connect} from 'react-redux';
import _ from 'lodash';

class Layout extends React.Component{
    render(){
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-transparent position-absolute w-100">
                    <div className="container">
                        <a className="navbar-brand"
                            onClick={(e) => {
                                e.preventDefault();
                                history.push('/')
                            }}
                            href="#">
                            <img 
                                src={require("../images/Turon_logo_no_background.png")}
                                alt="Turon Logo"
                                style={{ width: "200px", height: "75px" }}
                                className="d-inline-block align-top" alt="" />
                        </a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                {
                                    (this.props.user)
                                    ? <a
                                        href="#"
                                        className="nav-link text-white"
                                        onClick={() => {
                                            this.props.logout()
                                            history.push('/login')
                                        }}
                                    
                                    >Log out</a>
                                    : <a
                                        href="#"
                                        className="nav-link text-white"
                                        onClick={() => {
                                            history.push('/login');
                                        }}
                                    
                                    >Login</a>
                                }
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link text-white"
                                    href="#"
                                    onClick={() => {
                                        if(!this.props.user){
                                            history.push('/login')
                                        }else{
                                            history.push('/become-tutor')
                                        }
                                    }}
                                >Become a tutor</a>
                            </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <main className="layout">
                    {this.props.children}
                </main>
            </div>
        )
    }
}


const mapStateToProps =(state)=> {
    console.log(state);

    return {
        user : state.isAuthenticated,
        // client: state.socket
    };
}

const mapDispatchToProps =(dispatch)=> {
    return {
        logout : () => dispatch(actionLogOut()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);