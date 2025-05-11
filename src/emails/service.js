const nodemailer = require("nodemailer");

const sendStaffCredentials = (mail,password) => {
    const passwordMsg = {
        from: "ggsk027@gmail.com",
        to: mail,
        subject: `Retail Management Staff Credentials`,
        html: `<div><h4>Hi, Here is the staff credentials to login into Retail Management System<br>\n Mail: <b>${mail}</b><br> \n Password: <b>${password}</b> <br> \n Kindly keep this credentials safe and secure...</h4></div>`
    }

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ggsk027@gmail.com",
            pass: "qxyjiwuturnccieg"
        }
    });

    return new Promise((resolve, reject) => {
        transporter.sendMail(passwordMsg, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log("Email sent");
                resolve();
            }
        });
    });
};

const sendPasswordResetLink = (mail,link) => {
    const passwordMsg = {
        from: "ggsk027@gmail.com",
        to: mail,
        subject: `Retail Management Staff Credentials`,
        html:`<div><h4>Hi, Here is the link for reset password for your account in Retail management website\n kindly reset the password\n Note:The link is only vaild for fifteen minutes after that the link expries</h4><a href=${link}>Password reset link</a>`
     }

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ggsk027@gmail.com",
            pass: "qxyjiwuturnccieg"
        }
    });

    return new Promise((resolve, reject) => {
        transporter.sendMail(passwordMsg, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log("Email sent");
                resolve();
            }
        });
    });
};

const adminSignup = (mail) => {
    const passwordMsg = {
        from: "ggsk027@gmail.com",
        to: mail,
        subject: `Admin account registered at Retail Management`,
        html: `<div><h4>Hi, Your admin account at Retail Management system is successfully created...<br>\n </h4></div>`
    }

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ggsk027@gmail.com",
            pass: "qxyjiwuturnccieg"
        }
    });

    return new Promise((resolve, reject) => {
        transporter.sendMail(passwordMsg, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log("Email sent");
                resolve();
            }
        });
    });
};

const sendReceiptLink = (name,mail,link) => {
    const passwordMsg = {
        from: "ggsk027@gmail.com",
        to: mail,
        subject: `Transaction Receipt`,
        html:`<div><h4>Hi ${name}, Thanks for shopping at our Retail Shop. Please use the below link to get your transaction receipt pdf</h4><a href=${link}>Please click here</a>`
     }

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ggsk027@gmail.com",
            pass: "qxyjiwuturnccieg"
        }
    });

    return new Promise((resolve, reject) => {
        transporter.sendMail(passwordMsg, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log("Email sent");
                resolve();
            }
        });
    });
};

module.exports = {
    sendStaffCredentials,
    adminSignup,
    sendPasswordResetLink,
    sendReceiptLink
}