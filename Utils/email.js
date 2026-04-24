// const nodemailer = require('nodemailer')

// const sendEmail = async (option)=>{





//   // ── 1. Load & compile HTML template ──────────────────────────────────────
//   const templatePath = path.join(__dirname, 'email_template.html');
//   const rawTemplate  = fs.readFileSync(templatePath, 'utf8');
 
//   const html = compileTemplate(rawTemplate, {
//     firstname:      options.firstname      || 'Valued Customer',
//     email:          options.email          || '',
//     date:           new Date().toLocaleDateString('en-GB', {
//                       day: 'numeric', month: 'long', year: 'numeric'
//                     }),
//     loginUrl:       options.loginUrl       || 'https://westernzurichbank.com/login',
//     unsubscribeUrl: options.unsubscribeUrl || 'https://westernzurichbank.com/unsubscribe',
//     privacyUrl:     options.privacyUrl     || 'https://westernzurichbank.com/privacy',
//     termsUrl:       options.termsUrl       || 'https://westernzurichbank.com/terms',
//   });





//     //creat a transporter

//     const transporter = nodemailer.createTransport({
//         host:process.env.EMAIL_HOST,
//         port:process.env.EMAIL_PORT,
//         secure: true, 
//         auth :{
//             user:process.env.EMAIL_USER,
//             pass:process.env.EMAIL_PASSWORD
//         },
//         //  logger: true,  
//         // debug: true  
//     })


//     //DEFINE EMAIL OPTION

//  const emailOptions = {
//    from : `West Zurich <${process.env.EMAIL_USER}>`,
//    to:option.email,
//    subject:option.subject,
//    text:option.message
//  }


//  await transporter.sendMail(emailOptions);

// }



// module.exports= sendEmail;




















// const nodemailer = require('nodemailer');

// /**
//  * Replaces {{placeholder}} tokens in the HTML template string.
//  */
// const compileTemplate = (template, variables = {}) => {
//   return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || '');
// };

// // ── Pre-load all templates (bundled as JS modules) ────────────────────────
// const templates = {
//   otp:              require('./templates/otp_template'),
//   support:          require('./templates/support_template'),
//   support_internal: require('./templates/support_internal_template'),
//   credit:           require('./templates/credit_template'),
//   debit:            require('./templates/debit_template'),
//   email:            require('./templates/email_template'),
// };

// const sendEmail = async (option) => {

//   // ── 1. Load & compile HTML template ──────────────────────────────────────
//   const isOtp      = option.templateName === 'otp';
//   const isSupport  = option.templateName === 'support';
//   const isInternal = option.templateName === 'support_internal';
//   const isCredit   = option.templateName === 'credit';
//   const isDebit    = option.amountTransferred !== undefined;

//   const templateKey = isOtp      ? 'otp'              :
//                       isSupport  ? 'support'          :
//                       isInternal ? 'support_internal' :
//                       isCredit   ? 'credit'           :
//                       isDebit    ? 'debit'            :
//                                    'email';

//   const rawTemplate = templates[templateKey];

//   const html = compileTemplate(rawTemplate, {
//     // shared
//     firstname:         option.firstname         || 'Valued Customer',
//     lastname:          option.lastname          || '',
//     email:             option.email             || '',
//     date:              new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
//     logoUrl:           process.env.LOGO_URL     || '',
//     privacyUrl:        option.privacyUrl        || 'https://westernzurich.online/privacy',
//     termsUrl:          option.termsUrl          || 'https://westernzurich.online/terms',
//     // welcome template
//     loginUrl:          option.loginUrl          || 'https://westernzurich.online/login',
//     unsubscribeUrl:    option.unsubscribeUrl    || 'https://westernzurich.online/unsubscribe',
//     // debit / credit template
//     amountTransferred: option.amountTransferred || '0.00',
//     newBalance:        option.newBalance        || '0.00',
//     beneficiaryName:   option.beneficiaryName   || '',
//     accountNumber:     option.accountNumber     || '',
//     bankName:          option.bankName          || '',
//     purposeOfTransfer: option.purposeOfTransfer || '',
//     type:              option.type              || '',
//     // otp template
//     otp:               option.otp               || '',
//     // support / internal template
//     ticketId:          option.ticketId          || '',
//     title:             option.title             || '',
//     category:          option.category          || '',
//     priority:          option.priority          || '',
//     description:       option.description       || '',
//   });

