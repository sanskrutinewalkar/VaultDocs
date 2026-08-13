const speakeasy = require ("speakeasy");

const generateOTP = () =>{
    const secret = speakeasy.generateSecret({length:20});
    const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
        step: 300, //validation time period

    });
    return {otp, base32Secret: secret.base32};
};

const verifyOTP = (token , base32Secret) =>{
    return speakeasy.totp.verify({
        secret: base32Secret,
        encoding: 'base32',
        token,
        step: 300,
        window:1,
    });
};

module.exports = {generateOTP,verifyOTP};