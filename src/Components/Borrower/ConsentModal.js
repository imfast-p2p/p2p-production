import React, { Component } from 'react';
import $ from 'jquery';
import './ConsentModal.css';
import { FaThumbsUp } from "react-icons/fa";
import { BsArrowRepeat } from "react-icons/bs";
import batch from '../assets/batch.png';

class ConsentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consentType: false // State to manage checkbox status
        };
        this.launchCollButtonRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        //this.launchCollButtonRef.current.click();

        // if (this.launchCollButtonRef.current) {
        //     this.launchCollButtonRef.current.click();
        // }

        if (
            this.launchCollButtonRef.current &&
            !document.activeElement.classList.contains('form-check-input')
        ) {
            this.launchCollButtonRef.current.click();
        }
    }

    cancelBtn = () => {
        $('#exampleModalCenter2').modal('hide');
    }
    // handleAgree=()=>{
    //     console.log('agreed');
    // }
    // changeConsentType = (e) => {
    //     const consentType = e.target.checked;
    //     if (consentType == true) {
    //         this.setState({ consentMode: "1" });
    //     } else if (consentType == false) {
    //         this.setState({ consentMode: "" });
    //     }

    // }

    changeConsentType = (e) => {
        const consentType = e.target.checked;
        if (consentType == true) {
            this.setState({ consentMode: "1" });
            this.setState({ consentType: true });
        } else if (consentType == false) {
            this.setState({ consentMode: "" });
            this.setState({ consentType: false });
        }
        console.log('checked');
    }

    handleClick = () => {
        console.log('check 2');
        // Call the function received as a prop
        if (this.props.functionProp) {
            this.props.functionProp(); // Call the function from props
        }
        else if (this.props.setuserConsent) {
            //this.props.setuserConsent(); // Call the function from props
            //const valueToPass = 1; // Or use "" for an empty string
            this.props.setuserConsent(this.state.consentType ? "1" : "");
            console.log("setuserconsent called in modal");
        }
        else if (this.props.setuserConsent2) {

            this.props.setuserConsent2(this.state.consentType ? "1" : "");
            console.log("setuserconsent2 called in modal");
        }
        // $('#exampleModalCenter2').modal('hide');
    };

    render() {

        const { showModal } = this.props;
        const { consentData } = this.props;
        const { consentData2 } = this.props;

        return (
            <div>
                {showModal && (
                    <>
                        <button type="button" ref={this.launchCollButtonRef} id='launchColl' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter2">Large modal</button>
                        <div class="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-body">
                                        <div className='row' style={{ paddingLeft: "5px" }}>
                                            <div className='col'>
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Consent</p>
                                                <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgba(5,54,82,1)" }} />

                                                <div className="">
                                                    {{ consentData } ? <><input type="checkbox" className="form-check-input" id="" onChange={this.changeConsentType} style={{ position: "absolute", left: "19px" }} />
                                                        <p className="form-check-label" style={{ color: "rgba(5,54,82,1)", fontSize: "15px", fontWeight: "400", paddingLeft: "5px", paddingRight: "5px" }}>{consentData}</p></> : ""}

                                                    {{ consentData2 } ? <><input type="checkbox" className="form-check-input" id="" onChange={this.changeConsentType} style={{ position: "absolute", left: "19px" }} />
                                                        <p className="form-check-label" style={{ color: "rgba(5,54,82,1)", fontSize: "15px", fontWeight: "400", paddingLeft: "5px", paddingRight: "5px" }}>{consentData2}</p></> : ""}
                                                </div>
                                                <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                            </div>
                                        </div>
                                        <div className='row' style={{ marginTop: "-10px" }}>
                                            <div className='col-6'>
                                                <button type="button" className="btn btn-sm text-white w-100 rounded-0" id='checkConsentBtn' data-dismiss="modal"
                                                    style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.handleClick}><FaThumbsUp />&nbsp;Agree </button>
                                            </div>
                                            <div className='col-6'>
                                                <button type="button" class="btn btn-sm text-white w-100 rounded-0" style={{ backgroundColor: "#0079BF" }}
                                                    onClick={this.cancelBtn}><BsArrowRepeat />&nbsp;Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="modal-body" style={{ padding: "20px" }}>
                                        <div className='row'>
                                            <div className='col'>
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}> Terms And Conditions</p>
                                                <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgba(5,54,82,1)" }} />

                                                <div className="scrollable-container custom-scrollbar with-border">
                                                    {{ consentData } ? <><input type="checkbox" className="form-check-input" id="" onChange={this.changeConsentType} style={{ position: "absolute", left: "19px" }} />
                                                        <p className="form-check-label" style={{ color: "rgba(5,54,82,1)", fontSize: "15px", fontWeight: "400" }}>{consentData}</p></> : ""}

                                                    {{ consentData2 } ? <><input type="checkbox" className="form-check-input" id="" onChange={this.changeConsentType} style={{ position: "absolute", left: "19px" }} />
                                                        <p className="form-check-label" style={{ color: "rgba(5,54,82,1)", fontSize: "15px", fontWeight: "400" }}>{consentData2}</p></> : ""}

                                                </div>
                                                <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                            </div>
                                        </div>
                                        <div className='row' style={{ marginTop: "-10px" }}>
                                            <div className='col-6'>
                                                <button type="button" className="btn btn-sm text-white w-100 rounded-0" id='checkConsentBtn' data-dismiss="modal"
                                                    style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.handleClick}><FaThumbsUp />&nbsp;Agree </button>
                                            </div>
                                            <div className='col-6'>
                                                <button type="button" class="btn btn-sm text-white w-100 rounded-0" style={{ backgroundColor: "#0079BF" }}
                                                    onClick={this.cancelBtn}><BsArrowRepeat />&nbsp;Cancel</button>
                                            </div>

                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

        )
    }

}
export default ConsentModal;