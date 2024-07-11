import React, { Component } from 'react'

class Organization extends Component {

    render() {
        return (
            <div className="container navItem">
                <h2>Organization</h2>
                <div className="row">
                    <div className="col-sm-6 col-md-6">
                        <div className="list-group">
                            <a className="list-group-item" href="#">
                                <h5 className="list-group-item-heading">Manage Offices</h5>
                                <p className="list-group-item-text">Add new office or modify or deactivate office or modify office hierarchy</p>
                            </a>
                            <a className="list-group-item" href="#">
                                <h5 className="list-group-item-heading">Manage Holidays</h5>
                                <p className="list-group-item-text">Define holidays for office</p>
                            </a>
                            <a className="list-group-item" href="#">
                                <h5 className="list-group-item-heading">Manage Employees</h5>
                                <p className="list-group-item-text">A employee represents loan officers with no access to systems</p>
                            </a>
                            <a className="list-group-item" href="#">
                                <h5 className="list-group-item-heading">Standing Instructions History</h5>
                                <p className="list-group-item-text">View logged history of standing instructions</p>
                            </a>
                            <a className="list-group-item" href="#">
                                <h5 className="list-group-item-heading">Fund Mapping</h5>
                                <p className="list-group-item-text">Bulk entry screen for mapping fund sources to loans</p>
                            </a>
                            <a className="list-group-item" href="#">
                                <h5 className="list-group-item-heading">Password Preferences</h5>
                                <p className="list-group-item-text">Define standards for enforcing the usage of stronger passwords</p>
                            </a>
                            <a className="list-group-item" href="#">
                                <h5 className="list-group-item-heading">Loan Provisioning Criteria</h5>
                                <p className="list-group-item-text">Define Loan Provisioning Criteria for Organization</p>
                            </a>
                            <a className="list-group-item" href="#">
                                <h5 className="list-group-item-heading">Entity Data Table Checks</h5>
                                <p className="list-group-item-text">Define Entity Data Table Checks for Organization</p>
                            </a>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-6">

                    </div>
                </div>
            </div>
        )
    }
}

export default Organization
