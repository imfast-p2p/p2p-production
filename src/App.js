import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Nav from './Components/NavBar/Nav';
import Home from './Components/About/Home';
import Borrow from './Components/Registration/Borrow';
import About from './Components/About/About';
import HowItWorks from './Components/About/HowItWorks';
// import MarketPlace from './Components/MarketPlace';
import FAQ from './Components/About/FAQ';
import Contact from './Components/About/Contact';
import Login from './Components/Others/Login';
import Register from './Components/Registration/Register';
import LenderDetails from './Components/Lender/LenderDetails';
import BorrowerDetails from './Components/Borrower/BorrowerDetails';
import ThankYou from './Components/Registration/ThankYou';
import Admin from './Components/Admin/Admin';
import Landing from './Components/Admin/Landing';
import Users from './Components/Admin/Users';
import Organization from './Components/Admin/Organization';
import System from './Components/Admin/System';
import Products from './Components/Admin/Products';
import Templates from './Components/Admin/Templates';
import CreateUser from './Components/Admin/CreateUser';
import Clients from './Components/Admin/Clients';
import CreateClient from './Components/Admin/CreateClient';
import LenderDashboard from './Components/Lender/LenderDashboard';
import BorrowerDashboard from './Components/Borrower/BorrowerDashboard';
import LoanRequest from './Components/Borrower/LoanRequest';
import DefineRole from './Components/Admin/DefineRole';
import AddRole from './Components/Admin/AddRole';
import AuditTrails from './Components/Admin/AuditTrail/AuditTrails';
import LoanListing from './Components/Lender/LoanListing';
// import UploadStatement from './Components/UploadStatement';

import ViewAllLoanRequests from './Components/Borrower/ViewAllLoanRequests';
import GetPermissions from './Components/Admin/GetPermissions';
import AgreementSign from './Components/Borrower/AgreementSign';
import AllFundedLoans from './Components/Lender/AllFundedLoans';
import MyWallet from './Components/Lender/MyWallet';
import PayUmoney from './Components/Lender/PayUmoney';
import MyEarning from './Components/Lender/MyEarning';
import MyEarnings from './Components/Lender/MyEarnings';
// import ViewActiveLoans from './Components/ViewActiveLoans';
// import ViewClosedLoans from './Components/ViewClosedLoans';
import ForgotPassword from './Components/Others/ForgotPassword';
import BorrowerTransactions from './Components/Borrower/BorrowerTransactions';
import LenderTransactions from './Components/Lender/LenderTransactions';
import BorAccStatement from './Components/Borrower/BorAccStatement';
import FutureEarning from './Components/Lender/FutureEarning';
import ViewAgreement from './Components/Borrower/ViewAgreement';
import LoginViaDigilocker from './Components/Registration/LoginViaDigilocker';
import LoanClosureBalance from './Components/Borrower/LoanClosureBalance';
import ChangePassword from './Components/Others/ChangePassword';
import VideoKYC from './Components/VideoKYC';
import PayDues from './Components/Borrower/PayDues';
import PayEMI from './Components/Borrower/PayEMI';
import LenderPreference from './Components/Lender/LenderPreference';
import GetLenderPreferenceOptions from './Components/Lender/GetLenderPreferenceOptions';
import AutoInvestment from './Components/Lender/AutoInvestment';
import Support from './Components/Borrower/Support/Support';
import LndSupport from './Components/Lender/Support/LndSupport'
import CustomerSupport from './Components/Admin/CustomerSupport';
import SupportTcktDetails from './Components/Admin/SupportTcktDetails';
import PaymentQRCode from './Components/Lender/PaymentQRCode';
import PaymentQRCodeDue from './Components/Borrower/PaymentQRCodeDue';
import PaymentQRCodeEmi from './Components/Borrower/PaymentQRCodeEmi';
// import SystemLogin from './Components/SystemLogin';
import FacilitatorDashboard from './Components/Facilitator/FacilitatorDashboard';
// import FacRegister from './Components/Facilitator/FacRegister';
import FacReferenceDetails from './Components/Facilitator/FacReferenceDetails';
import FacDetails from './Components/Facilitator/FacDetails';
import EditFacBankDetails from './Components/Facilitator/EditFacBankDetails';
import EditFacAddressDetails from './Components/Facilitator/EditFacAddressDetails';
import LoanMonitoring from './Components/Facilitator/LoanMonitoring';
import LoanMBorDetails from './Components/Facilitator/LoanMBorDetails';
import CustomerOnboarding from './Components/Facilitator/Onboarding/CustomerOnboarding';
import OnboardRegister from './Components/Facilitator/Onboarding/OnboardRegister';
import OnboardAadharQR from './Components/Facilitator/Onboarding/OnboardAadharQr';
import OnboardOfflineAadhar from './Components/Facilitator/Onboarding/OnboardOfflineAadhar';

