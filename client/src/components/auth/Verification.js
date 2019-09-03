import React, {Component} from 'react';

class Verification extends Component {

    render(){
        return(
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 mx-auto verification-page">
                        <div className="bg-gray2 mt-5 p-4 rounded">
                            <p className="text-success">Thank you! You have been successfully verified.</p>
                            <a className="btn btn-primary btn-register px-4 mx-auto d-table" href="/login">Login</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Verification;
