import React, { Component } from 'react';
import { FaAngleLeft } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { RangeStepInput } from 'react-range-step-input';
import $ from 'jquery';
import './emiCalc.css'
import { PieChart } from 'react-minimal-pie-chart';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'

export class EmiCalculator extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            value: 60,
            loanAmt: "500",
            loanTenure: "1",
            loanInterest: "1",
            personIncome: "1000",
            other_emi: "0",

            totalEMI: "",
            totalInterest: "",
            totalAmount: "",
            elgLoan: "",
            //Assumption            
            elgPercent: 0.4,
            //Total EMI should be not be more than 40% of income
            one: "30",
            two: "70",

            value: 25,
        }
    }
    componentDidMount() {
        this.computeEmi()
    }
    loanAmtValue = (value) => {
        this.setState({ loanAmt: value });
        this.computeEmi()
    }
    monthValue = (value) => {
        this.setState({ loanTenure: value });
        this.computeEmi()
    }
    interestValue = (value) => {
        this.setState({ loanInterest: value });
        this.computeEmi()
    }
    personIncomeValue = (value) => {
        this.setState({ personIncome: value });
        this.computeEmi()
    }
    other_emiValue = (value) => {
        this.setState({ other_emi: value });
        this.computeEmi()
    }
    computeEmi = () => {
        var amount = this.state.loanAmt;
        var interest_rate = this.state.loanInterest;
        var months = this.state.loanTenure;

        var Elg_income = this.state.personIncome;
        var Elg_other_emi = this.state.other_emi;
        var elgPer = this.state.elgPercent;

        if (parseInt(Elg_income) > 2000) {
            Elg_income = ((parseInt(Elg_income) * elgPer) - parseInt(Elg_other_emi));

            if (parseInt(Elg_income) > 0) {
                Elg_income = Elg_income * months;
                amount = Elg_income;
            }
            else {
                amount = 0;
                //alert("You are not eligible for loan.")
            }
        }

        // months = months * 12;
        // console.log(months)
        interest_rate = interest_rate / 12 / 100;

        let emi = ((amount * interest_rate * (1 + interest_rate) ** months) / (((1 + interest_rate) ** months) - 1));
        console.log("Emi" + Math.floor(emi));
        var total = emi * months;
        var Interest = total - amount;
        console.log("Interest" + Math.floor(Interest))

        this.setState({ totalInterest: Interest });
        this.setState({ totalEMI: emi });
        this.setState({ totalAmount: total })
        //this.setState({ elgLoan: Elg_income});
        this.setState({ elgLoan: amount });

    }

    handleChangeReverse = (value) => {
        this.setState({
            value: value
        })
    }
    backFromEmiCal = () => {
        if (sessionStorage.getItem('userType') == 2) {
            window.location = "/lenderdashboard";
        } else if (sessionStorage.getItem('userType') == 3) {
            window.location = "/borrowerdashboard";
        } else if (sessionStorage.getItem('userType') == 4) {
            window.location = "/facilitatorDashboard";
        } else if (sessionStorage.getItem('userType') == 5) {
            window.location = "/evaluatorDashboard";
        } else if (sessionStorage.getItem('userType') == 1) {
            window.location = "/sysUserDashboard";
        } else if (sessionStorage.getItem('userType') == 0) {
            window.location = "/landing";
        } else {
            window.location = "/";
        }
    }
    render() {
        const { t } = this.props
        const { value, loanAmt, loanTenure, loanInterest, other_emi, personIncome } = this.state
        const myStyle = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            margin: "4px 2px",
            cursor: "pointer",
            fontSize: "12px",
            // height: "25px",
            width: "65px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            marginLeft: "14px"
        }
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#F4F7FC", height: "100vh" }}>
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='facnavRes1'>
                            <button style={{ marginLeft: "25px" }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link onClick={this.backFromEmiCal}>Home</Link> / EMI Calculator</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            <button style={myStyle} onClick={this.backFromEmiCal}>
                                <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></button>
                        </div>
                        <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                        <div className='card' style={{ cursor: "default", width: "85%", marginLeft: "100px" }}>
                            <div className='card-header border-1 bg-white'>
                                <div className='row' style={{ marginTop: "10px" }}>
                                    <div className='col'>
                                        <ul role="tablist" className="nav nav-pills nav-fill" >
                                            <li className="nav-item" > <a data-toggle="pill" id="myNavLink" href="#loanEmi-tab" className="nav-link active"
                                                style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }}> &nbsp;{t('EMI Calculator')} </a> </li>
                                            <li className="nav-item"> <a data-toggle="pill" id="myNavLink" href="#loanEligbility-tab" className="nav-link"
                                                style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }}> &nbsp;{t('Loan Eligibility Calculator')} </a> </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div className='tab-content' style={{ boxShadow: "rgb(255 255 240 / 10%) 0px 30px 60px -12px inset, rgb(0 0 0 / 30%) 0px 18px 36px -18px inset" }}>
                                            <div id="loanEmi-tab" className="card-header register-form tab-pane fade show active" style={{ padding: '30px', cursor: "default" }}>
                                                <div className='row'>
                                                    <div className='col-5' style={{ color: "#222c70", fontWeight: "bold", fontSize: "16px", fontStyle: "Poppins, sans-serif" }}>
                                                        <div className='row' style={{ marginTop: "10px" }} >
                                                            <div className='col-9'>
                                                                Loan Amount Required
                                                            </div>
                                                            <div className='col-3' style={{ border: "1px solid gray", padding: "5px 5px 5px 10px", borderRadius: "4px" }}>
                                                                ₹&nbsp;{(this.state.loanAmt).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                            </div>
                                                        </div>
                                                        <div className='row-mb-mt-3' style={{ width: "415px" }}>
                                                            <div className='slider orientation-reversed'>
                                                                <div className='slider-group'>
                                                                    <div className='slider-horizontal'>
                                                                        <Slider
                                                                            min={500}
                                                                            max={100000}
                                                                            value={loanAmt}
                                                                            orientation='horizontal'
                                                                            onChange={this.loanAmtValue}
                                                                            step={100}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* <RangeStepInput id="slider2" className="input" style={{ backgroundColor: "rgb(0, 121, 190)", marginLeft: "-20px", width: "460px" }}
                                                    min={this.state.minloan} max={this.state.maxloan} onChange={this.loanAmtValue}
                                                    step={100} /> */}
                                                        </div>
                                                        <div className='row' style={{ marginTop: "20px" }}>
                                                            <div className='col-9'>
                                                                Repayment Term Required(Months)
                                                            </div>
                                                            <div className='col-3' style={{ border: "1px solid gray", padding: "5px 5px 5px 10px", borderRadius: "4px" }}>
                                                                {this.state.loanTenure}&nbsp;Months
                                                            </div>
                                                        </div>
                                                        <div className='row-mb-3' style={{ width: "415px" }}>
                                                            <div className='slider orientation-reversed'>
                                                                <div className='slider-group'>
                                                                    <div className='slider-horizontal'>
                                                                        <Slider
                                                                            min={1}
                                                                            max={30}
                                                                            value={loanTenure}
                                                                            orientation='horizontal'
                                                                            onChange={this.monthValue}
                                                                            step={1}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* <RangeStepInput id="" className="input" style={{ backgroundColor: "rgb(0, 121, 190)", marginLeft: "-20px", width: "460px" }}
                                                    min={this.state.minMonth} max={this.state.maxMonth} onChange={this.monthValue} step={1} /> */}
                                                        </div>
                                                        <div className='row' style={{ marginTop: "20px" }}>
                                                            <div className='col-9'>
                                                                Interest Rate
                                                            </div>
                                                            <div className='col-3' style={{ border: "1px solid gray", padding: "5px 5px 5px 10px", borderRadius: "4px" }}>
                                                                {parseFloat(this.state.loanInterest).toFixed(2)}&nbsp;%
                                                            </div>
                                                        </div>
                                                        <div className='row-mb-3' style={{ width: "415px" }}>
                                                            <div className='slider orientation-reversed'>
                                                                <div className='slider-group'>
                                                                    <div className='slider-horizontal'>
                                                                        <Slider
                                                                            min={1}
                                                                            max={30}
                                                                            value={loanInterest}
                                                                            orientation='horizontal'
                                                                            onChange={this.interestValue}
                                                                            step={0.10}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* <RangeStepInput id="" className="input" style={{ backgroundColor: "rgb(0, 121, 190)", marginLeft: "-20px", width: "460px" }}
                                                    min={this.state.minInt} max={this.state.maxInt} onChange={this.interestValue} step={0.01} /> */}
                                                        </div>
                                                        {/* <div className='row'>
                                            <div className='col'>
                                                <button className='btn btn-info' onClick={this.computeLoan}>
                                                    Submit
                                                </button>
                                            </div>
                                        </div> */}
                                                    </div>
                                                    <div className='col-1'></div>
                                                    <div className='col-6' style={{ color: "#222c70", fontFamily: "Poppins,sans-serif" }}>
                                                        <div className='row' style={{ marginTop: "20px" }}>
                                                            <div className='row'>
                                                                <div className='col-4'>
                                                                    <p className='font-weight-bold'>Monthly EMI</p>
                                                                    <p style={{ marginTop: "-10px" }}>₹ {parseFloat(this.state.totalEMI).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                </div>
                                                                <div className='col-4'>
                                                                    <p className='font-weight-bold'>Total Interest</p>
                                                                    <p style={{ marginTop: "-10px" }}>₹ {parseFloat(this.state.totalInterest).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                </div>
                                                                <div className='col-4'>
                                                                    <p className='font-weight-bold'>Total Amount</p>
                                                                    <p style={{ marginTop: "-10px" }}>₹ {parseFloat(this.state.totalAmount).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                </div>
                                                            </div>
                                                            <div className='col-6' style={{ textAlign: "center", padding: "0px 40px" }}>
                                                                <PieChart
                                                                    data={[
                                                                        { title: 'Principal Amount', value: (((this.state.totalAmount - this.state.totalInterest)) / (this.state.totalAmount) * 100), color: '#0074bf' },
                                                                        { title: 'Interest Rate', value: ((this.state.totalInterest) / (this.state.totalAmount) * 100), color: 'lightGray' },
                                                                    ]}
                                                                />
                                                                <p class="center"></p>
                                                            </div>
                                                            <div className='col-6'>
                                                                <div className='row' style={{ marginTop: "20px" }}>
                                                                    <div className='col-1' style={{ backgroundColor: "#0074bf", borderRadius: "2px" }}>

                                                                    </div>
                                                                    <div className='col' style={{ color: "0074bf", fontStyle: "Poppins, sans-serif", fontSize: "16px" }}>
                                                                        Principal  Amount
                                                                    </div>
                                                                </div>
                                                                <div className='row' style={{ marginTop: "15px" }}>
                                                                    <div className='col-1' style={{ backgroundColor: "lightGray", borderRadius: "2px" }}>

                                                                    </div>
                                                                    <div className='col' style={{ color: "0074bf", fontStyle: "Poppins, sans-serif", fontSize: "16px" }}>
                                                                        Total Interest
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="loanEligbility-tab" className="card-header register-form tab-pane fade show" style={{ padding: '30px', cursor: "default" }}>
                                                <div className='row'>
                                                    <div className='col-5' style={{ color: "#222c70", fontWeight: "bold", fontSize: "16px", fontStyle: "Poppins, sans-serif" }}>
                                                        <div className='row' style={{ marginTop: "10px" }} >
                                                            <div className='col-9'>
                                                                Gross Monthly Income
                                                            </div>
                                                            <div className='col-3' style={{ border: "1px solid gray", padding: "5px 5px 5px 10px", borderRadius: "4px" }}>
                                                                ₹&nbsp;{(this.state.personIncome).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                            </div>
                                                        </div>
                                                        <div className='row-mb-mt-3' style={{ width: "415px" }}>
                                                            <div className='slider orientation-reversed'>
                                                                <div className='slider-group'>
                                                                    <div className='slider-horizontal'>
                                                                        <Slider
                                                                            min={500}
                                                                            max={100000}
                                                                            value={personIncome}
                                                                            orientation='horizontal'
                                                                            onChange={this.personIncomeValue}
                                                                            step={100}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* <RangeStepInput id="slider2" className="input" style={{ backgroundColor: "rgb(0, 121, 190)", marginLeft: "-20px", width: "460px" }}
                                                    min={this.state.minloan} max={this.state.maxloan} onChange={this.loanAmtValue}
                                                    step={100} /> */}
                                                        </div>
                                                        <div className='row' style={{ marginTop: "10px" }} >
                                                            <div className='col-9'>
                                                                Total Current EMI's
                                                            </div>
                                                            <div className='col-3' style={{ border: "1px solid gray", padding: "5px 5px 5px 10px", borderRadius: "4px" }}>
                                                                ₹&nbsp;{(this.state.other_emi).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                            </div>
                                                        </div>
                                                        <div className='row-mb-mt-3' style={{ width: "415px" }}>
                                                            <div className='slider orientation-reversed'>
                                                                <div className='slider-group'>
                                                                    <div className='slider-horizontal'>
                                                                        <Slider
                                                                            min={500}
                                                                            max={100000}
                                                                            value={other_emi}
                                                                            orientation='horizontal'
                                                                            onChange={this.other_emiValue}
                                                                            step={100}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='row' style={{ marginTop: "20px" }}>
                                                            <div className='col-9'>
                                                                Interest Rate
                                                            </div>
                                                            <div className='col-3' style={{ border: "1px solid gray", padding: "5px 5px 5px 10px", borderRadius: "4px" }}>
                                                                {parseFloat(this.state.loanInterest).toFixed(2)}&nbsp;%
                                                            </div>
                                                        </div>
                                                        <div className='row-mb-3' style={{ width: "415px" }}>
                                                            <div className='slider orientation-reversed'>
                                                                <div className='slider-group'>
                                                                    <div className='slider-horizontal'>
                                                                        <Slider
                                                                            min={1}
                                                                            max={30}
                                                                            value={loanInterest}
                                                                            orientation='horizontal'
                                                                            onChange={this.interestValue}
                                                                            step={0.01}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* <RangeStepInput id="" className="input" style={{ backgroundColor: "rgb(0, 121, 190)", marginLeft: "-20px", width: "460px" }}
                                                    min={this.state.minInt} max={this.state.maxInt} onChange={this.interestValue} step={0.01} /> */}
                                                        </div>
                                                        <div className='row' style={{ marginTop: "20px" }}>
                                                            <div className='col-9'>
                                                                Loan Term(Months)
                                                            </div>
                                                            <div className='col-3' style={{ border: "1px solid gray", padding: "5px 5px 5px 10px", borderRadius: "4px" }}>
                                                                {this.state.loanTenure}&nbsp;Months
                                                            </div>
                                                        </div>
                                                        <div className='row-mb-3' style={{ width: "415px" }}>
                                                            <div className='slider orientation-reversed'>
                                                                <div className='slider-group'>
                                                                    <div className='slider-horizontal'>
                                                                        <Slider
                                                                            min={1}
                                                                            max={30}
                                                                            value={loanTenure}
                                                                            orientation='horizontal'
                                                                            onChange={this.monthValue}
                                                                            step={1}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* <RangeStepInput id="" className="input" style={{ backgroundColor: "rgb(0, 121, 190)", marginLeft: "-20px", width: "460px" }}
                                                    min={this.state.minMonth} max={this.state.maxMonth} onChange={this.monthValue} step={1} /> */}
                                                        </div>
                                                    </div>
                                                    <div className='col-1'></div>
                                                    <div className='col-6' style={{ color: "#222c70", fontFamily: "Poppins,sans-serif" }}>
                                                        <div className='row' style={{ marginTop: "20px" }}>
                                                            <div className='row'>
                                                                <div className='col-4'>
                                                                    <p className='font-weight-bold'>Loan Amount</p>
                                                                    <p style={{ marginTop: "-10px" }}>₹ {parseFloat(this.state.elgLoan).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                </div>
                                                                <div className='col-4'>
                                                                    <p className='font-weight-bold'>Monthly EMI</p>
                                                                    <p style={{ marginTop: "-10px" }}>₹ {parseFloat(this.state.totalEMI).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                </div>
                                                                <div className='col-4'>
                                                                    <p className='font-weight-bold'>Total Amount</p>
                                                                    <p style={{ marginTop: "-10px" }}>₹ {parseFloat(this.state.totalAmount).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                </div>
                                                            </div>
                                                            <div className='col-6' style={{ textAlign: "center", padding: "0px 40px" }}>
                                                                <PieChart
                                                                    data={[
                                                                        { title: 'Principal Amount', value: ((this.state.elgLoan) / (this.state.totalAmount) * 100), color: '#0074bf' },
                                                                        { title: 'Interest Rate', value: ((this.state.totalAmount - this.state.elgLoan) / (this.state.totalAmount) * 100), color: 'lightGray' },
                                                                    ]}
                                                                />
                                                                <p class="center"></p>
                                                            </div>
                                                            <div className='col-6'>
                                                                <div className='row' style={{ marginTop: "20px" }}>
                                                                    <div className='col-1' style={{ backgroundColor: "#0074bf", borderRadius: "2px" }}>

                                                                    </div>
                                                                    <div className='col' style={{ color: "0074bf", fontStyle: "Poppins, sans-serif", fontSize: "16px" }}>
                                                                        Principal  Amount
                                                                    </div>
                                                                </div>
                                                                <div className='row' style={{ marginTop: "15px" }}>
                                                                    <div className='col-1' style={{ backgroundColor: "lightGray", borderRadius: "2px" }}>

                                                                    </div>
                                                                    <div className='col' style={{ color: "0074bf", fontStyle: "Poppins, sans-serif", fontSize: "16px" }}>
                                                                        Total Interest
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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

export default withTranslation()(EmiCalculator)