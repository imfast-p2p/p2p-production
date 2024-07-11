import React, { Component } from 'react';
import $ from 'jquery';
// import { VideofloModule } from '@botaiml/videoflo-webcomponent';
import LenderSidebar from '../SidebarFiles/LenderSidebar';
import { Link } from 'react-router-dom';
import { confirmAlert } from "react-confirm-alert";

export class VideoKYC extends Component {
    //updated
    constructor(props) {
        super(props)

        this.state = {
            accessToken: ""
        }
        this.getToken = this.getToken.bind(this);
    }

    componentDidMount() {
        // this.getToken();
    }

    getToken() {
        fetch("https://demo-api.videoflo.net/api/token/getToken", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                appId: "36360435-7c1c-4961-aba1-a6663eec1d6c",
                secretKey: "8a82e56a-c704-4048-b411-db0a2d6f8b86"
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                // alert("Token Generated");
                this.setState({ accessToken: resdata.accessToken })
                confirmAlert({
                    message: "Token Generated For VideoKYC",
                    buttons: [
                        {
                            label: "OK",
                            onClick: () => {
                                this.createSession();
                            },
                        },
                    ],
                });

                sessionStorage.setItem("kycToken", resdata.accessToken);

            })
    }

    createSession() {
        fetch("https://demo-api.videoflo.net/api/videoSessions/createSession", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.state.accessToken
            },
            body: JSON.stringify({
                name: "p2p Lending",
                participants: [
                    {
                        externalParticipantId: "p2p",
                        name: "Saswati Panda",
                        role: "customer",
                        videoLayoutSettings: {
                            "<externalParticipantId-1>": 'small',
                            "<externalParticipantId-2>": 'big'
                        },

                    },
                    {
                        externalParticipantId: "p2p",
                        name: "Luee",
                        role: "agent",
                        videoLayoutSettings: {
                            "<externalParticipantId-1>": 'small',
                            "<externalParticipantId-2>": 'big'
                        }
                    }
                ],
                activities: [
                    {
                        id: "capturePhoto",
                        activityType: "Welcome",
                        gatherFrom: [
                            "customer"
                        ],
                        displayTo: [
                            "agent"
                        ],
                        configuration: {},
                        "onActivityDataGathered": "https://localhost:3000/customerJoin",
                        "onActivityAction": "https://localhost:3000/customerJoin"
                    }
                ],
                webhooks: {
                    "onParticipantConnected": "https://localhost:3000/customerJoin",
                    "onParticipantDisconnected": "https://localhost:3000/customerJoin",
                    "onWorkflowFinished": "https://localhost:3000/customerJoin",
                    "onRecordingAvailable": "https://localhost:3000/customerJoin",
                    "onRecordingError": "https://localhost:3000/customerJoin"
                }
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                // alert("Session Created");
                confirmAlert({
                    message: "Session Created For VideoKYC",
                    buttons: [
                        {
                            label: "OK",
                            onClick: () => {
                                window.location = "/customerJoin";
                            },
                        },
                    ],
                });
                sessionStorage.setItem("sessionId", resdata.sessionId);
                sessionStorage.setItem("participantId", resdata.participants[0].participantId);

            })
    }

    handleChange() {
        $('.text').toggle();
    }

    render() {
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper">
                <LenderSidebar />
                <div className="main-content bg-light" id="page-content-wrapper">
                    <div className="container-fluid row">
                        <div className="col">
                            <button onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className="col">
                            <h4 className="pl-4">Welcome To Video KYC</h4>
                        </div>
                        <div className="col"></div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-3"></div>
                        <div className="col-6">
                            <div className="border p-3">
                                <h6>Do You Want To Start The Session ?</h6>
                                <button className="btn btn-primary ml-5 mr-2" onClick={this.getToken}>Start</button>
                                <Link to="/videoKYC">
                                    <button className="btn btn-danger mr-2 ml-2">Cancel</button>
                                </Link>
                            </div>
                        </div>
                        <div className="col-3"></div>
                    </div>
                </div>
                <div></div>
            </div>
        )
    }
}

export default VideoKYC