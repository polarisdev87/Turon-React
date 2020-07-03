import React, {Component} from 'react';
import {Route,Router, Switch} from 'react-router-dom';
import Login from "./Login";
import Signup from "./Signup";
import ViewTutor from "./ViewTutor";
import FindTutor from "./FindTutor";
import Home from "./Home";
import history from "./../services/history";
import PartialUpdate from './PartialUpdate';
import { LinkedInPopUp } from 'react-linkedin-login-oauth2';
import Layout from './Layout';
import Chat from './Chat/Chat';
import BecomeTutor from './BecomeTutor';
import Profile from './Profile';

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => (
      <Layout {...props}>
        <Component {...props} />
      </Layout>
    )} />
)

class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route path='/linkedin_redirect' component={LinkedInPopUp} />
                    <Route  path='/login' component={Login}/>
                    <Route  path='/signup' component={Signup}/>
                    <Route  path='/finish-registration' component={PartialUpdate}/>
                    <AppRoute exact path='/find-tutor' component={FindTutor} layout={Layout} />
                    <AppRoute exact path='/profile' component={Profile} layout={Layout} />
                    <AppRoute exact path='/view-tutor/:pid' component={ViewTutor} layout={Layout} />
                    <AppRoute exact path='/chat' component={Chat} layout={Layout} />
                    <AppRoute exact path='/become-tutor' component={BecomeTutor} layout={Layout} />

                    {/* <Route  path='/FindTutor' component={FindTutor}/>
                    <Route  path='/welcome' component={Welcome}/>
                    <Route  path='/ViewTutor' component={ViewTutor}/> */}
                </Switch>
            </Router>
        );
    }
}
export default Routes;