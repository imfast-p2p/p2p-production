import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import axios from 'axios';



class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginname: '',
            mobilenumber: '',
            issuetype: '',
            issuedesc: '',
            reqNo: ''
        };

        this.raiseSupportTicket = this.raiseSupportTicket.bind(this);
    }

    componentWillMount() {
        const { steps } = this.props;
        const { loginname, mobilenumber, issuetype, issuedesc } = steps;

        this.setState({ loginname, mobilenumber, issuetype, issuedesc });

        const userObject = {
            loginname: this.state.loginname.value,
            mobilenumber: this.state.mobilenumber.value,
            issuetype: this.state.issuetype.value,
            issuedesc: this.state.issuedesc.value
        };
        // axios.post(BASEURL + '/grievance/raisesupportticket', userObject)
        //     .then(resdata => {
        //         console.log(resdata.status)
        //         this.setState({ reqNo: resdata.msgdata.reqno })
        //     }).catch(error => {
        //         console.log(error);
        //     });


    }

    componentDidMount() {
        const { steps } = this.props;
        const { loginname, mobilenumber, issuetype, issuedesc } = steps;

        this.setState({ loginname, mobilenumber, issuetype, issuedesc });

        this.raiseSupportTicket();
    }

    raiseSupportTicket() {

        fetch(BASEURL + '/grievance/raisesupportticket', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loginname: this.state.loginname.value,
                mobilenumber: this.state.mobilenumber.value,
                issuetype: this.state.issuetype.value,
                issuedesc: this.state.issuedesc.value
            })
        }).then((Response) => {

            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata);
                    // alert(resdata.message + " & your request number is " + resdata.msgdata.reqno);
                    this.setState({ reqNo: resdata.msgdata.reqno })
                } else {
                    // alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }


    render() {
        const { loginname } = this.state;
        return (
            <div style={{ width: '100%' }}>
                <p>Hi {loginname.value}. Your request number is {this.state.reqNo}</p>
            </div>
        );
    }
};


export default Post;