import ReferenceDetails from './Components/Admin/ReferenceDetails';
import PayLndDues from './Components/Lender/PayLndDues';
import PaymentQRCodeLndDue from './Components/Lender/PaymentQRCodeLndDue';
import EvaluatorDashboard from './Components/Evaluator/EvaluatorDashboard';
import ViewAllLoans from './Components/Borrower/ViewAllLoans';
import PaymentQRCodeFacDue from './Components/Facilitator/PaymentQRCodeFacDue';
import PaymentQRCodeEvlDue from './Components/Evaluator/PaymentQRCodeEvlDue';
import PayFacDues from './Components/Facilitator/PayFacDues';
import PayEvlDues from './Components/Evaluator/PayEvlDues';
import BorrowerProfileVerification from './Components/Facilitator/BorrowerProfileVerification';
import EvaluatorPreference from './Components/Evaluator/EvaluatorPreference';
import VerifyBorProfile from './Components/Facilitator/VerifyBorProfile';
import GetEvaluatorLoans from './Components/Evaluator/GetEvaluatorLoans';
import EvaluatorDetails from './Components/Evaluator/EvaluatorDetails';
import EditEvaAddressDetails from './Components/Evaluator/EditEvaAddressDetails';
import EditEvaBankDetails from './Components/Evaluator/EditEvaBankDetails';
import EvaReferenceDetails from './Components/Evaluator/EvaReferenceDetails';
import EvalCreditAppraisal from './Components/Evaluator/EvalCreditAppraisal';
import DownloadStatement from './Components/Others/DownloadStatement';
import UserManagement from './Components/Admin/UserManagement';

import EditBorPersonalDetails from './Components/Borrower/EditBorPersonalDetails'
import EditBorAddressDetails from './Components/Borrower/EditBorAddressDetails';
import EditBorBankDetails from './Components/Borrower/EditBorBankDetails';
import EditLndPersonalDetails from './Components/Lender/EditLndPersonalDetails';
import EditLndAddressDetails from './Components/Lender/EditLndAddressDetails';
import EditLndBankDetails from './Components/Lender/EditLndBankDetails';
import SysUserDashboard from './Components/SystemUser/SysUserDashboard';
import SuspenceTransaction from './Components/SystemUser/SuspenceTransaction';
import RegSysUserAsFacEval from './Components/SystemUser/RegSysUserAsFacEval';
import FacEvlList from './Components/SystemUser/FacEvlList';

