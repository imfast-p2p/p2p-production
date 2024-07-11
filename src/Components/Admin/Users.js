import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Users extends Component {
    render() {
        return (

            <div className="container navItem">
                <h2>List Of Users</h2>
                <div className="bg-light p-5">
                    <input type="text" className="mr-3 w-75 pl-2 pb-2 pt-1" placeholder="Filter by name" />
                    <Link to="/createUser">
                        <button type="button" className="btn btn-primary"><span className="font-weight-bolder">&#43;</span> Create User</button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Users
