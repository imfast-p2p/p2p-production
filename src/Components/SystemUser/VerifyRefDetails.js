import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import SystemUserSidebar from './SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export class VerifyRefDetails extends Component {

    constructor(props) {
        super(props)


        this.state = {
            reqid:"",
            refmobile:"",
            rcdone:"",
            rcresult:"",
            refcomment:""
        }
       
    }
    rcdone=(event)=>{
        this.setState({rcdone:event.target.value})
    }
    rcresult=(event)=>{
        this.setState({rcresult:event.target.value})
    }
    refcomment=(event)=>{
        this.setState({refcomment:event.target.value})
    }

    componentDidMount() {
        sessionStorage.getItem("refMobile")
        sessionStorage.getItem("reqID")
    }
    verifyReferences=(event)=> {
        fetch(BASEURL + '/lsp/verifyreferencedetails', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                reqid:sessionStorage.getItem("reqID"),
                refmobile:sessionStorage.getItem("refMobile"),
                rcdone:this.state.rcdone,
                rcresult:this.state.rcresult,
                refcomment:this.state.refcomment
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    alert(resdata.message)
                    window.location="/sysUserRefDetails"
                }
                else {
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
        const { t } = this.props
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper">
                <SystemUserSidebar />
                <div className="main-content bg-light" id="page-content-wrapper">
                    <div className="container-fluid row mt-4" >
                        <div className="col">
                            <button onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className="col">
                            <h4 className="pl-4">{t(' Verify Reference Details')}</h4>
                        </div>
                        <div className="col"></div>
                    </div>
                    <div className="ml-3">
                        <Link to="/sysUserRefDetails">
                            <button type="button" class="btn btn-primary btn-md" style={{borderRadius:"30px"}}>&laquo; Previous</button>
                        </Link>
                    </div>
                    <hr />
                    <div className='' style={{marginLeft:"15%"}}>
                        <div className="card" style={{ cursor: 'default',width:"50%" }}>
                            <div className="card-header border-0">
                                <div className='form-group'>
                                    <div className="row item-list align-items-center">
                                        <div className="group">
                                            <label htmlFor="status" className="label">{t('Reference Check Done')}: </label>
                                            <select className="form-select border border-dark h-50 w-100" onChange={this.rcdone} style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}>
                                                <option defaultValue>{t('--Select--')}</option>
                                                <option value="0">{t('Negative Feedback from Reference')}</option>
                                                <option value="1">{t('Positive Feedback from Reference')}</option>
                                            </select>
                                        </div>
                                        <div className="group">
                                            <label htmlFor="s" className="label">{t('Reference Check Result')}: </label>
                                            <select className="form-select border border-dark h-50 w-100" onChange={this.rcresult} style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}>
                                                <option defaultValue>{t('--Select--')}</option>
                                                <option value="0">{t('Not Contacted the Reference')}</option>
                                                <option value="1">{t('Contacted the Reference')}</option>
                                            </select>
                                        </div>
                                        
                                        <div className="group pt-2">
                                            <label htmlFor="desc">Reference Comment</label>
                                            <textarea id="user" type="text" onChange={this.refcomment} className="input" placeholder="Reference Comment" ></textarea>
                                        </div>
                                        <div className="group pt-2" style={{textAlign:"end"}}>
                                            <button className='btn btn-info' style={{width:"100px"}} onClick={this.verifyReferences}>Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div >
                        </div >
                    </div>

                </div>
            </div>
        )
    }
}

export default withTranslation()(VerifyRefDetails)