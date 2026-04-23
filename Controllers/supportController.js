const Ticket = require('../model/SupportTickets');
const User = require('../model/User');
const asyncErrorHandler = require('../Utils/asyncErrorHandlers');
const CustomError = require('../Utils/CustomError');
const sendEmail = require('../Utils/email');

// Create support ticket
// const support = asyncErrorHandler(async (req, res, next) => {
//   // Validate required fields from React Hook Form data
//   const { title, category, priority, description } = req.body;
  
//   if (!title || !category || !priority || !description) {
//     return next(new CustomError('All fields (title, category, priority, description) are required', 400));
//   }


//  const user = await User.findOne({"_id": req._id})


// //   Assume req.user is set by auth middleware (e.g., JWT middleware)
//   if (!user) {
//     return next(new CustomError('User not found', 401));
//   }



//   // Create ticket document - map form fields and set user reference
//   const ticketData = {
//     User: req._id,  // ObjectId ref from authenticated user
//     title,
//     category,
//     priority,
//     description
//   };

//   const ticket = await Ticket.create(ticketData);

//   // Send confirmation email (customize as needed)
//   try {
//     await sendEmail({
//       email: user.email,
//       subject: 'Support Ticket Created',
//       message: `Your ticket "${title}" has been created successfully. We will respond soon. Ticket ID: ${ticket._id}`
//     });
//   } catch (emailError) {
//     console.error('Email send failed:', emailError);
//     // Don't fail the request if email fails
//   }

//   res.status(201).json({
//     status: 'success',
//     data: {
//       ticket,
//       message: 'Ticket created successfully. We will respond to you via email - check both junk and spam folders.'
//     }
//   });
// });

// module.exports = { support };



// Create support ticket
const support = asyncErrorHandler(async (req, res, next) => {
 
  const { title, category, priority, description } = req.body;
 
  if (!title || !category || !priority || !description) {
    return next(new CustomError('All fields (title, category, priority, description) are required', 400));
  }
 
  const user = await User.findOne({ "_id": req._id });
  if (!user) {
    return next(new CustomError('User not found', 401));
  }
 
  const ticket = await Ticket.create({
    User: req._id,
    title,
    category,
    priority,
    description,
  });
 
  // 1. Send confirmation email to customer
  try {
    await sendEmail({
      email:        user.email,
      firstname:    user.firstname,
      subject:      'Support Ticket Created',
      message:      `Your ticket "${title}" has been created. Ticket ID: ${ticket._id}`,
      templateName: 'support',
      ticketId:     ticket._id,
      title,
      category,
      priority,
      description,
    });
  } catch (emailError) {
    console.error('Customer email failed:', emailError);
  }
 
  // 2. Send internal notification to support team
  try {
    await sendEmail({
      email:        'contact@westernzurich.online',  // ← internal recipient
      firstname:    user.firstname,
      lastname:     user.lastname,
      subject:      `New Support Ticket: ${title}`,
      message:      `New ticket from ${user.firstname} ${user.lastname}. Ticket ID: ${ticket._id}`,
      templateName: 'support_internal',              // ← internal template
      ticketId:     ticket._id,
      title,
      category,
      priority,
      description,
    });
  } catch (emailError) {
    console.error('Internal notification email failed:', emailError);
  }
 
  res.status(201).json({
    status: 'success',
    data: {
      ticket,
      message: 'Ticket created successfully. We will respond to you via email - check both junk and spam folders.'
    }
  });
});
 
module.exports = { support };