import React from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as CgIcons from "react-icons/cg";
import * as GrIcons from "react-icons/gr";

export const SidebarData = [
    {
        title: "Home",
        path: "/borrowerdashboard",
        cName: "nav-text",
        icon: <AiIcons.AiFillHome />
    },
    {
        title: "Profile",
        path: "/borrowerDetails",
        cName: "nav-text",
        icon: <CgIcons.CgProfile />
    },
    {
        title: "Raise New Loan Request",
        path: "/loanRequest",
        cName: "nav-text",
        icon: <GrIcons.GrFormView />
    },
    {
        title: "View Loan Requests",
        path: "/viewAllLoanRequests",
        cName: "nav-text",
        icon: <GrIcons.GrFormView />
    },
    {
        title: "View All Loans",
        path: "/viewActiveLoans",
        cName: "nav-text",
        icon: <GrIcons.GrFormView />
    }

]