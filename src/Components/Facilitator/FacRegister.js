import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import SimpleReactValidator from 'simple-react-validator';
import $ from 'jquery';
import './Borrow.css';
import { withTranslation } from 'react-i18next';

export class FacRegister extends Component {
    //updated
    constructor() {

        super();

        this.state = {
            email: '',
            mobilenumber: '',
            pannumber: '',
            otpm: '',
            otpe: '',
            dateofbirth: '',
            gender: 'M',
            utype: '2',
            name: '',
            loginpassword: '',
            emailref: "",
            mobileref: ""
        }

        this.email = this.email.bind(this);
        this.mobilenumber = this.mobilenumber.bind(this);
        this.pannumber = this.pannumber.bind(this);
        this.otpm = this.otpm.bind(this);
        this.otpe = this.otpe.bind(this);
        this.dateofbirth = this.dateofbirth.bind(this);
        this.gender = this.gender.bind(this);
        this.utype = this.utype.bind(this);
        this.name = this.name.bind(this);
        this.loginpassword = this.loginpassword.bind(this);
        this.register = this.register.bind(this);
        this.otp = this.otp.bind(this);
        this.emailref = this.emailref.bind(this);
        this.mobileref = this.mobileref.bind(this);
        this.validator = new SimpleReactValidator();
    }


    email(event) {
        this.setState({ email: event.target.value })
    }
    mobilenumber(event) {
        this.setState({ mobilenumber: event.target.value })
    }
    pannumber(event) {
        this.setState({ pannumber: event.target.value })
    }
    otpm(event) {
        this.setState({ otpm: event.target.value })
    }
    otpe(event) {
        this.setState({ otpe: event.target.value })
    }
    dateofbirth(event) {
        this.setState({ dateofbirth: event.target.value })
    }
    gender(event) {
        this.setState({ gender: event.target.value });
        console.log(event.target.value);
    }
    utype(event) {
        this.setState({ utype: event.target.value });
        console.log(event.target.value);
    }
    name(event) {
        this.setState({ name: event.target.value })
    }
    loginpassword(event) {
        this.setState({ loginpassword: event.target.value })
    }
    mobileref(event) {
        this.setState({ mobileref: event.target.value })
    }
    emailref(event) {
        this.setState({ emailref: event.target.value })
    }

