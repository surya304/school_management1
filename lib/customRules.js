
const companyName = "School"
const companyLogo =
  "https://storage.googleapis.com/sites60-prod/assets/logo.svg";

const verificationRules = [
  {
    role: "owner",
    verify_email: false,
    verify_phone: false,
    verify_onboard: false,
    verify_revoke: true,
    sms_gateway: "firebase", //firebase or //internal
  },
  {
    role: "customer",
    verify_email: false,
    verify_phone: false,
    verify_onboard: false,
    verify_revoke: true,
    sms_gateway: "firebase",
  },
];



module.exports = {
  verificationRules, companyName, companyLogo
}
