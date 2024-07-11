import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../../assets/baseURL';
import SystemUserSidebar from '../../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaThumbsUp, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit } from "react-icons/fa";
import dashboardIcon from '../../../assets/icon_dashboard.png';
import {Link} from 'react-router-dom';

export class MemberGroup extends Component {

    constructor(props) {
        super(props)

        this.state = {
            memberGroupLists: [],
        }

    }


    componentDidMount() {
        this.getMemberGroup();
    }
    getMemberGroup = () => {
        fetch(BASEURL + '/lms/getmembergroup', {
            method: 'GET',
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
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata.msgdata)
                    this.setState({ memberGroupLists: resdata.msgdata })
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }
    createMembergroup = () => {
        window.location = "/createMembergroup"
    }

    handleChange() {
        $('.text').toggle();
    }
    render() {
        const { t } = this.props
        const myStyle = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            margin: "4px 2px",
            cursor: "pointer",
            fontSize: "12px",
            // height: "25px",
            width: "65px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            marginLeft: "14px"
        }
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper">
                <SystemUserSidebar />
                <div className="pl-3 pr-3 main-content bg-light" id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1" id="">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / Member Group</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="">
                            <button style={myStyle}>
                                <Link to="" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold" }}>{t('Member Group Details')}</p>
                        </div>
                    </div>

                    <div className="tab-content">
                        <div className="register-form tab-pane fade show active">
                            <div className="card" style={{ cursor: 'default' }}>
                                <div className="card-header">
                                    <div className="row align-items-center" style={{ color: "rgb(5, 54, 82)", fontWeight: "bold" }}>
                                        <div className="col-3">
                                            <p>{t('Member Group ID')}</p>
                                        </div>
                                        <div className="col-2">
                                            <p>{t('Verification Type')}</p>
                                        </div>
                                        <div className="col-2">
                                            <p>{t('Added By')}</p>
                                        </div>
                                        <div className="col-3">
                                            <p>{t('Member Group Description')}</p>
                                        </div>
                                        <div className="col-2">
                                            <p>{t('Added On')}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <button className='btn btn-sm float-right'
                                style={{ color: "white", backgroundColor: "rgb(40, 116, 166)" }} onClick={this.createMembergroup}><FaPlus />&nbsp;Create</button>
                            &nbsp;
                            <div className="">
                                {
                                    this.state.memberGroupLists.map((list, index) => {
                                        return (
                                            <div key={index}>
                                                {list.membergrpcategoryinfo.map((memberlists,subindex)=>{
                                                    return(
                                                        <div class="card" style={{ cursor: 'default', overflow: "visible" }}>
                                                        <div class="card-header">
                                                            <a className="">
                                                                <div class="row align-items-center" style={{ color: "rgb(5, 54, 82)" }}>
                                                                    <div class="col-3">
                                                                        <p>{memberlists.membergrpid}</p>
                                                                    </div>
                                                                    <div class="col-2">
                                                                        <p>{memberlists.verificationtype}</p>
                                                                    </div>
                                                                    <div class="col-2">
                                                                        <p>{memberlists.addedby}</p>
                                                                    </div>
                                                                    <div class="col-3">
                                                                        <p>{memberlists.membergrpdesc}</p>
                                                                    </div>
                                                                    <div class="col-2">
                                                                        <span>{memberlists.addedon}</span>
                                                                        &nbsp;
                                                                        <span class="dropup">
                                                                            <button type="button" style={{ backgroundColor: "rgb(40, 116, 166)", color: "white" }}
                                                                                class="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                <span class="sr-only">Toggle Dropdown</span>
                                                                            </button>
                                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                <a class="dropdown-item"></a>
                                                                            </div>
                                                                        </span>
                                                                    </div>
    
                                                                </div>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    )
                                                })}
                                               
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation()(MemberGroup)