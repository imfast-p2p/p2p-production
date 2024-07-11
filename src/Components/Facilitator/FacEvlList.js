import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import * as CgIcons from "react-icons/cg";
import * as AiIcons from "react-icons/ai";
import * as HiIcons from "react-icons/hi";
import { BASEURL } from '../assets/baseURL';
import User from '../assets/User.png';
import Name from '../assets/Name.png';
import * as VscIcons from "react-icons/vsc";
import * as GrIcons from "react-icons/gr";
//updated
export class FacEvlList extends Component {

    constructor(props) {
        super(props)

        this.state = {

            facList: [],
            evalList: []
        }

        this.getFacilitators = this.getFacilitators.bind(this);
        this.getEvaluators = this.getEvaluators.bind(this);
    }


    componentDidMount() {

        this.getFacilitators();
        this.getEvaluators();
    }

    getFacilitators() {
        fetch(BASEURL + '/usrmgmt/getfacevallist?utype=4', {
            method: 'get',
            headers: {

                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('Response:', response)
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    this.setState({ facList: resdata.msgdata })
                } else {
                    if (resdata.code === '0102') {
                        confirmAlert({
                            message: resdata.message + ", please login again to continue.",
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                        window.location = '/login';
                                        sessionStorage.removeItem('status')
                                        sessionStorage.clear();
                                        sessionStorage.clear();
                                    },
                                },
                            ],
                            closeOnClickOutside: false,
                        });
                    } else {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                    },
                                },
                            ],
                        });
                    }
                }
            })
    }

    getEvaluators() {
        fetch(BASEURL + '/usrmgmt/getfacevallist?utype=5', {
            method: 'get',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('Response:', response)
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    this.setState({ evalList: resdata.msgdata })
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }


    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    render() {
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{marginTop:"-7px"}}>
                <nav className="sidenav navbar navbar-vertical p-2 fixed-left  navbar-expand-xs navbar-light bg-dark d-block" id="sidebar-wrapper">

                    <div className="navbar-inner-admin">
                        <div className="menu navbar-collapseOnSelect" expand="lg" id="sidenav-collapse-main">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link to="/sysUserDashboard">
                                        <a className="nav-link" href="#">
                                            <AiIcons.AiOutlineHome className="icon" />
                                            <p className="text pr-5">Dashboard</p>
                                        </a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/sysUserRefDetails">
                                        <a className="nav-link" href="#">
                                            <VscIcons.VscReferences className="icon" />
                                            <p className="text pr-5">Reference Details</p>
                                        </a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/facEvlList">
                                        <a className="nav-link" href="#">
                                            <HiIcons.HiViewList className="icon" />
                                            <p className="text pr-5">Facilitator/Evaluator List</p>
                                        </a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/regSysUserAsFacEval">
                                        <a className="nav-link" href="#">
                                            <CgIcons.CgProfile className="icon" />
                                            <p className="text pr-5">Register As Facilitator/Evaluator</p>
                                        </a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/suspenceTransaction">
                                        <a className="nav-link" href="#">
                                            <AiIcons.AiOutlineTransaction className="icon" />
                                            <p className="text pr-5">Suspense Transaction</p>
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="pl-3 pr-3 main-content bg-light" id="page-content-wrapper">
                    <div className="container-fluid">
                        <button onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        <div className="h-100 p-4">
                            <ul role="tablist" className="nav bg-light nav-pills nav-fill mb-3">
                                <li className="nav-item"> <a data-toggle="pill" href="#facilitators" className="nav-link border active">Facilitators</a> </li>
                                <li className="nav-item"> <a data-toggle="pill" href="#evaluators" className="nav-link border">Evaluators</a> </li>
                            </ul>
                        </div>
                        <div className="tab-content h-100">

                            <div id="facilitators" className="register-form tab-pane fade show active">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <h6><span><img className='iconimg' src={User} /> </span>User Id</h6>
                                            </div>
                                            <div className="col">
                                                <h6><span><img className='iconimg' src={Name} /> </span>User Name</h6>
                                            </div>
                                            <div className="col">
                                                <h6><span><img className='iconimg' src={Name} /> </span>User Type</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    {
                                        this.state.facList.map((user, index) => {
                                            return (
                                                <div key={index}>
                                                    <div class="card">
                                                        <div class="card-header">
                                                            <a className="text-primary">
                                                                <div class="row align-items-center">
                                                                    <div class="col">
                                                                        <p>{user.userid}</p>
                                                                    </div>
                                                                    <div class="col">
                                                                        <p>{user.username}</p>
                                                                    </div>
                                                                    <div class="col">
                                                                        <p className="ml-5">{user.usertype}</p>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                            <div id="evaluators" className="register-form tab-pane fade">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <h6><span><img className='iconimg' src={User} /> </span>User Id</h6>
                                            </div>
                                            <div className="col">
                                                <h6><span><img className='iconimg' src={Name} /> </span>User Name</h6>
                                            </div>
                                            <div className="col">
                                                <h6><span><img className='iconimg' src={Name} /> </span>User Type</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    {
                                        this.state.evalList.map((user, index) => {
                                            return (
                                                <div key={index}>
                                                    <div class="card">
                                                        <div class="card-header">
                                                            <a className="text-primary">
                                                                <div class="row align-items-center" >
                                                                    <div class="col">
                                                                        <p>{user.userid}</p>
                                                                    </div>
                                                                    <div class="col">
                                                                        <p>{user.username}</p>
                                                                    </div>
                                                                    <div class="col">
                                                                        <p className="ml-5">{user.usertype}</p>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default FacEvlList