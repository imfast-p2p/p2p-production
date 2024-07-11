import React, { Component } from 'react';
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import { BASEURL } from '../assets/baseURL';
import Post from './Post';

//const { Login_name, mobile_no, issue_desc } = this.state;


const theme = {
    background: "white",
    fontFamily: "Arial, Helvetica, sans-serif",
    headerBgColor: "#1245a8",
    headerFontColor: "#fff",
    headerFontSize: "25px",
    botBubbleColor: "#1245a8",
    botFontColor: "#fff",
    userBubbleColor: "#fff",
    userFontColor: "#4c4c4c"
};

const config = {
    width: "300px",
    height: "400px",
    floating: true
};

const steps = [
    {
        id: "Greet",
        message: "Welcome to IMFAST P2PL",
        delay: 2000,
        trigger: "AskService"
    },
    {
        id: "AskService",
        options: [
            { value: 'Gre', label: 'Grievance', trigger: 'ser-gre' },
            { value: 'Oth', label: 'Others', trigger: 'ser-Oth' }
        ]
    },
    {
        id: "ser-gre",
        options: [
            { value: 'GreR', label: 'New Ticket', trigger: 'ser-NewTicket' },
            { value: 'GreS', label: 'Status', trigger: 'ser-Status' }
        ]
    },
    {
        id: "ser-Oth",
        message: "Our support team will call you",
        end: true
    },
    {
        id: "ser-Status",
        message: "Will check the status",
        end: true
    },
    {
        id: "ser-NewTicket",
        message: "Please enter your Login name",
        trigger: "loginname"
    },
    {
        id: "loginname",
        user: true,
        trigger: "Ask_Mobile"
    },
    {
        id: "Ask_Mobile",
        message: "Please enter your mobile number",
        trigger: "mobilenumber"
    },
    {
        id: "mobilenumber",
        user: true,
        trigger: "Ask-issuetype"
    },
    {
        id: 'Ask-issuetype',
        message: "Please select the issue type",
        trigger: "issuetype"
    },
    {
        id: 'issuetype',
        options: [
            { value: 'RG001', label: 'Registration Related', trigger: 'Ask-issuedesc' },
            { value: 'LN001', label: 'Loan Related', trigger: 'Ask-issuedesc' },
            { value: 'LG001', label: 'Login Related', trigger: 'Ask-issuedesc' },
            { value: 'PY001', label: 'Payment Related', trigger: 'Ask-issuedesc' },
        ]
    },
    {
        id: "Ask-issuedesc",
        message: "Please enter issue description",
        trigger: "issuedesc"
    },
    {
        id: "issuedesc",
        message: "Please enter issue description",
        user: true,
        trigger: "Done"
    },
    {
        id: "Done",
        component: <Post />,
        asMessage: true,
        end: true
    }
];
class Chatbot extends Component {

    render() {
        return (
            <div>
                <ThemeProvider theme={theme}>
                    <ChatBot headerTitle="P2PL" speechSynthesis={{ enable: true, lang: 'en' }} steps={steps} {...config} />
                </ThemeProvider>
            </div>
        );
    }

}

export default Chatbot
