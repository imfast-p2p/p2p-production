import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import SimpleReactValidator from 'simple-react-validator';
import $, { type } from 'jquery';
import './Borrow.css';
import { withTranslation } from 'react-i18next';
import { confirmAlert } from "react-confirm-alert";
import { Link } from 'react-router-dom';
import { BsInfoCircle } from "react-icons/bs";
import { Card, Container, Row, Col } from 'react-bootstrap';
import { FaFolderPlus, FaUserPlus, FaRegTrashAlt, FaAngleLeft } from "react-icons/fa";

export class EntityRegister extends Component {
    //updated
    constructor(props) {
        super(props);
        this.state = {
            entityFlag: false,
            invalidEntityName: false,
            invalidEntityAddress: false,
            invalidGstn: false,
            invalidCIN: false,
            invalidEntPan: false,
            isentity: "1",
            entityname: "",
            entityaddr: "",
            gstn: "",
            cin: "",
            entitytype: "",
            pincode: "",
            entitypan: "",
        }
    }
    componentDidMount() {

    }
    isentity = (event) => {
        this.setState({ entitytype: event.target.value })
    }
    entityname = (event) => {
        var username = event.target.value;
        var isValid = true;
        this.setState({ entityname: username });
        for (var i = 0; i < username.length; i++) {
            var charCode = username.charCodeAt(i);
            if (!(charCode >= 65 && charCode <= 90) && // A-Z
                !(charCode >= 97 && charCode <= 122) && // a-z
                !(charCode >= 48 && charCode <= 57) && // 0-9
                charCode !== 32) { // space
                isValid = false;
                break;
            }
        }
        if (isValid) {
            this.setState({
                entityname: username,
                invalidEntityName: false
            });
        } else {
            this.setState({
                invalidEntityName: true
            });
        }
    }
    entityaddr = (event) => {
        var username = event.target.value;
        var isValid = true;
        this.setState({ entityaddr: username });
        for (var i = 0; i < username.length; i++) {
            var charCode = username.charCodeAt(i);
            if (!(charCode >= 65 && charCode <= 90) && // A-Z
                !(charCode >= 97 && charCode <= 122) && // a-z
                !(charCode >= 48 && charCode <= 57) && // 0-9
                charCode !== 32) { // space
                isValid = false;
                break;
            }
        }
        if (isValid) {
            this.setState({
                entityaddr: username,
                invalidEntityAddress: false
            });
        } else {
            this.setState({
                invalidEntityAddress: true
            });
        }
    }
    gstn = (event) => {
        const newGstin = event.target.value;
        this.setState({ gstn: newGstin });

        // GSTIN regex pattern
        const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        const gstinValid = gstinPattern.test(newGstin)
        console.log(gstinValid)
        // if (gstinValid) {
        //     this.setState({ invalidGstn: gstinValid });
        // }
        // else {
        //     this.setState({ invalidGstn: gstinValid });
        // }
        this.setState({ invalidGstn: !gstinValid });
    }
    cin = (event) => {
        const newCin = event.target.value;
        this.setState({ cin: newCin });

        // CIN regex pattern
        const cinPattern = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
        const cinValid = cinPattern.test(newCin)
        console.log(cinValid)
        // if (cinValid) {
        //     this.setState({ invalidCIN: cinValid });
        // }
        // else {
        //     this.setState({ invalidCIN: cinValid });
        // }
        this.setState({ invalidCIN: !cinValid });
    }
    pincode = (event) => {
        this.setState({ pincode: event.target.value })
    }
    entitypan = (event) => {
        var regex = /[A-Za-z]{3}[Pp]{1}[A-Za-z]{1}[0-9]{4}[A-Za-z]{1}$/;
        var eventInput = event.target.value;
        if (regex.test(eventInput)) {
            console.log("passed")
            this.setState({ invalidEntPan: false })
            this.setState({ entitypan: event.target.value.toUpperCase().trim() })
        } else {
            this.setState({ invalidEntPan: true })
        }
    }
    routeToRegistration = () => {
        $("#registrationPage").click()
    }
    routeToManualReg = () => {
        const { entityname,
            entityaddr,
            gstn,
            cin,
            entitytype,
            pincode,
            entitypan } = this.state;
        console.log(entityname,
            entityaddr,
            gstn,
            cin,
            entitytype,
            pincode,
            entitypan)
        // Check if any field is empty before adding
        if (!entityname || !entityaddr || !gstn || !cin || !entitytype || !pincode || !entitypan) {
            confirmAlert({
                message: "Please Fill All The Fields.",
                buttons: [
                    {
                        label: "OK",
                        onClick: () => {
                        },
                    },
                ],
            });
            return;
        } else {
            const registrationData = {
                entityname: entityname,
                entityaddr: entityaddr,
                gstn: gstn,
                cin: cin,
                entitytype: entitytype,
                pincode: pincode,
                entitypan: entitypan
            };

            // Convert the JSON object to a string
            const registrationDataString = JSON.stringify(registrationData);

            // Store the string in session storage
            sessionStorage.setItem('registrationData', registrationDataString);
            sessionStorage.setItem('isentity', this.state.isentity)
            $("#manualRegistration").click()
        }
    }
    render() {
        const { t } = this.props;
        const myStyle = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            margin: "4px 2px",
            cursor: "pointer",
            fontSize: "12px",
            width: "65px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            marginLeft: "14px"
        }
        return (
            <div className="row">
                <Container fluid className="d-flex justify-content-center">
                    <Row>
                        <Col>
                            <Card className="" style={{ marginLeft: "8px", paddingBottom: "10px", cursor: "default" }}>
                                <div style={{ textAlign: "initial", marginLeft: "5px" }}>
                                    <button style={myStyle} onClick={this.routeToRegistration}>
                                        <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                    </button>
                                </div>
                                <div
                                    style={{
                                        display: "flex", flexDirection: "row",
                                        alignItems: "center",
                                        marginTop: "-10px",
                                        paddingLeft: "20px",
                                        paddingRight: "20px",
                                    }}
                                >
                                    <div
                                        style={{
                                            flex: 1,
                                            height: "3px",
                                            backgroundColor: "#004d99",
                                        }}
                                    />
                                    <div>
                                        <h4 className="heading1" style={{
                                            color: "#00264d",
                                            fontSize: "15px",
                                            fontFamily: "Poppins,sans-serif",
                                            fontWeight: "600"
                                        }}>
                                            Entity Registration
                                        </h4>
                                    </div>
                                    <div
                                        style={{
                                            flex: 1,
                                            height: "3px",
                                            backgroundColor: "#004d99",
                                        }}
                                    />
                                </div>
                                <div className="row entityFields" id='' style={{ padding: "0px 20px" }}>
                                    <div className="col-lg-6 col-sm-6 col-md-6">
                                        <label
                                            className="u1"
                                            style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Entity Name *
                                        </label>
                                        <div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                onChange={this.entityname}
                                                autoComplete="off"
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                                placeholder="Enter Entity Name"
                                            />
                                        </div>
                                        {(this.state.invalidEntityName) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Entity Name</span> : ''}
                                    </div>
                                    <div className="col-lg-6 col-sm-6 col-md-6">
                                        <label
                                            className="u1"
                                            style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Entity Address *
                                        </label>
                                        <div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                onChange={this.entityaddr}
                                                autoComplete="off"
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                                placeholder="Enter Entity Address"
                                            />
                                        </div>
                                        {(this.state.invalidEntityAddress) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Entity Address</span> : ''}
                                    </div>
                                </div>
                                <div className="row entityFields" id='' style={{ padding: "0px 20px" }}>
                                    <div className="col-lg-6 col-sm-6 col-md-6">
                                        <label
                                            className="u1"
                                            style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            GSTIN *
                                        </label>
                                        <div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                onChange={this.gstn}
                                                autoComplete="off"
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                                placeholder="Enter GSTIN"
                                            />
                                        </div>
                                        {this.state.invalidGstn && (
                                            <span className='text-danger' style={{ fontSize: "12px" }}>
                                                <BsInfoCircle />{t('Invalid GSTIN format')}
                                            </span>
                                        )}
                                        {/* {!this.state.invalidGstn && <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />{t('Invalid GSTIN format')}</span>} */}
                                    </div>
                                    <div className="col-lg-6 col-sm-6 col-md-6">
                                        <label
                                            className="u1"
                                            style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            CIN *
                                        </label>
                                        <div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                onChange={this.cin}
                                                autoComplete="off"
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                                placeholder="Enter CIN"
                                            />
                                        </div>
                                        {this.state.invalidCIN && (
                                            <span className='text-danger' style={{ fontSize: "12px" }}>
                                                <BsInfoCircle />{t('Invalid CIN format')}
                                            </span>
                                        )}
                                        {/* {!this.state.invalidCIN && <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />{t('Invalid CIN format')}</span>} */}
                                    </div>
                                </div>
                                <div className="row entityFields" id='' style={{ padding: "0px 20px" }}>
                                    <div className="col-lg-6 col-sm-6 col-md-6">
                                        <label
                                            className="u1"
                                            style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Entity Type *
                                        </label>
                                        <div>
                                            <select
                                                ref={this.selectRef2}
                                                className="form-select"
                                                onChange={this.isentity}
                                                style={{
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    fontFamily: "Poppins,sans-serif"
                                                }}
                                            >
                                                <option defaultValue="" style={{ color: "#00264d", textAlign: "center" }} >
                                                    --Select--
                                                </option>
                                                <option value="1"
                                                    style={{ color: "#00264d", textAlign: "center" }}>
                                                    Proprietorship
                                                </option>
                                                <option value="2"
                                                    style={{ color: "#00264d", textAlign: "center" }}>
                                                    Partnership
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-sm-6 col-md-6">
                                        <label
                                            className="u1"
                                            style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            PIN Code *
                                        </label>
                                        <div>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="name"
                                                onChange={this.pincode}
                                                autoComplete="off"
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                                placeholder="Enter PIN Code"
                                                onInput={(e) => {
                                                    e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row entityFields" id='' style={{ padding: "0px 20px" }}>
                                    <div className="col-lg-6 col-sm-6 col-md-6">
                                        <label
                                            className="u1"
                                            style={{
                                                color: "#00264d",
                                                fontFamily: "Poppins,sans-serif",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Entity PAN *
                                        </label>
                                        <div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                onChange={this.entitypan}
                                                autoComplete="off"
                                                style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "whitesmoke",
                                                    marginTop: "-10px",
                                                    border: "1px solid rgb(0, 121, 191)",
                                                    color: "#00264d",
                                                }}
                                                placeholder="Enter PAN"
                                            />
                                        </div>
                                        {(this.state.invalidEntPan) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid PAN</span> : ''}
                                    </div>
                                </div>
                                <div className="row" style={{ padding: "6px 34px" }}>
                                    <button className="btn" style={{ backgroundColor: "#0079bf", color: "white" }} id="sig" onClick={this.routeToManualReg}>Sign Up</button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>

                {/* Route to Registration */}
                <Link to="/selectRegistration"><button id='registrationPage' style={{ display: "none" }}>Registration
                </button></Link>
                {/* Route to manualRegistration */}
                <Link to="/manualRegistration"><button id='manualRegistration' style={{ display: "none" }}>Registration
                </button></Link>
            </div>
        )
    }
}

export default withTranslation()(EntityRegister)
