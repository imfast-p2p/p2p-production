import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from '../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa"; 


export class LoanPurposeGroup extends Component {

    constructor(props) {
        super(props)

        this.state = {
            lists: []
        }

    }


    componentDidMount() {
        this.getLoanPurposeGroup()
    }
    getLoanPurposeGroup = () => {
        fetch(BASEURL + '/lms/getloanpurposegroup', {
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
                    this.setState({lists:resdata.msgdata})
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }
    // createProductType=()=>{
    //     window.location="/createProductType"
    // }
    LoanPurposeGroupDetails=()=>{
        window.location="/createLoanPurpose"
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
                            <h4 className="d-flex justify-content-center" style={{color:"rgb(5, 54, 82)"}}>{t('Loan Purpose Group Details')}</h4>
                        </div>
                    </div>

                    <div className="tab-content h-100">
                        <div id="facilitators" className="register-form tab-pane fade show active">
                            <div className="card" style={{ cursor: 'default' }}>
                                <div className="card-header">
                                    <div className="row align-items-center" style={{color:"rgb(5, 54, 82)",fontWeight:"bold"}}>
                                        <div className="col-3">
                                            <p>{t('Loan Purpose Group')}</p>
                                        </div>
                                        <div className="col-3">
                                            <p>{t('Added By')}</p>
                                        </div>
                                        <div className="col-4">
                                            <p>{t('Loan Purpose Group Description')}</p>
                                        </div>
                                        <div className="col-2">
                                            <p>{t('Added On')}</p>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <button className='btn btn-sm float-right' 
                            style={{color:"white",backgroundColor:"rgb(40, 116, 166)"}} onClick={this.LoanPurposeGroupDetails}><FaPlus/>&nbsp;Create</button>
                            &nbsp;
                            <div className="">
                                {
                                    this.state.lists.map((list, index) => {
                                        return (
                                            <div key={index}>
                                                <div class="card" style={{ cursor: 'default',overflow:"visible"}}>
                                                    <div class="card-header">
                                                        <a className="">
                                                            <div class="row align-items-center" style={{color:"rgb(5, 54, 82)"}}>
                                                                <div class="col-3">
                                                                    <p>{list.loanpurgrp}</p>
                                                                </div>
                                                                <div class="col-3">
                                                                    <p>{list.addedby}</p>
                                                                </div>
                                                                <div class="col-4">
                                                                    <p>{list.loanpurgrpdesc}</p>
                                                                </div>
                                                                <div class="col-2">
                                                                    <span>{list.addedon}</span>
                                                                    &nbsp;
                                                                    <span class="dropup">
                                                                            <button type="button" style={{backgroundColor:"rgb(40, 116, 166)",color:"white"}}
                                                                             class="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                <span class="sr-only">Toggle Dropdown</span>
                                                                            </button>
                                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft:"-160px"}}>
                                                                                <a class="dropdown-item">Loan Purpose</a>
                                                                            </div>
                                                                        </span>
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
        )
    }
}

export default withTranslation()(LoanPurposeGroup)