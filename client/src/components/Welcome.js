import React, {Component} from 'react';
import {connect} from "react-redux";

class Welcome extends Component {


    render(){
     console.log(this.props)
        return(
            <div className="row justify-content-md-center">


            </div>

        )
    }
}

const mapStateToProps =(stores)=> {

    return {
        email : stores.reducer.stores.email,
        username: stores.reducer.stores.username,
    };
}
export default connect(mapStateToProps)(Welcome);

//export default withRouter(Welcome);