import React, { Component } from "react";
import history from "./../services/history";
import {connect} from "react-redux";

import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';

import './styles/Home.scss';
import { actionLogOut } from "../actions/actions";

import _ from 'lodash';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: 0,
            students: [
                {
                    subs: "Inexpensive alternatives to school/professional tutoring"
                },
                {
                    subs: "Get tutored on your own time"
                },
                {
                    subs: "Seamlessly find and book a tutor in minutes"
                },
                {
                    subs: "Multilingual tutors"
                }
            ],
            tutors: [
                {
                    subs: "Work on your own schedule"
                },
                {
                    subs: "Locate clients like never before"
                },
                {
                    subs: "No tedious certification process"
                },
                {
                    subs: "Quick onboarding procedure"
                }
            ]
        };
    }

    componentDidMount(){
        if(this.props.user){
            this.props.client.emitRegister({userid: this.props.user.id}, (err, rooms) => {
                const unread = rooms.reduce((sum, i) => sum + (i.message ? i.message.unread : 0), 0);
    
                this.setState({
                    messages: unread
                })
            });

            this.props.client.onMessage((err, m) => {
                this.setState({
                    messages: this.state.messages + 1
                })
            })
        }
    }

    navigate1() {
        if(localStorage.getItem('logged')!=="200"){
            history.push("/login");
        }
        else if(localStorage.getItem('logged')==="200"){
            history.push("/become-tutor");
        }
    }

    navigate() {
        history.push("/login");
    }

    render() {
        return (
            <div className="home">
                <nav className="navbar navbar-expand-lg navbar-dark bg-transparent w-100">
                    <div className="container">
                        <a className="navbar-brand" href="#">
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
                                {
                                    this.props.user && (
                                        <li className="nav-item">
                                            <a
                                                className="nav-link text-white"
                                                href="#"
                                                onClick={() => {
                                                    history.push('/chat')
                                                }}
                                            >
                                            <div style={{
                                                marginRight: '1rem',
                                                display: 'inline-block',
                                                position: 'relative'
                                            }}>
                                                Messages 
                                                <div className="position-absolute" style={{
                                                    top: -5,
                                                    right: -20
                                                }}>
                                                    <NotificationBadge count={this.state.messages} effect={Effect.SCALE} duration={100} />
                                                </div>
                                            </div>
                                            </a>
                                        </li>
                                    )
                                }
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

                            <li className="nav-item">
                                <a
                                    className="nav-link text-white"
                                    href="#"
                                    onClick={() => {
                                        if(!this.props.user){
                                            history.push('/login')
                                        }else{
                                            history.push('/profile')
                                        }
                                    }}
                                >Profile</a>
                            </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="home-hero">
                    <div>
                        <h1>We pair students with tutors on <u>your</u> campus</h1>
                        <h2>
                            Turon is the pioneer in college peer to peer tutoring
                        </h2>
                        <div className="text-center mt-5">
                            {
                                (this.props.user)
                                ? <button className="btn btn-secondary btn-lg" onClick={() => history.push('./find-tutor')}>Find Tutors</button>
                                : <button className="btn btn-secondary btn-lg" onClick={() => history.push('./login')}>Find Tutors</button>
                            }
                        </div>
                    </div>
                </div>

                <div className="home-find">
                    <h2>Find a tutor for <u>your</u> class</h2>

                    <div className="row">
                        <div className="col-md-4">
                            <img
                                src={require("../images/New_pin.JPG")}
                                alt="Location"
                            />
                            <h3>Nearby Tutors</h3>
                        </div>

                        <div className="col-md-4">
                            <img
                                src={require("../images/book.jpg")}
                                alt="book"
                            />
                            <h3>On-DemandIn person Tutoring</h3>
                        </div>

                        <div className="col-md-4">
                            <img
                                src={require("../images/New_piggy.JPG")}
                                alt="Piggy Bank"
                            />
                            <h3>Free & Affordable Options</h3>
                        </div>
                    </div>
                </div>

                <div className="home-footer">
                    <div className="row">
                        <div className="col-md-6">
                            <img
                                src={require("../images/Library.jpg")}
                                alt="Tutor"
                            />
                            <h3 className="mb-3">For students</h3>

                            <ul>
                                <li> Inexpensive alternatives to school/professional tutoring</li>
                                <li> Get tutored on your own time</li>
                                <li> Seamlessly find and book a tutor in minutes</li>
                                <li> Multilingual tutors</li>
                            </ul>
                        </div>
                        <div className="col-md-6">
                            <img
                                className="w-100"
                                src={require("../images/Tutor.jpg")}
                                alt="Tutor"
                            />
                            <h3>For tutors</h3>

                            <ul>
                                <li> Work on your own schedule</li>
                                <li> Locate clients like never before</li>
                                <li> No tedious certification process</li>
                                <li> No tedious certification process</li>
                            </ul>
                        </div>
                    </div>
                </div>



                {/* <div className="aContainer">
                    <div className="centeredTwo">
                        <h1 className="findATutor">
                            Find a tutor for <u>your</u> class
                        </h1>
                    </div>
                    <div className="aRow">
                        <img
                            src={require("../images/New_pin.JPG")}
                            alt="Location"
                            className="Location"
                            style={{ position: "absolute", width: "10%", height: "15%" }}
                        />
                        <img
                            src={require("../images/book.jpg")}
                            alt="book"
                            className="OnDemand"
                            style={{ position: "absolute", width: "10%", height: "15%" }}
                        />
                        <img
                            src={require("../images/New_piggy.JPG")}
                            className="fees"
                            alt="Piggy Bank"
                            style={{ position: "absolute", width: "10%", height: "15%" }}
                        />
                    </div>
                    <div className="aRow">
                        <h1 className="Nearby">Nearby Tutors</h1>
                        <h1 className="Learn">On-Demand</h1>
                        <h1 className="Learn2">In person Tutoring </h1>
                        <h1 className="FreeAnd">Free & Affordable Options</h1>
                    </div>
                </div>
                <div className="Footer-dummy" /> */}

                {/* <div className="aContainer">
                    <div className="theRow">
                        <img
                            src={require("../images/Library.jpg")}
                            alt="Tutor"
                            className="LibraryImg"
                            style={{ position: "absolute", width: "30%", height: "34%" }}
                        />
                        <img
                            src={require("../images/Tutor.jpg")}
                            alt="Tutor"
                            className="TutorImg"
                            style={{ position: "absolute", width: "30%", height: "34%" }}
                        />
                    </div>
                    <div className="theRow" />
                    <div className="theRow">
                        <h2 className="ForStuds">For Students</h2>
                        <h2 className="ForTutor">For Tutors</h2>

                        <div className="Students-points">
                            {this.state.students.map(row => {
                                return (
                                    <div>
                    <span>
                      <img
                          src={require("../images/arrow.jpg")}
                          style={{ width: "25px", height: "10px" }}
                      />
                      <a> </a>
                      <span key={row.subs}>{row.subs}</span>
                      <h1/>
                    </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="tutors-points">
                            {this.state.tutors.map(row => {
                                return (
                                    <div>
                    <span>
                      <img
                          src={require("../images/arrow.jpg")}
                          style={{ width: "25px", height: "10px" }}
                      />
                      <a> </a>
                      <span key={row.subs}>{row.subs}</span>
                      <h1 />
                    </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div> */}
            </div>
        );
    }
}
const mapStateToProps =(state)=> {
    console.log(state);

    return {
        user : state.isAuthenticated,
        client: state.socket
    };
}

const mapDispatchToProps =(dispatch)=> {
    return {
        logout : () => dispatch(actionLogOut()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);