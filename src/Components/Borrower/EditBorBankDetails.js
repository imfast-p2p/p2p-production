import React, { Component } from 'react';
import BorrowerSidebar from '../../SidebarFiles/BorrowerSidebar';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { FaHouseUser, FaRegSave } from "react-icons/fa";
import Loader from '../Loader/Loader';
export class EditBorBankDetails extends Component {
    //updated
    constructor(props) {
        super(props)

        this.state = {
            accounttype: "",
            accountifsc: "",
            accountno: "",
            accountvpa: "",
            branch: "",
            accountno2: "",

            confirmAccount: false,
            showLoader: false,
            isAccountnoShown: false,

            invalidBranch: false,
            invalidIfsc: false
        }

        this.accounttype = this.accounttype.bind(this);
        this.accountifsc = this.accountifsc.bind(this);
        this.accountno = this.accountno.bind(this);
        this.accountvpa = this.accountvpa.bind(this);
        this.branch = this.branch.bind(this);
        this.setBankDetails = this.setBankDetails.bind(this);
    }

    accounttype(event) {
        this.setState({ accounttype: event.target.value })
    }
    accountifsc(event) {
        this.setState({ accountifsc: event.target.value })

        var match = /^[A-Z]{4}[0][A-Z0-9]{6}$/;
        var ifscNo = event.target.value;
        if (match.test(ifscNo)) {
            this.setState({
                accountifsc: ifscNo,
                invalidIfsc: false
            })
            console.log("passed")
        } else {
            this.setState({ invalidIfsc: true })
            return false;
        }
    }
    accountno(event) {
        this.setState({ accountno: event.target.value })
    }
    accountno2 = (event) => {
        switch (event.target.name) {
            case "confirm-account": (event.target.value !== document.getElementsByName('account')[0].value) ?
                this.setState({ confirmAccount: true }) : this.setState({ confirmAccount: false })
                break;

            default:
                break;
        }
        this.setState({ accountno2: event.target.value })
    }
    accountvpa(event) {
        this.setState({ accountvpa: event.target.value })
    }
    branch(event) {
        var branchInput = /^[A-Za-z ]*$/;
        var eventInput = event.target.value;
        if (branchInput.test(eventInput)) {
            console.log("passed")
            this.setState({ invalidBranch: false })
            $('#bankSubmitBtn').prop('disabled', false)
            this.setState({ branch: event.target.value })
        } else {
            this.setState({ invalidBranch: true })
            // $('#bankSubmitBtn').prop('disabled', true)
        }
    }

    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.setState({ showLoader: true })
            this.getBankDetails()
            // $('#bankSubmitBtn').prop('disabled', true)
        } else {
            window.location = '/login'
        }


    }
    getBankDetails = (event) => {
        fetch(BASEURL + '/usrmgmt/getaccountdetails', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                memmid: parseInt(sessionStorage.getItem('memmID'))
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    this.setState({ showLoader: false })
                    console.log(resdata);
                    if (resdata.msgdata.accounttype == 1) {
                        this.setState({ accounttype: 1 })
                        console.log(this.state.accounttype)
                    }
                    else if (resdata.msgdata.accounttype == 2) {
                        this.setState({ accounttype: 2 })
                        console.log(this.state.accounttype)

                    }
                    this.setState({ accountno: resdata.msgdata.accountno })
                    this.setState({ accountvpa: resdata.msgdata.accountvpa })
                    this.setState({ accountifsc: resdata.msgdata.accountifsc })
                    this.setState({ branch: resdata.msgdata.branch })
                    this.setState({ accountno2: resdata.msgdata.accountno })

                    console.log(this.state.accountifsc)
                    console.log(this.state.accountno)
                    console.log(this.state.accountvpa)
                    console.log(this.state.branch)


                }
                else {
                    this.setState({ showLoader: false })
                    //alert("Issue: " + resdata.message);
                }
            })
    }

    setBankDetails(event) {
        var accountifsc = this.state.accountifsc;
        this.setState({ showLoader: true })
        var match = /^[A-Z]{4}[0][A-Z0-9]{6}$/;
        if (match.test(accountifsc)) {
            fetch(BASEURL + '/usrmgmt/setaccountdetails', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    accounttype: parseInt(this.state.accounttype),
                    accountifsc: this.state.accountifsc,
                    accountno: this.state.accountno,
                    accountvpa: this.state.accountvpa,
                    branch: this.state.branch

                })
            }).then((Response) => Response.json())
                .then((resdata) => {
                    if (resdata.status === 'Success') {
                        this.setState({ showLoader: false })
                        // alert(resdata.message);
                        // console.log(resdata);
                        // this.setUserStatusflag()
                        confirmAlert({
                            message: resdata.message,
                            buttons: [{
                                label: "Okay",
                                onClick: () => {
                                    this.setUserStatusflag();
                                }
                            }],
                            closeOnClickOutside: false,
                        })
                    } else {
                        this.setState({ showLoader: false })
                        confirmAlert({
                            message: resdata.message,
                            buttons: [{
                                label: "Okay",
                                onClick: () => {

                                }
                            }],

                        })
                    }
                })
        } else {
            this.setState({ showLoader: false })
            confirmAlert({
                message: "Invalid IFSC Code,Enter correct IFSC Code.",
                buttons: [{
                    label: "Okay",
                    onClick: () => {
                        // window.location.reload()
                    }
                }]
            })
        }

    }
    setUserStatusflag = (event) => {
        fetch(BASEURL + '/usrmgmt/getuserstatusflags', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata.isAccountVerified)
                    this.props.parentCallback(resdata.msgdata.isAccountVerified);
                    window.location.reload();
                }
                else {
                    alert(resdata.message);
                }
            })
    }
    cancelbankDetails = () => {
        window.location.reload();
    }
    togglePasswordVisiblity = () => {
        const { isAccountnoShown } = this.state;
        this.setState({ isAccountnoShown: !isAccountnoShown });
    };

    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }

    render() {
        const { isAccountnoShown } = this.state;
        console.log(this.state.accountno2);
        var noteAcc = "Accounts must be personally owned. Money will be forfeited if found to belong to someone else.";
        return (
            <div>
                {
                    this.state.showLoader && <Loader />
                }
                <div className="row">
                    <div className='col-9' style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>
                        <FaHouseUser style={{ marginTop: "-6px" }} />&nbsp;<span>Bank Info </span>
                        <hr style={{ marginTop: "1px" }} />
                    </div>
                    <div className='col-3' style={{ textAlign: "end" }}>
                        <button className='btn btn-sm text-white' id='bankSubmitBtn' style={{ backgroundColor: "rgb(136, 189, 72)", marginTop: "-8px" }}
                            onClick={this.setBankDetails}><FaRegSave style={{ marginTop: "-4px" }} />&nbsp;<span>Submit</span></button>
                        &nbsp;
                        <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF", marginTop: "-8px" }}
                            onClick={this.cancelbankDetails}  ><span>Cancel</span></button>
                    </div>
                </div>

                <div className='row' >
                    <p style={{ fontFamily: "Poppins,sans-serif", color: "RGBA(5,54,82,1)", marginTop: "-10px", marginBottom:"2px" }}>{`Note: ${noteAcc}`}</p>
                    <div className='col-sm-4 col-md-4 col-lg-4'>
                        <p htmlFor="accType" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Account Type</p>
                        {/* <select className="form-select" onChange={this.accounttype} style={{ marginTop: "-4px" }}>
                            {this.state.accounttype ? <option>{this.state.accounttype === 1 ? "Savings Account" : ""}</option> : <option defaultValue>Select Account Type</option>}
                            <option value="1">Savings Account</option>
                        </select> */}
                        <select
                            className="form-select"
                            onChange={this.accounttype}
                            style={{ marginTop: "-10px" }}
                            value={this.state.accounttype}
                        >
                            <option value="" disabled>Select Account Type</option>
                            <option value="1">Savings Account</option>
                            {/* Add other options here */}
                        </select>
                    </div>
                    <div className='col-sm-4 col-md-4 col-lg-4'>
                        <p htmlFor="accNo" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Account Number</p>
                        <input type={isAccountnoShown ? "number" : "password"} id='accountnum' onChange={this.accountno} autoComplete="off" name='account'
                            style={{ height: "38px", marginTop: "-10px", color: "RGBA(5,54,82,1)" }} className="form-control" placeholder="Enter Account Number" value={this.state.accountno} />
                        <i style={{ position: "absolute", right: "20px", top: "15px" }} className={`fa ${isAccountnoShown ? "fa-eye" : "fa-eye-slash"}`} onClick={this.togglePasswordVisiblity}/>
                    </div>
                    <div className='col-sm-4 col-md-4 col-lg-4'>
                        <p htmlFor="accNo" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Confirm Account Number</p>
                        <input type="text" id='accountnum2' onChange={this.accountno2} autoComplete="off" name='confirm-account'
                            style={{ height: "38px", marginTop: "-10px", color: "RGBA(5,54,82,1)" }}
                            className={(this.state.confirmAccount) ? 'error' : "form-control"} placeholder="Confirm Account Number" value={this.state.accountno2} />
                        <br />
                        {(this.state.confirmAccount) ? <span className='text-danger'>Account number does not match</span> : ''}
                    </div>
                </div>

                <div className='row' style={{ marginTop: "-15px" }}>
                    <div className='col-sm-4 col-md-4 col-lg-4'>
                        <p htmlFor="ifsc" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>IFSC</p>
                        <input type="text" id='ifscCode' onChange={this.accountifsc} className="form-control"
                            style={{ height: "38px", marginTop: "-10px", color: "RGBA(5,54,82,1)" }} placeholder="Enter IFSC" value={this.state.accountifsc} />
                        {(this.state.invalidIfsc) ? <span className='text-danger'>Invalid IFSC Code</span> : ''}
                    </div>
                    <div className='col-sm-4 col-md-4 col-lg-4'>
                        <p htmlFor="vpa" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>UPI ID</p>
                        <input type="text" onChange={this.accountvpa} className="form-control"
                            style={{ height: "38px", marginTop: "-10px", color: "RGBA(5,54,82,1)" }} placeholder="Enter UPI ID" value={this.state.accountvpa} />

                    </div>
                    <div className='col-sm-4 col-md-4 col-lg-4'>
                        <p htmlFor="branch" style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Branch</p>
                        <input type="text" onChange={this.branch} className="form-control"
                            style={{ height: "38px",marginTop: "-10px", color: "RGBA(5,54,82,1)" }} placeholder="Enter Branch" value={this.state.branch} />
                        {(this.state.invalidBranch) ? <span className='text-danger'>Invalid Branch Name</span> : ''}
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default EditBorBankDetails