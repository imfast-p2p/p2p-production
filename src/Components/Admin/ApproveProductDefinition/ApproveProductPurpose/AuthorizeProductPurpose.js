import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../../assets/baseURL';
import AdminSidebar from '../../AdminSidebar';
import { withTranslation } from 'react-i18next';
import { FaAngleLeft} from "react-icons/fa";
import dashboardIcon from '../../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';


export class AuthorizeProductPurpose extends Component {

    constructor(props) {
        super(props)

        this.state = {
            productid: sessionStorage.getItem('productID'),
            loanpurposeid: sessionStorage.getItem('LoanPurposeID'),
        }

    }
    // productid=(event)=>{
    //     this.setState({productid:event.target.value})
    // }
    // loanpurposeid=(event)=>{
    //     this.setState({loanpurposeid:event.target.value})
    // }

    authorizeProductpurpose = () => {
        fetch(BASEURL + '/lms/authorizeproductpurpose', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: this.state.productid,
                loanpurposeid: this.state.loanpurposeid,
            })
        }).then(response => {
            console.log(response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata)
                    alert(resdata.message)
                    window.location = "/productAttributes"
                } else {
                    alert("Issue: " + resdata.message);
                    window.location.reload();
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    cancelAuth = () => {
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{backgroundColor:"#f4f7fc"}}>
                <AdminSidebar />
                <div className="pl-3 pr-3 main-content " id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductAttrRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-9' id="ProductAttrRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link>/ <Link to="/productDefinitions">Product List</Link>/ <Link to="/productAttributes">Product Attribute </Link>/ Authorize product Purpose</p>
                        </div>

                        <div className="col" id="ProductAttrRes3">
                            <button style={myStyle}>
                                <Link to="/productAttributes" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)",marginTop:"0px" }} />
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold" }}>{t('Authorize product Purpose')}</p>
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
                                                    <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Product ID')} </p>
                                                    <input type="text"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)", borderRadius: "4px",
                                                            width: "377px", height: "35px", marginTop: "-10px", marginBottom: "10px", textTransform: 'uppercase'
                                                        }} value={this.state.productid} />
                                                </div>
                                                <div className="group">
                                                    <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Loan Purpose Id')} </p>
                                                    <input type="text"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)", borderRadius: "4px",
                                                            width: "377px", height: "35px", marginTop: "-10px", marginBottom: "10px"
                                                        }} value={this.state.loanpurposeid} />
                                                </div>

                                                <div className="group pt-2" style={{ textAlign: "end" }}>
                                                    <button className='btn btn-success' style={{ width: "100px" }} onClick={this.authorizeProductpurpose}>Submit</button> &nbsp;
                                                    <button className='btn btn-info' style={{ width: "100px" }} onClick={this.cancelAuth}>Cancel</button>
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

export default withTranslation()(AuthorizeProductPurpose)