import EditLndNomineeDetails from './Components/Lender/EditLndNomineeDetails';
import FacWallet from './Components/Facilitator/FacWallet';
import SysUserRefDetails from './Components/SystemUser/SysUserRefDetails';
import EvalWallet from './Components/Evaluator/EvalWallet';
import Registration from './Components/Registration/Registration';
import ManualRegistration from './Components/Registration/ManualRegistration';
import ChangeEmailMobile from './Components/Others/ChangeEmailMobile';
import KycVerification from './Components/SystemUser/KycVerification';
import CustomerJoin from './Components/Others/CustomerJoin';
import AgentJoin from './Components/SystemUser/AgentJoin';
import BulkRegistration from './Components/Admin/BulkUploadUsers';
import VerifyRefDetails from './Components/SystemUser/VerifyRefDetails';
import AdminTransactions from './Components/Admin/AdminTransactions'
import LndEmiDetails from './Components/Lender/LndEmiDetails'
import ViewUser from './Components/Admin/ViewUser'
import EditSysUser from './Components/Admin/EditSysUser';
import RepaySchedule from './Components/Borrower/RepaySchedule';
import ExtStmtInfo from './Components/Evaluator/ExtStmtInfo';
import UpdateStmt from './Components/Evaluator/UpdateStmt';
import AssistLoanRequest from './Components/Facilitator/AssistLoanRequest';
import OfflineKyc from './Components/Registration/OfflineKyc';
import AadharQR from './Components/Registration/AadharQR';

import ProductConfiguration from './Components/SystemUser/ProductConfig/ProductConfiguration';
import CreateProductType from './Components/SystemUser/ProductConfig/CreateProductType';
import LoanPurposeGroup from './Components/SystemUser/ProductConfig/LoanPurposeGroup';
import CreateLoanPurpose from './Components/SystemUser/ProductConfig/CreateLoanPurpose';
import ProductType from './Components/SystemUser/ProductConfig/ProductType';
import ProductCreation from './Components/SystemUser/ProductConfig/ProductCreation';
import CreateLoanPurposeGroup from './Components/SystemUser/ProductConfig/CreateLoanPurposeGroup';

import MemberGroup from './Components/SystemUser/ProductConfig/MemberGroup/MemberGroup'
import CreateMemberGroup from './Components/SystemUser/ProductConfig/MemberGroup/CreateMemberGroup'

import ProductDefinition from './Components/SystemUser/ProductConfig/ProductDefinition/ProductDefinition';
import ProductAttribute from './Components/SystemUser/ProductConfig/ProductDefinition/ProductAttribute';
import SetProductDefAmt from './Components/SystemUser/ProductConfig/ProductDefinition/SetProductDefAmt';
import SetProductDefFund from './Components/SystemUser/ProductConfig/ProductDefinition/SetProductDefFund';
import SetProductDefGrace from './Components/SystemUser/ProductConfig/ProductDefinition/SetProductDefGrace';
import SetProductDefInterest from './Components/SystemUser/ProductConfig/ProductDefinition/SetProductDefInterest';
import SetProductDefRepayment from './Components/SystemUser/ProductConfig/ProductDefinition/SetProductDefRepayment';
import SetProductPurpose from './Components/SystemUser/ProductConfig/ProductDefinition/SetProductPurpose';

import ProductDefinitions from './Components/Admin/ApproveProductDefinition/ProductDefinitions';
import ProductAttributes from './Components/Admin/ApproveProductDefinition/ProductAttributes';
import AuthorizeProduct from './Components/Admin/ApproveProductDefinition/AuthorizeProduct';
import SetProductDefAmts from './Components/Admin/ApproveProductDefinition/SetProductDefAmts';
import SetProductDefFunds from './Components/Admin/ApproveProductDefinition/SetProductDefFunds';
import SetProductDefGraces from './Components/Admin/ApproveProductDefinition/SetProductDefGraces';
import SetProductDefInterests from './Components/Admin/ApproveProductDefinition/SetProductDefInterests';
import SetProductDefRepayments from './Components/Admin/ApproveProductDefinition/SetProductDefRepayments';

import AuthorizeProductPurpose from './Components/Admin/ApproveProductDefinition/ApproveProductPurpose/AuthorizeProductPurpose';
import RegFacEvlList from './Components/Admin/RegFacEvlList';

