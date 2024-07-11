import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import * as CgIcons from "react-icons/cg";
import * as AiIcons from "react-icons/ai";
import { Link } from 'react-router-dom';
import EvaluatorSidebar from '../../SidebarFiles/EvaluatorSidebar';
//updated
export class DownloadStatement extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
        this.downloadStmt = this.downloadStmt.bind(this);
    }

    componentDidMount() {
        this.downloadStmt();
    }


    downloadStmt() {

        fetch(BASEURL + "/usrmgmt/downloadstmt?stmtid=" + sessionStorage.getItem('stmtid') + "&loanreqno=" + sessionStorage.getItem('loanreqno'), {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
            },
            responseType: 'arraybuffer',
            dataType: 'blob'
        })
            .then(response => {
                return response.blob();
            })
            .then((response) => {
                console.log('Response:', response)
                var file = new Blob([(response)], { type: 'application/pdf' });
                console.log(file);
                var fileURL = URL.createObjectURL(file);
                console.log(fileURL);
                document.getElementsByClassName('PDFdoc')[0].src = fileURL + "#zoom=50";
            })
            .catch((error) => {
                console.log(error)
            })
    }

    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }

    render() {
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper">
                <EvaluatorSidebar />

                <div className="main-content bg-light" id="page-content-wrapper">
                    <div className="container-fluid row" >
                        <div className="col d-flex">
                            <button onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                            <div className="top">
                                <Link to="/evalCreditAppraisal">
                                    <a href="#" className="previous round mr-5">&laquo; Previous</a>
                                </Link>
                            </div>
                        </div>
                        <div className="col">
                            <h4 className="pl-4">Bank Statement</h4>
                        </div>
                        <div className="col"></div>
                    </div>

                    <hr />
                    <iframe src="" className="PDFdoc" type="application/pdf" style={{ overflow: "auto", height: "100vh", width: "100%" }}>
                    </iframe>
                </div>

            </div>
        )
    }
}

export default DownloadStatement;
