import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from '../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa"; 


export class ProductConfiguration extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }

    }


    componentDidMount() {
       
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
                            <h4 className="d-flex justify-content-center" style={{color:"rgb(5, 54, 82)"}}>{t('')}</h4>
                        </div>
                    </div>

                    
                </div>
            </div>
        )
    }
}

export default withTranslation()(ProductConfiguration)