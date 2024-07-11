import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import * as HiIcons from "react-icons/hi";
import * as VscIcons from "react-icons/vsc";
import * as CgIcons from "react-icons/cg";
import * as BiIcons from "react-icons/bi";
import "./Sidebar.css";

class Sidebar extends Component {
    render() {
        return (
            <nav className="sidenav navbar navbar-vertical p-2 fixed-left  navbar-expand-xs navbar-light bg-dark d-block" id="sidebar-wrapper">
                {/* <div className="sidenav-header  align-items-center">
                    <a className="navbar-brand" href="#">
                        <img src="https://cctvcamerafactory.com/blog/wp-content/uploads/2014/11/P2P-Logo.png" className="navbar-brand-img" alt="..." />
                    </a>
                </div> */}
                <div className="navbar-inner">
                    <div className="menu navbar-collapseOnSelect" expand="lg" id="sidenav-collapse-main">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to="/borrowerdashboard">
                                    <a className="nav-link" href="#">
                                        <AiIcons.AiOutlineHome className="icon" />
                                        <p className="text pr-5">Dashboard</p>
                                    </a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/borrowerDetails">
                                    <a className="nav-link" href="#">
                                        <CgIcons.CgProfile className="icon" />
                                        <p className="text pr-5">Profile</p>
                                    </a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/loanRequest">
                                    <a className="nav-link" href="#">
                                        <RiIcons.RiChatNewFill className="icon" />
                                        <p className="text pr-5">Raise New Loan Request</p>
                                    </a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/viewAllLoanRequests">
                                    <a className="nav-link" href="#">
                                        <HiIcons.HiViewList className="icon" />
                                        <p className="text pr-5">View Loan Requests</p>
                                    </a>
                                </Link>
                            </li>
                            <li className="nav-item nav__menu-item1">
                                <Link to="/ViewAllLoans">
                                    <a className="nav-link" href="#">
                                        <RiIcons.RiMenuUnfoldFill className="icon" />
                                        <p className="text pr-5">View All Loans</p>
                                    </a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/borrowerTransactions">
                                    <a className="nav-link" href="#">
                                        <AiIcons.AiOutlineTransaction className="icon" />
                                        <p className="text pr-5">Borrower Transactions</p>
                                    </a>
                                </Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link to="/support">
                                    <a className="nav-link" href="#">
                                        <BiIcons.BiSupport className="icon" />
                                        <p className="text pr-5">Support</p>
                                    </a>
                                </Link>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Sidebar

class Submenu extends Component {
    render() {
        return (
            <ul className="nav__submenu">
                <li className="nav__submenu-item1">
                    <Link to="/viewActiveLoans">
                        <a href="#">
                            <VscIcons.VscVmActive className="icon" />
                            <p className="text">Active</p>
                        </a>
                    </Link>
                </li>
                <li className="nav__submenu-item1">
                    <Link to="/viewClosedLoans">
                        <a href="#">
                            <CgIcons.CgCloseR className="icon" />
                            <p className="text">Closed</p>
                        </a>
                    </Link>
                </li>
            </ul>
        )
    }
}