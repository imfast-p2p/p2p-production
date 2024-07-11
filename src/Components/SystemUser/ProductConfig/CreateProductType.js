import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from '../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";


export class CreateProductType extends Component {

    constructor(props) {
        super(props)

        this.state = {
            prodtype: "",
            prodtypename: "",
            prodtypedesc: "",
        }

    }
    componentDidMount() {
    }
    
    prodtypename = (event) => {
        this.setState({ prodtypename: event.target.value.toLocaleUpperCase() })
    }
    prodtype = (event) => {
        this.setState({ prodtype: event.target.value})
    }
    prodtypedesc = (event) => {
        this.setState({ prodtypedesc: event.target.value })
    }

    setproductType = () => {
        fetch(BASEURL + '/lms/setproducttype', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                prodtype: this.state.prodtype,
                prodtypename: this.state.prodtypename,
                prodtypedesc: this.state.prodtypedesc
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
                    window.location="/productCreation";
                } else {
                    alert("Issue: " + resdata.message);
                    window.location.reload();
                }
            })
            .catch(err=>{
                console.log(err.message)
            })
    }

    cancelSetPType = () => {
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
                <div className="pl-3 pr-3 main-content " id="page-content-wrapper">
                    <div className="container-fluid">
                        <button onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>

                        <div className="col ">
                            <h4 className="d-flex justify-content-center" style={{ color: "rgb(5, 54, 82)" }}>{t('Create Product Type')}</h4>
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
                                                    <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Product Name')} </p>
                                                    <input type="text"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)", borderRadius: "4px",
                                                            width: "377px", height: "35px", marginTop: "-10px", marginBottom: "10px",textTransform: 'uppercase' 
                                                        }} placeholder={t('Product Name')} onChange={this.prodtypename} />
                                                </div>
                                                <div className="group">
                                                    <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Product Type')} </p>
                                                    <input type="text"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)", borderRadius: "4px",
                                                            width: "377px", height: "35px", marginTop: "-10px", marginBottom: "10px"
                                                        }} placeholder={t('Product Type')} onChange={this.prodtype} />
                                                </div>

                                                <div className="group">
                                                    <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Product Description')} </p>
                                                    <textarea type="text"
                                                        onChange={this.prodtypedesc} className="input" placeholder={t('Product Description')}
                                                        rows={4}
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)", borderRadius: "4px",
                                                            width: "377px", marginTop: "-10px", marginBottom: "10px"
                                                        }}></textarea>

                                                </div>

                                                <div className="group pt-2" style={{ textAlign: "end" }}>
                                                    <button className='btn btn-success' style={{ width: "100px" }} onClick={this.setproductType}>Submit</button> &nbsp;
                                                    <button className='btn btn-info' style={{ width: "100px" }} onClick={this.cancelSetPType}>Cancel</button>
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

export default withTranslation()(CreateProductType)