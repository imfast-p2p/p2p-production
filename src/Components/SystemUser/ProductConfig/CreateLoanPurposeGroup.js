import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from '../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";


export class CreateLoanPurposeGroup extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loanpurposegroup: "",
            loanpurposegrpdesc: "",
            attributeid: "",
            loansize: "" //Optional
        }

    }
    loanpurposegroup = (event) => {
        this.setState({ loanpurposegroup: event.target.value.toLocaleUpperCase() })
    }
    loanpurposegrpdesc = (event) => {
        this.setState({ loanpurposegrpdesc: event.target.value })

    }
    attributeid = (event) => {
        this.setState({ attributeid: event.target.value.toLocaleUpperCase() })

    }
    loansize = (event) => {
        this.setState({ loansize: event.target.value.toLocaleUpperCase() })

    }

    setLoanPurposeGroup = () => {
        fetch(BASEURL + '/lms/setloanpurposegroup', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanpurposegroup: this.state.loanpurposegroup,
                loanpurposegrpdesc: this.state.loanpurposegrpdesc,
                attributeid: this.state.attributeid,
                loansize: this.state.loansize,
            })
        }).then(response => {
            console.log(response)
            return response.json();
        })
            .then(resdata => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata.msgdata)
                    alert(resdata.message);
                    window.location = "/productCreation";
                } else {
                    alert("Issue: " + resdata.message);
                    window.location.reload();
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    cancelLoanPurposeGroup = () => {
        window.location.reload();
    }

    handleChange() {
        $('.text').toggle();
    }
    render() {
        const { t } = this.props
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper">
                <SystemUserSidebar />
                <div className="pl-3 pr-3 main-content bg-light" id="page-content-wrapper">
                    <div className="container-fluid">
                        <button onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>

                        <div className="col ">
                            <h4 className="d-flex justify-content-center" style={{ color: "rgb(5, 54, 82)" }}>{t('Create Loan Purpose Group')}</h4>
                        </div>
                    </div>

                    <div className="tab-content h-100">
                        <div className="register-form tab-pane fade show active">
                            <div className='' style={{ marginLeft: "15%" }}>
                                <div className="card" style={{ cursor: 'default', width: "50%" }}>
                                    <div className="card-header border-0">
                                        <div className='form-group'>
                                            <div className="row item-list align-items-center">

                                                <div className="group">
                                                    <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Loan Purpose Group')} </p>
                                                    <input type="text"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)", borderRadius: "4px",
                                                            width: "377px", height: "35px", marginTop: "-10px", marginBottom: "10px", textTransform: 'uppercase'
                                                        }} placeholder={t('Loan Purpose Group')} onChange={this.loanpurposegroup} />
                                                </div>

                                                <div className="group">
                                                    <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Loan Purpose Group Description')} </p>
                                                    <input type="text"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)", borderRadius: "4px",
                                                            width: "377px", height: "35px", marginTop: "-10px", marginBottom: "10px"
                                                        }} placeholder={t('Loan Purpose Group Description')} onChange={this.loanpurposegrpdesc} />
                                                </div>

                                                <div className="group">
                                                    <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Attribute ID')} </p>
                                                    <input type="text"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)", borderRadius: "4px",
                                                            width: "377px", height: "35px", marginTop: "-10px", marginBottom: "10px", textTransform: 'uppercase'
                                                        }} placeholder={t('Attribute ID')} onChange={this.attributeid} />
                                                </div>

                                                <div className="group">
                                                    <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Loan Size')} </p>
                                                    <input type="text"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)", borderRadius: "4px",
                                                            width: "377px", height: "35px", marginTop: "-10px", marginBottom: "10px", textTransform: 'uppercase'
                                                        }} placeholder={t('Loan Size(Optional)')} onChange={this.loansize} />
                                                </div>

                                                <div className="group pt-2" style={{ textAlign: "end" }}>
                                                    <button className='btn btn-success' style={{ width: "100px" }} onClick={this.setLoanPurposeGroup}>Submit</button> &nbsp;
                                                    <button className='btn btn-info' style={{ width: "100px" }} onClick={this.cancelLoanPurposeGroup}>Cancel</button>
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

export default withTranslation()(CreateLoanPurposeGroup)