import CusSupport from './Components/Facilitator/Customer/CustomerSupport';
import CreateRole from './Components/Admin/CreateRole/CreateRole'
import ManageClients from './Components/Admin/CreateRole/ManageClients';
import ManagePermissions from './Components/Admin/CreateRole/ManagePermissions';

import EmiCalculator from './Components/Registration/EmiCalculator';
import ViewLoanRequests from './Components/Facilitator/ViewLoanRequests';
import AssistSignAgreement from './Components/Facilitator/Customer/AssistSignAgreement';
import AssignUnassign from './Components/Admin/CreateRole/AssignUnassign';
import FinancialData from './Components/Admin/Financial/FinancialData';
import JlgVerify from './Components/SystemUser/JlgVerify/JlgVerify';
import VerifyProfile from './Components/SystemUser/JlgVerify/VerifyProfile';
import PreEvalVerification from './Components/SystemUser/PreEvaluation/PreEvalVerification';
import VerifyPreProfile from './Components/SystemUser/PreEvaluation/VerifyPreProfile';

import SysUserCustomerSupport from './Components/SystemUser/CustomerSupport/SysUserCustomerSupport';
import SysuserSupportTcktDetails from './Components/SystemUser/CustomerSupport/SysuserSupportTcktDetails';

import SysRejectedLoans from './Components/SystemUser/SysRejectReview/SysRejectedLoans';
import AssistViewStmt from './Components/Facilitator/Customer/AssistViewStmt';
import AssistRepaySchedule from './Components/Facilitator/Customer/AssistRepaySchedule';
import SysUserGrievReport from './Components/SystemUser/CustomerSupport/SysUserGrievReport';
import PlatformPSign from './Components/SystemUser/PlatformPendingSign/PlatfromPSign';
import PendingOvd from './Components/SystemUser/PlatformPendingSign/PendingOvd';
import GiAccountBlc from './Components/SystemUser/PlatformPendingSign/GiAccountBlc';
import Reconcilation from './Components/SystemUser/CustomerSupport/Reconcilation';
import SuspenseReconcilation from './Components/SystemUser/CustomerSupport/SuspenseReconcilation';
import GetWorkflowList from './Components/SystemUser/Workflow/GetWorkflowList';
import CreateWorkflow from './Components/SystemUser/Workflow/CreateWorkflow';
import ESign from './Components/Borrower/Esign';
import LoanReqWorkflow from './Components/SystemUser/Workflow/LoanReqWorkflow';

import FacSupport from './Components/Facilitator/Support/Support';
import EvlSupport from './Components/Evaluator/Support/Support';
import FacilitatorReassign from './Components/SystemUser/PlatformPendingSign/FacilitatorReassign';
import SelectRegistration from './Components/Registration/SelectRegistration';
import EntityRegistration from './Components/Registration/EntityRegistration';
import viewSanctLetter from './Components/Borrower/ViewSancLetter';
import { Provider } from "react-redux";
import { createStore } from "redux";
import { reducer as rootReducer } from "redux-form";

import KycSessionList from './Components/SystemUser/VkycSession/KycSessionList';
import SessionActivites from './Components/SystemUser/VkycSession/SessionActivities';

import PmManagePermission from './Components/PM/CreateRole/PmManagePermissions';
import PMManagement from './Components/SuperAdmin/PMManagement';
import PartnerEarnings from './Components/Admin/Financial/PartnerEarnings';
import UpdateSysUserProfile from './Components/Admin/UpdateSysUserProfile';
import CommBreakdown from './Components/Admin/Financial/CommBreakdown';
import CreatePartner from './Components/SuperAdmin/CreatePartner';
import PMPerformance from './Components/Admin/Financial/PMPerformance';
import CheckerPendingOpt from './Components/Admin/CreateRole/CheckerPendingOpt';
import SupportDesk from './Components/About/SupportDesk';
import JournalEntries from './Components/SystemUser/JournalEntries/JournalEntries';
import JournalDetails from './Components/SystemUser/JournalEntries/JournalDetails';
import WorkflowHierarchy from './Components/SystemUser/WorkflowHierarchy/WorkflowHierarchy';
import DisbursementAprvl from './Components/SystemUser/PreEvaluation/DisbursementAprvl';
import CreateOffice from './Components/Admin/Office/CreateOffice';
import SchedulerMonitoring from './Components/SystemUser/WorkflowHierarchy/SchedulerMonitoring';
import SupplierList from './Components/SystemUser/SupplierList';
import MemberVerification from './Components/Registration/MemberVerification';
import PendingEntityList from './Components/SystemUser/Entity/PendingEntityList';

