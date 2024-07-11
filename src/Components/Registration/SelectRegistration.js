import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { confirmAlert } from "react-confirm-alert";
import { withTranslation } from 'react-i18next';
import $ from 'jquery';
import regImg from '../assets/Registration.png';
import { BsInfoCircle } from "react-icons/bs";
import { Card, Container, Row, Col } from 'react-bootstrap';
import { FaFolderPlus, FaTimesCircle, FaInfoCircle, FaAngleLeft } from "react-icons/fa";
import { BASEURL } from '../assets/baseURL';
import Tooltip from "@material-ui/core/Tooltip";

export class SelectRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            members: [
                { name: '', mobileno: '', email: '', pan: '', designation: '' }
            ],
            entityid: "E01", // Replace with the actual entity ID or get it from props or user input

            //pendingentities
            pendingEntities: [],
            loading: true,
            error: null,

            entityMembers: [],
        };
    }
    userRegType = (event) => {
        if (event.target.value == "RETAIL") {
            $("#retailPage").click()
        } else if (event.target.value == "ENTITY") {
            $("#entityPage").click()
        }
    }
    setpendingEntityStatus = () => {
        fetch(BASEURL + '/usrmgmt/setpendingentitystatus', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                entityid: "E01",   // replace with actual entity ID
                status: "1",       // set as "1" for approval or "2" for rejection
                ...(this.state.comment && { comment: this.state.comment }),

            })
        })
            .then(response => {
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status === 'Success') {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    window.location = "/entityManagement"; // or any other appropriate redirect
                                },
                            },
                        ],
                    });
                } else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    // You can add any action here, like staying on the current page or reloading
                                },
                            },
                        ],
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    handleChange = (index, event) => {
        const { name, value } = event.target;
        const members = [...this.state.members];
        members[index][name] = value;
        this.setState({ members });
    };
    addMember = () => {
        this.setState(prevState => ({
            members: [...prevState.members, { name: '', mobileno: '', email: '', pan: '', designation: '' }]
        }));
    };
    removeMember = (index) => {
        this.setState(prevState => {
            const members = [...prevState.members];
            members.splice(index, 1);
            return { members };
        });
    };
    setEntityMembers = (event) => {
        event.preventDefault();
        const { entityid, members } = this.state;

        fetch(BASEURL + '/usrmgmt/setentitymembers', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                entityid: entityid,
                entitymemberinfo: members,
            })
        })
            .then(response => response.json())
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    window.location = "/entityManagement";
                                },
                            },
                        ],
                    });
                } else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                },
                            },
                        ],
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    //getEntities
    getPendingEntities = () => {
        fetch(BASEURL + '/usrmgmt/getpendingentitylist', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then((data) => {
                if (data.status === 'Success') {
                    this.setState({
                        pendingEntities: data.msgdata,
                        loading: false
                    });
                } else {
                    this.setState({
                        error: data.message,
                        loading: false
                    });
                    confirmAlert({
                        message: data.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    // Add any action if needed on failure
                                },
                            },
                        ],
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching pending entities:", error);
                this.setState({
                    error: "Failed to fetch pending entities",
                    loading: false
                });
                confirmAlert({
                    message: "Failed to fetch pending entities",
                    buttons: [
                        {
                            label: "OK",
                            onClick: () => {
                                // Add any action if needed on network error
                            },
                        },
                    ],
                });
            });
    };
    getEntityMembers = () => {
        const { entityid } = this.state;

        fetch(`${BASEURL}/usrmgmt/getentitymembers?entityid=${entityid}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then((data) => {
                if (data.status === 'Success') {
                    this.setState({
                        entityMembers: data.msgdata.entitymemberinfo,
                        loading: false
                    });
                } else {
                    this.setState({
                        error: data.message,
                        loading: false
                    });
                    confirmAlert({
                        message: data.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    // Add any action if needed on failure
                                },
                            },
                        ],
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching entity members:", error);
                this.setState({
                    error: "Failed to fetch entity members",
                    loading: false
                });
                confirmAlert({
                    message: "Failed to fetch entity members",
                    buttons: [
                        {
                            label: "OK",
                            onClick: () => {
                                // Add any action if needed on network error
                            },
                        },
                    ],
                });
            });
    };
    routeToRegistration = () => {
        $("#registrationPage").click()
    }
    openModal = () => {
        $('#infoModal').click();
    };
    closeModal = () => {
        $('#infoModal').modal('hide');
    };
    render() {//updated
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
        const { pendingEntities, entityMembers, loading, error } = this.state;
        // return (
        //     <div style={{ paddingLeft: "18%", paddingRight: "18%", paddingTop: "5%" }}>
        //         <div className="container">
        //             <div className="row d-flex justify-content-center" >
        //                 <div className="col-md-12 ">
        //                     <div className="card" style={{ width: "100%", cursor: "default", boxShadow: "5px 10px 18px #888888" }}>
        //                         <div className="credentials" style={{ padding: "10px 50px" }}>
        //                             <div className='mb-3' style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingTop: "15px", }}>
        //                                 <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
        //                                 <div>
        //                                     <h4 className="heading1" style={{ color: "#00264d" }}>
        //                                         Choose Registration Mode
        //                                     </h4>
        //                                 </div>
        //                                 <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
        //                             </div>

        //                             <div className='row mb-4' onClick={this.userRegType} style={{ color: "#00264d", fontWeight: "bold" }}>
        //                                 <div className="col-6" style={{ textAlign: "end" }}>
        //                                     <div className="form-check">
        //                                         <p className="form-check-label mr-4" >
        //                                             <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="RETAIL" />{t("Retail")}
        //                                         </p>
        //                                     </div>
        //                                 </div>
        //                                 <div className="col-6">
        //                                     <div className="form-check" >
        //                                         <p className="form-check-label mr-4">
        //                                             <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="ENTITY" />
        //                                             <span >
        //                                                 {t("Entity")}
        //                                             </span>
        //                                         </p>
        //                                     </div>
        //                                 </div>

        //                             </div>
        //                             <div className='row mb-2'>
        //                                 <div className='col' style={{ textAlign: "center" }}>
        //                                     <div className="form-check">
        //                                         <img src={regImg} width="30%" height="30%" />
        //                                     </div>
        //                                 </div>
        //                             </div>


        //                         </div>
        //                     </div>
        //                 </div>

        //             </div>
        //             {/* Route to Retail page */}
        //             <Link to="/registration"><button id='retailPage' style={{ display: "none" }}>Retail
        //             </button></Link>

        //             {/* Route to Entity page */}
        //             <Link to="/enitityReg"><button id='entityPage' style={{ display: "none" }}>Entity
        //             </button></Link>
        //         </div>
        //     </div>
        // )
        return (
            <div className='row'>
                {/* Info Modal */}
                <button
                    id='infoModal'
                    type='button'
                    className='btn btn-primary'
                    data-toggle='modal'
                    data-target='.bd-example-modal'
                    style={{ display: 'none' }}
                >
                    Small modal
                </button>
                <div className='modal fade bd-example-modal' tabIndex='-1' role='dialog' aria-labelledby='mySmallModalLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content' style={{ height: "350px", fontSize: "14px" }}>
                            <div className='modal-body' style={{ overflow: "scroll" }} id='secondAuditScroll12'>
                                <div >
                                    <FaTimesCircle type="button" class="close" data-dismiss="modal" aria-label="Close" style={{ color: "rgb(5, 54, 82)" }} onClick={this.closeModal} />
                                </div>
                                <p className='risk-rating-header' style={{ color: "rgb(0, 38, 77)", fontSize: "15px" }}>Registration Mode :</p>
                                <ul className='timeline'>
                                    <li className='timeline-item'>
                                        <span className='timeline-label'>Retail Registration:</span>
                                        <span className='timeline-description'>For individual users who want to register and verify their identity for personal use. This option is suitable for consumers who require services for themselves, such as banking, insurance, or government services.</span>
                                    </li>
                                    <li className='timeline-item'>
                                        <span className='timeline-label'>Entity Registration:</span>
                                        <span className='timeline-description'>For businesses or organizations that need to register and verify their identity to access services on behalf of the company. This option is ideal for entities such as corporations, NGOs, or governmental bodies that require access to enterprise-level services or bulk transactions.</span>
                                    </li>
                                </ul>
                                <hr style={{ backgroundColor: 'rgba(5,54,82,1)' }} />
                                <div className='row'>
                                    <div className='col' style={{ textAlign: 'center' }}>
                                        <button
                                            type='button'
                                            className='btn text-white btn-sm'
                                            data-dismiss='modal'
                                            style={{ backgroundColor: 'rgb(136, 189, 72)' }}
                                            onClick={this.closeModal}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <Container fluid className="d-flex justify-content-center">
                    <Row>
                        <Col>
                            <Card className="" style={{ width: "700px", marginLeft: "8px", paddingBottom: "10px", cursor: "default" }}>
                                <div className='row' >
                                    <div className='col' style={{ marginLeft: "8px" }}>
                                        <button style={myStyle} onClick={this.routeToRegistration}>
                                            <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                        </button>
                                    </div>
                                    <div className='col' style={{ textAlign: "end", marginRight: "20px" }}>
                                        <FaInfoCircle style={{ color: "rgb(136, 189, 72)", fontSize: "20px", marginLeft: "10px", cursor: "pointer" }} onClick={this.openModal} />
                                    </div>
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
                                            Choose Registration Mode
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
                                <div className='row mb-4' onClick={this.userRegType} style={{ color: "#00264d", fontWeight: "bold", fontSize: "15px", }}>
                                    <div className="col-6" style={{ textAlign: "end" }}>
                                        <div className="form-check">
                                            <p className="form-check-label mr-4" >
                                                <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="RETAIL" />{t("Retail")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-check" >
                                            <p className="form-check-label mr-4">
                                                <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="ENTITY" />
                                                <span >
                                                    {t("Entity")}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                </div>
                                <div className='row mb-2'>
                                    <div className='col' style={{ textAlign: "center" }}>
                                        <div className="form-check">
                                            <img src={regImg} width="20%" height="20%" />
                                        </div>
                                    </div>
                                </div>
                                {/* Route to Registration */}
                                <Link to="/login"><button id='registrationPage' style={{ display: "none" }}>Registration
                                </button></Link>
                                {/* Route to Retail page */}
                                <Link to="/registration"><button id='retailPage' style={{ display: "none" }}>Retail
                                </button></Link>

                                {/* Route to Entity page */}
                                <Link to="/enitityReg"><button id='entityPage' style={{ display: "none" }}>Entity
                                </button></Link>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default withTranslation()(SelectRegistration);