    otp(event) {
        fetch(BASEURL + '/usrmgmt/generateotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                mobilenumber: this.state.mobilenumber,
            })
        }).then((Response) => Response.json())
            .then((data) => {
                console.log(data);
                if (data.status == 'Success') {
                    alert(data.message);
                    this.setState({ 'mobileref': data.msgdata.mobileref });
                    this.setState({ 'emailref': data.msgdata.emailref });
                }
                else {
                    alert("Issue : " + data.message);
                }
            })
    }

    register(event) {

        if (this.validator.allValid()) {
            // alert('You submitted the form and stuff!');
        } else {
            this.validator.showMessages();
            this.forceUpdate();
            return;
        }

        fetch(BASEURL + '/usrmgmt/registeruser', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                mobilenumber: this.state.mobilenumber,
                pannumber: this.state.pannumber,
                otpm: parseInt(this.state.otpm),
                otpe: parseInt(this.state.otpe),
                dateofbirth: this.state.dateofbirth,
                //gender: parseInt(this.state.gender),
                gender: this.state.gender,
                utype: 4,
                name: this.state.name,
                loginpassword: this.state.loginpassword,
                mobileref: parseInt(this.state.mobileref),
                emailref: parseInt(this.state.emailref)
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.code == 'Success') {
                    window.location = "/ThankYou";
                    sessionStorage.setItem('login', resdata.msgdata.login);
                } else {
                    alert("Issue: " + resdata.message);
                }

            })
            .catch((error) => {
                console.log(error)
            })
    }
    onSelectOption() {
        $('.otpField').toggle();
    }

    render() {
        const { t } = this.props

        return (
            <div className="row">
                <div className="col-md-10 mx-auto p-0 mt-2">
                    <div className="card" style={{ height: '85%' }}>
                        <div className="login-box">
                            <div className="login-snip signin-text p-5">
                                <input id="tab-2" type="radio" name="tab" className="sign-up" />
                                <label htmlFor="tab-2" className="text-dark tab">{t("FRegister")}</label>
                                <div className="login-space">
                                    <div className="sign-up-form">
                                        <div className="row">
                                            <div className="col-md-4 col-lg-4 col-sm-4 group">
                                                <label htmlFor="user" className="label">{t("name")}</label>
                                                <input id="user" type="text" onChange={this.name} className="input" placeholder={t('nPlaceholder')} />
                                                {this.validator.message('name', this.state.name, 'required|name', { className: 'text-danger' })}
                                            </div>
                                            <div className="col-md-4 col-lg-4 col-sm-4 group">
                                                <label htmlFor="dob" className="label">{t("Date Of Birth")}</label>
                                                <input id="dob" type="date" onChange={this.dateofbirth} className="input" placeholder="YYYY-MM-DD" />
                                                {this.validator.message('dateofbirth', this.state.dateofbirth, 'required|dateofbirth', { className: 'text-danger' })}
                                            </div>
                                            <div className="col-md-4 col-lg-4 col-sm-4 group">
                                                <label htmlFor="pan" className="label">{t("PAN")}</label>
                                                <input id="pan" type="text" onChange={this.pannumber} className="input" placeholder={t('pPlaceholder')} />
                                                {this.validator.message('pannumber', this.state.pannumber, 'required|pannumber|min:8|10|max:14', { className: 'text-danger' })}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4 col-lg-4 col-sm-4 group">
                                                <label htmlFor="gender" className="label">{t("gender")}</label>
                                                <div className="input">
                                                    <div className="d-flex" onChange={this.gender}>
                                                        <div className="mr-5">
                                                            <input type="radio" className="" name="optradio" value="M" defaultChecked />{t('male')}
                                                        </div>
                                                        <div className="mr-5">
                                                            <input type="radio" className="" name="optradio" value="F" />{t('female')}
                                                        </div>
                                                        <div className="">
                                                            <input type="radio" className="" name="optradio" value="O" />{t('other')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-lg-4 col-sm-4 group">
                                                <label htmlFor="mobile" className="label">{t("mobile")}</label>
                                                <input id="mobile" type="number" onChange={this.mobilenumber} className="input" placeholder={t('mPlaceholder')} />
                                                {this.validator.message('mobilenumber', this.state.mobilenumber, 'required|mobilenumber|min:10|max:10', { className: 'text-danger' })}
                                            </div>
                                            <div className="col-md-4 col-lg-4 col-sm-4 group">
                                                <label htmlFor="email" className="label">{t("email")}</label>
                                                <input id="email" type="text" onChange={this.email} className="input" placeholder={t('ePlaceholder')} />
                                                {this.validator.message('email', this.state.email, 'required|email', { className: 'text-danger' })}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 col-lg-4 col-sm-4 group" style={{ marginTop: '22px' }}>
                                                <button type="button" data-toggle="collapse" href="#collapseExample" onClick={this.otp} className="button" value="Send OTP">{t('sendOTP')}</button>
                                            </div>
                                            <div className="collapse col-md-6 col-lg-4 col-sm-4 group" id="collapseExample">
                                                <label htmlFor="otpEmail" className="label">{t("Eotp")}</label>
                                                <input id="otp" type="number" onChange={this.otpe} className="input" placeholder={t('eOPlaceholder')} />
                                            </div>
                                            <div className="collapse  col-md-6 col-lg-4 col-sm-4 group" id="collapseExample">
                                                <label htmlFor="otpMobile" className="label">{t("Motp")}</label>
                                                <input id="otp" type="number" onChange={this.otpm} className="input" placeholder={t('mOPlaceholder')} />
                                            </div>
                                        </div>
                                        <div className="collapse row" id="collapseExample">
                                            <div className="col-md-6 col-lg-4 col-sm-4 group">
                                                <label htmlFor="pass" className="label">{t("password")}</label>
                                                <input id="pass" type="password" name="password" required="" onChange={this.loginpassword} className="input" data-type="password" placeholder={t('pPlaceholder')} />
                                                {this.validator.message('loginpassword', this.state.loginpassword, 'required|loginpassword|min:5|max:15', { className: 'text-danger' })}
                                            </div>
                                            <div className="col-md-6 col-lg-4 col-sm-4 group">
                                                <label htmlFor="pass" className="label">{t("confirmPassword")}</label>
                                                <input id="pass" type="password" name="password" required="" onChange={this.loginpassword} className="input" data-type="password" placeholder={t('pPlaceholder')} />
                                                {this.validator.message('loginpassword', this.state.loginpassword, 'required|loginpassword|min:5|max:15', { className: 'text-danger' })}
                                            </div>
                                            <div className="col-md-6 col-lg-4 col-sm-4 group" style={{ marginTop: '22px' }}>
                                                <input type="submit" onClick={this.register} className="button" value={t('signUp')} />
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

export default withTranslation()(FacRegister)