//   // ── 2. Create transporter ─────────────────────────────────────────────────
//   const transporter = nodemailer.createTransport({
//     host:   process.env.EMAIL_HOST,
//     port:   Number(process.env.EMAIL_PORT) || 587,
//     secure: true,  // true only for port 465
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//     // logger: true,
//     // debug: true,
//   });

//   // ── 3. Define email options ───────────────────────────────────────────────
//   const emailOptions = {
//     from:    `"Western Zurich Bank" <${process.env.EMAIL_USER}>`,
//     to:      option.email,
//     subject: option.subject,
//     text:    option.message,
//     html,                       // ← HTML body injected here
//   };

//   await transporter.sendMail(emailOptions);
// };

// module.exports = sendEmail;



const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

/**
 * Replaces {{placeholder}} tokens in the HTML template string.
 */
const compileTemplate = (template, variables = {}) => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || '');
};

// ── Pre-load all templates from .html files ───────────────────────────────
const loadTemplate = (name) =>
  fs.readFileSync(path.join(__dirname, 'templates', name), 'utf-8');

const templates = {
  otp:              loadTemplate('otp_template.html'),
  support:          loadTemplate('support_template.html'),
  support_internal: loadTemplate('support_internal_template.html'),
  credit:           loadTemplate('credit_template.html'),
  debit:            loadTemplate('debit_template.html'),
  email:            loadTemplate('email_template.html'),
};

const sendEmail = async (option) => {

  // ── 1. Load & compile HTML template ──────────────────────────────────────
  const isOtp      = option.templateName === 'otp';
  const isSupport  = option.templateName === 'support';
  const isInternal = option.templateName === 'support_internal';
  const isCredit   = option.templateName === 'credit';
  const isDebit    = option.amountTransferred !== undefined;

  const templateKey = isOtp      ? 'otp'              :
                      isSupport  ? 'support'          :
                      isInternal ? 'support_internal' :
                      isCredit   ? 'credit'           :
                      isDebit    ? 'debit'            :
                                   'email';

  const rawTemplate = templates[templateKey];

  const html = compileTemplate(rawTemplate, {
    // shared
    firstname:         option.firstname         || 'Valued Customer',
    lastname:          option.lastname          || '',
    email:             option.email             || '',
    date:              new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    logoUrl:           process.env.LOGO_URL     || '',
    privacyUrl:        option.privacyUrl        || 'https://westernzurich.online/privacy',
    termsUrl:          option.termsUrl          || 'https://westernzurich.online/terms',
    // welcome template
    loginUrl:          option.loginUrl          || 'https://westernzurich.online/login',
    unsubscribeUrl:    option.unsubscribeUrl    || 'https://westernzurich.online/unsubscribe',
    // debit / credit template
    amountTransferred: option.amountTransferred || '0.00',
    newBalance:        option.newBalance        || '0.00',
    beneficiaryName:   option.beneficiaryName   || '',
    accountNumber:     option.accountNumber     || '',
    bankName:          option.bankName          || '',
    purposeOfTransfer: option.purposeOfTransfer || '',
    type:              option.type              || '',
    // otp template
    otp:               option.otp               || '',
    // support / internal template
    ticketId:          option.ticketId          || '',
    title:             option.title             || '',
    category:          option.category          || '',
    priority:          option.priority          || '',
    description:       option.description       || '',
  });

  // ── 2. Create transporter ─────────────────────────────────────────────────
  const transporter = nodemailer.createTransport({
    host:   process.env.EMAIL_HOST,
    port:   Number(process.env.EMAIL_PORT) || 587,
    // secure: Number(process.env.EMAIL_PORT) === 465,  // true only for port 465
    secure: true,  // true only for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // ── 3. Define email options ───────────────────────────────────────────────
  const emailOptions = {
    from:    `"Western Zurich Bank" <${process.env.EMAIL_USER}>`,
    to:      option.email,
    subject: option.subject,
    text:    option.message,
    html,                       // ← HTML body injected here
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;