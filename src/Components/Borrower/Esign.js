import React, { Component } from 'react';
import Loader from '../Loader/Loader';

var ddeMetaResp = sessionStorage.getItem("dde_data")
export default class ESign extends Component {
    constructor(props) {
        super(props);
        this.ifr = null;
        this.state = {
            aspUrl: "",
            ddeMetaResp: "",
            loaded: true,
            response: null,
            isTextPresent: false,

            showLoader: false,
        }
    }
    componentDidMount() {
        console.log(ddeMetaResp)
        var form = this.refs.form;
        form.submit()
        // this.intervalId = setInterval(this.checkIframeContent, 1000);
        
    }
    checkIframeContent=()=>{
        var iframe = document.getElementById('my_iframe');
        console.log(iframe)
        if (iframe) {
            iframe.onload = () => {
                // Check if contentWindow and contentDocument are accessible
                try {
                    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                    const documentContent = iframeDocument.documentElement.outerHTML;
                    this.setState({ documentContent });
                    console.log(documentContent);
                  } catch (error) {
                    console.error('Error accessing iframe document:', error);
                    clearInterval(this.intervalId);
                  }
            }
        }
    }
    onLoad() {
    }
    render() {
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc", marginTop: "-7px" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <div className="main-content" id="page-content-wrapper">
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold", color: "rgb(5, 54, 82)" }}>P2PL - Loan agreement signing</p>
                        </div>
                    </div>
                    <div className='row'>
                        <div className="">
                            <iframe name="my_iframe" id="my_iframe" className="iframe" scrolling="yes" style={{ width: "-webkit-fill-available", height: "110vh" }}></iframe>
                            {this.state.response && <div>Response from iframe: {this.state.response}</div>}
                            <form method="POST" style={{ display: "none" }} action="https://ilpuat.finfotech.co.in/lms/borr/signloanagreement/inapp" encType="application/x-www-form-urlencoded" target="my_iframe" ref="form">
                                <input type="text" id="META_DATA" name="META_DATA" value={ddeMetaResp} />
                                <input type="submit" value="Submit" />
                            </form>
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}