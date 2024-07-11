import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { confirmAlert } from "react-confirm-alert";
import { withTranslation } from 'react-i18next';
import { BASEURL } from '../assets/baseURL';
import $ from 'jquery';

export class OfflineKyc extends Component {
    constructor() {
        super();
        this.state = {
            mobileno: "",
            utype: "",
            passcode: "",
            kycmode: "3",
            reId: "",

            invalidMnum:false
        }
    }
    componentDidMount(){
        $('#oFkycSubmitBtn').prop('disabled', true)
    }
    utype = (event) => {
        if (event.target.value == "Lender") {
            this.setState({ utype: "2" })
        } else if (event.target.value == "Borrower") {
            this.setState({ utype: "3" })
        } else if (event.target.value == "Facilitator") {
            this.setState({ utype: "4" })
        } else if (event.target.value == "Evaluator") {
            this.setState({ utype: "5" })
        }
    }
    mobilenumber = (event) => {
        var mobileValid=/^[6-9][0-9]{9}$/;
        var eventmInput = event.target.value;
        if (mobileValid.test(eventmInput)) {
            console.log("passed")
            this.setState({invalidMnum:false})
            $('#oFkycSubmitBtn').prop('disabled', false)
            this.setState({ mobileno: event.target.value })
        } else {
            this.setState({invalidMnum:true})
            $('#oFkycSubmitBtn').prop('disabled', true)
        }
        
    }
    passcode = (event) => {
        this.setState({ passcode: event.target.value })
    }

    uploadAadhar = () => {
        const zipformData = new FormData()
        var zipfileField = document.querySelector("input[type='file']");

        var bodyData = JSON.stringify({
            mobileno: this.state.mobileno,
            utype: this.state.utype,
            passcode: this.state.passcode,
            kycmode: this.state.kycmode
        })
        zipformData.append("file", zipfileField.files[0]);
        zipformData.append("info", bodyData);

        fetch(BASEURL + '/verification/offlinekyc/kycverification', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                // 'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: zipformData
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata)
                    this.setState({ reId: resdata.msgdata.referenceid })
                    sessionStorage.setItem("referenceID", resdata.msgdata.referenceid);
                    //alert(resdata.message);
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    let data1 = {
                                        mobile: this.state.mobileno,
                                        usertype: this.state.utype
                                    }
                                    this.props.history.push({
                                        pathname: '/manualRegistration',
                                        frompath: 'aadhaarXml',
                                        state: {
                                            aadhaarXml: data1
                                        }
                                    })
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });

                } else {
                    alert(resdata.message + " " + "Please try with other methods.");
                }
            }).catch(error => console.log(error)
            );

    }
    cancelUpload = () => {
        window.location.reload();
    }

    render() {
        const { t } = this.props
        return (
            <div style={{ paddingLeft: "28%", paddingRight: "28%", paddingTop: "5px" }}>
                <div className="container">
                    <div className="row d-flex justify-content-center" >
                        <div className="col-md-12 ">
                            <div className="card" style={{ width: "100%", cursor: "default", boxShadow: "5px 10px 18px #888888" }}>
                                <div className="credentials" style={{ padding: "10px 50px" }}>
                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingTop: "15px", }}>
                                        <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
                                        <div>
                                            <h4 className="heading1" style={{ color: "#00264d" }}>
                                                Offline KYC
                                            </h4>
                                        </div>
                                        <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
                                    </div>

                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center", paddingTop: "10px" }}>
                                            <label style={{ fontWeight: "bold", color: "#00264d" }}>
                                                Register As
                                            </label>{" "}
                                            &nbsp;
                                            <select className="sel" onChange={this.utype}
                                                style={{
                                                    height: "40px",
                                                    borderRadius: "5px",
                                                    borderWidth: "2px",
                                                    backgroundColor: "whitesmoke"

                                                }}
                                            >
                                                <option defaultValue="" style={{ textAlign: "center" }}>
                                                    --Select--
                                                </option>
                                                <option value="Lender">Lender</option>
                                                <option value="Borrower">Borrower</option>
                                                <option value="Facilitator">Facilitator</option>
                                                <option value="Evaluator">Evaluator</option>

                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-2">
                                        <div className="col">
                                            <label className="u1" style={{ color: "#00264d", fontWeight: "bold", fontSize: "18px", }}>
                                                Upload File
                                            </label>
                                            <div>
                                                <input type="file" id="zipfilesData" accept='.zip'
                                                    className="border text-dark" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col">
                                            <label className="u1" style={{ color: "#00264d", fontWeight: "bold", fontSize: "18px", }}>
                                                Passcode
                                            </label>
                                            <div>
                                                <input type="password" className="input" id="passcode"
                                                    onChange={this.passcode} autoComplete="off"
                                                    style={{
                                                        height: "40px",
                                                        borderRadius: "5px",
                                                        backgroundColor: "whitesmoke"
                                                    }}
                                                    placeholder="Enter Passcode"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col">
                                            <label className="u1" style={{ color: "#00264d", fontWeight: "bold", fontSize: "18px", }}>
                                                Mobile Number
                                            </label>
                                            <div>
                                                <input type="number" className="input" id="mobilenum"
                                                    onChange={this.mobilenumber} autoComplete="off"
                                                    style={{
                                                        height: "40px",
                                                        borderRadius: "5px",
                                                        backgroundColor: "whitesmoke"
                                                    }}
                                                    placeholder="Enter Mobile Number"
                                                />
                                                {(this.state.invalidMnum) ? <span className='text-danger'>Invalid Mobile number</span> : ''}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button className=" btn justify-center text-white" id='oFkycSubmitBtn' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.uploadAadhar}>Sign Up</button>
                                            &nbsp;
                                            <button className=" btn justify-center text-white" style={{ backgroundColor: "#0079BF" }} onClick={this.cancelUpload}>Cancel</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation()(OfflineKyc);