const AppWrapper = () => {
  const store = createStore(rootReducer);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loginStatus: false
    }
  }

  componentDidMount() {
    if (sessionStorage.getItem('status') == 'Success') {
      this.setState({ loginStatus: true })
    }
  }

  loginCallback = (loginData) => {
    console.log(loginData);
    this.setState({ loginStatus: loginData })
  }
  logoutCallback = (loginData) => {
    this.setState({ loginStatus: loginData })
  }

  render() {

    return (
      <Router>
        <div className="App">
          <Nav logoutCallback={this.logoutCallback} loginStatus={this.state.loginStatus} />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/borrow" component={Borrow} />
            <Route path="/about" component={About} />
            <Route path="/howitworks" component={HowItWorks} />
            {/* <Route path="/marketplace" component={MarketPlace} /> */}
            <Route path="/faq" component={FAQ} />
            <Route path="/contact" component={Contact} />
            <Route path="/login" render={(props) => (
              <Login {...props} loginCallback={this.loginCallback} />
            )} />
            <Route path="/register" component={Register} />
            <Route path="/lenderDetails" component={LenderDetails} />
            <Route path="/borrowerDetails" component={BorrowerDetails} />
            <Route path="/thankyou" component={ThankYou} />
            <Route path="/admin" component={Admin} />
            <Route path="/landing" component={Landing} />
            <Route path="/users" component={Users} />
            <Route path="/organization" component={Organization} />
            <Route path="/system" component={System} />
            <Route path="/Products" component={Products} />
            <Route path="/templates" component={Templates} />
            <Route path="/createUser" component={CreateUser} />
            <Route path="/clients" component={Clients} />
            <Route path="/createclient" component={CreateClient} />
            <Route path="/lenderdashboard" component={LenderDashboard} />
            <Route path="/borrowerdashboard" component={BorrowerDashboard} />
            <Route path="/loanRequest" component={LoanRequest} />
            <Route path="/loanListing" component={LoanListing} />
            <Route path="/defineRole" component={DefineRole} />
            <Route path="/addRole" component={AddRole} />
            {/* <Route path="/uploadStatement" component={UploadStatement} /> */}

            <Route path="/viewAllLoanRequests" component={ViewAllLoanRequests} />
            <Route path="/getPermissions" component={GetPermissions} />
            <Route path="/agreementSign" component={AgreementSign} />
            <Route path="/allFundedLoans" component={AllFundedLoans} />
            <Route path="/myWallet" component={MyWallet} />
            <Route path="/myEarning" component={MyEarning} />
            <Route path="/myEarnings" component={MyEarnings} />
            <Route path="/viewAllLoans" component={ViewAllLoans} />
            {/* <Route path="/viewActiveLoans" component={ViewActiveLoans} /> */}
            {/* <Route path="/viewClosedLoans" component={ViewClosedLoans} /> */}
            <Route path="/forgotPassword" component={ForgotPassword} />
            <Route path="/borrowerTransactions" component={BorrowerTransactions} />
            <Route path="/lenderTransactions" component={LenderTransactions} />
            <Route path="/borAccStatement" component={BorAccStatement} />
            <Route path="/futureEarning" component={FutureEarning} />
            <Route path="/viewAgreement" component={ViewAgreement} />
            <Route path="/loginViaDigilocker" component={LoginViaDigilocker} />
            <Route path="/loanClosureBalance" component={LoanClosureBalance} />
            <Route path="/changePassword" component={ChangePassword} />
            <Route path="/changeEmailMobile" component={ChangeEmailMobile} />
            <Route path="/videoKYC" component={VideoKYC} />
            <Route path="/customerJoin" component={CustomerJoin} />
            <Route path="/payUmoney" component={PayUmoney} />
            <Route path="/payDues" component={PayDues} />
            <Route path="/PayEMI" component={PayEMI} />
            <Route path="/payLndDues" component={PayLndDues} />
            <Route path="/payFacDues" component={PayFacDues} />
            <Route path="/payEvlDues" component={PayEvlDues} />
            <Route path="/lenderPreference" component={LenderPreference} />
            <Route path="/getLenderPreferenceOptions" component={GetLenderPreferenceOptions} />
            <Route path="/autoInvestment" component={AutoInvestment} />
            <Route path="/support" component={Support} />
            <Route path="/lndSupport" component={LndSupport} />
            <Route path="/customerSupport" component={CustomerSupport} />
            <Route path="/supportTcktDetails" component={SupportTcktDetails} />
            <Route path="/paymentQRCode" component={PaymentQRCode} />
            <Route path="/paymentQRCodeDue" component={PaymentQRCodeDue} />
            <Route path="/paymentQRCodeEmi" component={PaymentQRCodeEmi} />
            <Route path="/paymentQRCodeLndDue" component={PaymentQRCodeLndDue} />
            <Route path="/paymentQRCodeFacDue" component={PaymentQRCodeFacDue} />
            <Route path="/paymentQRCodeEvlDue" component={PaymentQRCodeEvlDue} />
            {/* <Route path="/systemLogin" render={(props) => (
              <SystemLogin {...props} loginCallback={this.loginCallback} />
            )} /> */}
            <Route path="/facilitatorDashboard" component={FacilitatorDashboard} />
            {/* <Route path="/facRegister" component={FacRegister} /> */}
            <Route path="/facreferenceDetails" component={FacReferenceDetails} />
            <Route path="/facDetails" component={FacDetails} />
            <Route path="/loanMonitoring" component={LoanMonitoring} />
            <Route path="/loanmbordetails" component={LoanMBorDetails} />
            <Route path="/customerOnboarding" component={CustomerOnboarding} />
            <Route path="/onboardRegister" component={OnboardRegister} />
            <Route path="/onboardOfflineAadhar" component={OnboardOfflineAadhar} />
            <Route path="/onboardAadharQR" component={OnboardAadharQR} />


            <Route path="/editFacBankDetails" component={EditFacBankDetails} />
            <Route path="/editFacAddressDetails" component={EditFacAddressDetails} />
            <Route path="/referenceDetails" component={ReferenceDetails} />
            <Route path="/evaluatorDashboard" component={EvaluatorDashboard} />
            <Route path="/evaluatorPreference" component={EvaluatorPreference} />
            <Route path="/borrowerProfileVerification" component={BorrowerProfileVerification} />
            <Route path="/verifyBorProfile" component={VerifyBorProfile} />
            <Route path="/getEvaluatorLoans" component={GetEvaluatorLoans} />
            <Route path="/evaluatorDetails" component={EvaluatorDetails} />
            <Route path="/evaReferenceDetails" component={EvaReferenceDetails} />
            <Route path="/editEvaBankDetails" component={EditEvaBankDetails} />
            <Route path="/editEvaAddressDetails" component={EditEvaAddressDetails} />
            <Route path="/evalCreditAppraisal" component={EvalCreditAppraisal} />
            <Route path="/downloadStatement" component={DownloadStatement} />
            <Route path="/userManagement" component={UserManagement} />

            <Route path="/editBorPersonalDetails" component={EditBorPersonalDetails} />
            <Route path="/editBorAddressDetails" component={EditBorAddressDetails} />
            <Route path="/editBorBankDetails" component={EditBorBankDetails} />
            <Route path="/editLndPersonalDetails" component={EditLndPersonalDetails} />
            <Route path="/editLndAddressDetails" component={EditLndAddressDetails} />
            <Route path="/editLndBankDetails" component={EditLndBankDetails} />
            <Route path="/editLndNomineeDetails" component={EditLndNomineeDetails} />
            <Route path="/sysUserDashboard" component={SysUserDashboard} />
            <Route path="/suspenceTransaction" component={SuspenceTransaction} />
            <Route path="/regSysUserAsFacEval" component={RegSysUserAsFacEval} />
            <Route path="/facEvlList" component={FacEvlList} />
            <Route path="/regFacEvlList" component={RegFacEvlList} />
            <Route path="/facWallet" component={FacWallet} />
            <Route path="/evalWallet" component={EvalWallet} />
            <Route path="/sysUserRefDetails" component={SysUserRefDetails} />
            <Route path="/registration" component={Registration} />
            <Route path="/manualRegistration" component={ManualRegistration} />
            <Route path="/kycVerification" component={KycVerification} />
            <Route path="/customerJoin" component={CustomerJoin} />
            <Route path="/agentJoin" component={AgentJoin} />
            <Route path="/BulkUploadUsers" component={BulkRegistration} />
            <Route path="/verifyRefDetails" component={VerifyRefDetails} />
            <Route path="/adminTransactions" component={AdminTransactions} />
            <Route path="/auditTrails" component={AuditTrails} />
            <Route path="/lndEmiDetails" component={LndEmiDetails} />
            <Route path="/viewuser" component={ViewUser} />
            <Route path="/EditSysUser" component={EditSysUser} />
            <Route path="/repaySchedule" component={RepaySchedule} />
            <Route path="/extStmtInfo" component={ExtStmtInfo} />
            <Route path="/updtStmt" component={UpdateStmt} />
            <Route path="/assistLoanrequest" component={AssistLoanRequest} />
            <Route path="/offlineKyc" component={OfflineKyc} />
            <Route path="/aadharQr" component={AadharQR} />

            <Route path="/productConfiguration" component={ProductConfiguration} />
            <Route path="/createProductType" component={CreateProductType} />
            <Route path="/loanPurposeGroup" component={LoanPurposeGroup} />
            <Route path="/createLoanPurpose" component={CreateLoanPurpose} />
            <Route path="/productType" component={ProductType} />
            <Route path="/productCreation" component={ProductCreation} />
            <Route path="/createLoanpurposegroup" component={CreateLoanPurposeGroup} />

            <Route path="/membergroup" component={MemberGroup} />
            <Route path="/createMembergroup" component={CreateMemberGroup} />
            <Route path="/productDefinition" component={ProductDefinition} />
            <Route path="/productAttribute" component={ProductAttribute} />
            <Route path="/setproductdefAmt" component={SetProductDefAmt} />
            <Route path="/setproductdefFund" component={SetProductDefFund} />
            <Route path="/setproductdefGrace" component={SetProductDefGrace} />
            <Route path="/setproductdefInterest" component={SetProductDefInterest} />
            <Route path="/setproductdefRepayment" component={SetProductDefRepayment} />
            <Route path="/setproductPurpose" component={SetProductPurpose} />
            <Route path="/productDefinitions" component={ProductDefinitions} />
            <Route path="/productAttributes" component={ProductAttributes} />
            <Route path="/authorizeProduct" component={AuthorizeProduct} />

            <Route path="/setproductdefAmts" component={SetProductDefAmts} />
            <Route path="/setproductdefFunds" component={SetProductDefFunds} />
            <Route path="/setproductdefGraces" component={SetProductDefGraces} />
            <Route path="/setproductdefInterests" component={SetProductDefInterests} />
            <Route path="/setproductdefRepayments" component={SetProductDefRepayments} />
            <Route path="/authorizeProductpurpose" component={AuthorizeProductPurpose} />
            <Route path="/customer" component={CusSupport} />
            <Route path="/emiCalc" component={EmiCalculator} />
            <Route path="/assistSignAgreement" component={AssistSignAgreement} />
            <Route path="/sysSupportTckt" component={SysuserSupportTcktDetails} />
            <Route path="/sysCusSupport" component={SysUserCustomerSupport} />
            <Route path="/assistViewStmt" component={AssistViewStmt} />
            <Route path="/assistrepaySchedule" component={AssistRepaySchedule} />
            <Route path="/grievanceReport" component={SysUserGrievReport} />

            <Route path="/createRole" component={CreateRole} />
            <Route path="/manageClients" component={ManageClients} />
            <Route path="/managePermissions" component={ManagePermissions} />
            <Route path="/facViewLoanreq" component={ViewLoanRequests} />
            <Route path="/assignRole" component={AssignUnassign} />
            <Route path="/sysRejectedLoans" component={SysRejectedLoans} />
            {/* <Route path="/lenderDocuments" component={Documents} />
            <Route path="/borDocuments" component={BorDocuments} />
            <Route path="/facDocuments" component={FacDocuments} />
            */}
            <Route path="/platformPsign" component={PlatformPSign} />
            <Route path="/ovdPendingStatus" component={PendingOvd} />
            <Route path="/glAccountBlc" component={GiAccountBlc} />
            <Route path="/reconcilationList" component={Reconcilation} />
            <Route path="/suspenseTransactions" component={SuspenseReconcilation} />
            <Route path="/getWorkflow" component={GetWorkflowList} />
            <Route path="/createWorkflow" component={CreateWorkflow} />

            <Route path="/selectRegistration" component={SelectRegistration} />
            <Route path="/enitityReg" component={EntityRegistration} />
            <Route path="/viewSancLetter" component={viewSanctLetter} />
            <Route path="/facReassign" component={FacilitatorReassign} />
            <Route path="/facSupport" component={FacSupport} />
            <Route path="/evlSupport" component={EvlSupport} />
            <Route path="/financialData" component={FinancialData} />
            <Route path="/jlgverify" component={JlgVerify} />
            <Route path="/verifyProfile" component={VerifyProfile} />
            <Route path="/preEvlVerify" component={PreEvalVerification} />
            <Route path="/verifyPreProfile" component={VerifyPreProfile} />
            <Route path="/kycSessionList" component={KycSessionList} />
            <Route path="/sessionActivites" component={SessionActivites} />
            <Route path="/ddeSign" component={ESign} />
            <Route path="/loanRequestWorkflow" component={LoanReqWorkflow} />

            <Route path="/commBreakdown" component={CommBreakdown} />
            <Route path="/updateSysProfile" component={UpdateSysUserProfile} />
            <Route path="/pmManagement" component={PMManagement} />
            <Route path="/pmmanagePermissions" component={PmManagePermission} />
            <Route path="/partnerEarnings" component={PartnerEarnings} />
            <Route path="/createPartner" component={CreatePartner} />
            <Route path="/pmPerformance" component={PMPerformance} />
            <Route path="/checkerPendingList" component={CheckerPendingOpt} />
            <Route path="/supportDesk" component={SupportDesk} />
            <Route path="/journalEntries" component={JournalEntries} />
            <Route path="/jeDetails" component={JournalDetails} />
            <Route path="/wkflowhierarchy" component={WorkflowHierarchy} />
            <Route path="/disbursementApproval" component={DisbursementAprvl} />
            <Route path="/createOffice" component={CreateOffice} />
            <Route path="/schedulerMonitoring" component={SchedulerMonitoring} />
            <Route path="/supplierList" component={SupplierList} />
            <Route path="/memberVerification" component={MemberVerification} />
            <Route path="/pendingEntityList" component={PendingEntityList} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default AppWrapper;