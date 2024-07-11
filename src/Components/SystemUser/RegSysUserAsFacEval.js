import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import SystemUserSidebar from './SystemUserSidebar';
import { withTranslation } from 'react-i18next';

export class RegSysUserAsFacEval extends Component {

    constructor(props) {
        super(props)

        this.state = {
            regsysuserid: sessionStorage.getItem('userID'),
            regasutype: ""
        }

        this.regAsFacEvl = this.regAsFacEvl.bind(this);
        this.regasutype = this.regasutype.bind(this);

    }

    regasutype(event) {
        this.setState({ regasutype: event.target.value })
        console.log(event.target.value);
    }

    regAsFacEvl(event) {


        fetch(BASEURL + '/lsp/regsysuserasfaceval', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                regsysuserid: sessionStorage.getItem('userID'),
                regasutype: parseInt(this.state.regasutype)
            })
        }).then((Response) => {

            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    alert(resdata.message)
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    componentDidMount() {
        console.log(sessionStorage.getItem('token'));
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
                    <div className="container-fluid row" >
                        <div className="col-3">
                            <button onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className="col-6">
                            <h4 className="pl-4">{t('RegisterAsFacilitator/Evaluator')}</h4>
                        </div>
                        <div className="col-3"></div>
                    </div>

                    <hr />
                    <div className='row'>
                        <div className="col"></div>
                        <div className="col">
                            <div className="group" style={{ marginBottom: '17px' }}>
                                <label htmlFor="user" style={{ marginBottom: '0px' }} className="label">{t('UserType')}</label>
                                <select id="inputState" className="form-control" onChange={this.regasutype}>
                                    <option defaultValue>{t('--Select user type--')}</option>
                                    <option value="4">{t('Facilitator')}</option>
                                    <option value="5">{t('Evaluator')}</option>
                                </select>
                            </div>
                            <div className="group">
                                <button onClick={this.regAsFacEvl} type="submit" className="btn btn-primary">{t('Submit')}</button>
                            </div>
                        </div>
                        <div className="col"></div>
                    </div>

                </div>
            </div>
        )
    }
}

export default withTranslation()(RegSysUserAsFacEval)