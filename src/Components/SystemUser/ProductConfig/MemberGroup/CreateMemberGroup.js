import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../../assets/baseURL';
import SystemUserSidebar from '../../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaThumbsUp, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit } from "react-icons/fa";
import dashboardIcon from '../../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';

export class CreateMemberGroup extends Component {

    constructor(props) {
        super(props)

        this.state = {
            membergrp: "",
            membergrpdesc: "",
            membergrpcategory: "",
            vneed: "",
            vtype: "",
        }

    }


    componentDidMount(event) {

    }
    membergrp = (event) => {
        this.setState({membergrp:event.target.value.toLocaleUpperCase()})
    }
    membergrpdesc = (event) => {
        this.setState({membergrpdesc:event.target.value})
    }
    membergrpcategory = (event) => {
        this.setState({membergrpcategory:event.target.value})
    }
    vneed = (event) => {
        this.setState({vneed:event.target.value})
    }
    vtype = (event) => {
        this.setState({vtype:event.target.value})
    }
    setMemberGroup = () => {
        fetch(BASEURL + '/lms/setmembergroup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                membergrp: this.state.membergrp,
                membergrpdesc: this.state.membergrpdesc,
                membergrpcategory: this.state.membergrpcategory,
                vneed: this.state.vneed,
                vtype: this.state.vtype
            })
        }).then(response => {
                console.log(response)
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata.msgdata)
                    alert(resdata.message)
                    window.location="/productCreation"
                } else {
                    alert("Issue: " + resdata.message);
                    window.location.reload();
                }
            })
            .catch(err=>{
                console.log(err.message)
            })
    }
    cancelSetMembergroup = () => {
        window.location.reload();
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
                                <Link to="/sysUserDashboard">Home</Link> / Create Member Group</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="">
                            <button style={myStyle}>
                                <Link to="/sysUserDashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold" }}>{t('Create Member Group')}</p>
                        </div>
                    </div>

                    <div className="tab-content">
                        <div className="register-form tab-pane fade show active">
                            <div className='' style={{ marginLeft: "15%" }}>
                                <div className="card" style={{ cursor: 'default', width: "50%" }}>
                                    <div className="card-header border-0">
                                        <div className='form-group'>
                                            <div className="row item-list align-items-center">

                                                <div className="group">
                                                    <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Member Group')} </p>
                                                    <input type="text"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)", borderRadius: "4px",
                                                            width: "377px", height: "35px", marginTop: "-10px", marginBottom: "10px",textTransform: 'uppercase' 
                                                        }} placeholder={t('Member Group')} onChange={this.membergrp} />
                                                </div>
                                                <div className="group">
                                                    <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Group Description')} </p>
                                                    <textarea type="text"
                                                        onChange={this.membergrpdesc} className="input" placeholder={t('Group Description')}
                                                        rows={4}
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)", borderRadius: "4px",
                                                            width: "377px", marginTop: "-10px", marginBottom: "10px"
                                                        }} ></textarea>
                                                </div>

                                                <div className="group">
                                                    <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Group Category')} </p>
                                                    <input type="text"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)", borderRadius: "4px",
                                                            width: "377px", height: "35px", marginTop: "-10px", marginBottom: "10px"
                                                        }} placeholder={t('Group Category')} onChange={this.membergrpcategory} />
                                                </div>
                                                <div className="group">
                                                    <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Verficication Needed')} </p>
                                                    <select className="form-select border border-secondary" onChange={this.vneed} style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }} >
                                                        <option defaultValue>------------------Select------------------</option>
                                                        <option value="1">Yes</option>
                                                        <option value="0">No</option>
                                                    </select>

                                                </div>
                                                <div className="group">
                                                    <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Verification Type')} </p>
                                                    <input type="text"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)", borderRadius: "4px",
                                                            width: "377px", height: "35px", marginTop: "-10px", marginBottom: "10px"
                                                        }} placeholder={t('Verification Type')} onChange={this.vtype} />
                                                </div>


                                                <div className="group pt-2" style={{ textAlign: "end" }}>
                                                    <button className='btn btn-success' style={{ width: "100px" }} onClick={this.setMemberGroup}>Submit</button> &nbsp;
                                                    <button className='btn btn-info' style={{ width: "100px" }} onClick={this.cancelSetMembergroup}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                </div >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation()(CreateMemberGroup)