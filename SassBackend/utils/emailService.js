const nodemailer = require('nodemailer');

// Function to create transporter (lazy initialization)
const createTransporter = () => {
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();

  // Validate that credentials exist
  if (!smtpUser || !smtpPass) {
    throw new Error(
      'SMTP credentials are missing. Please set SMTP_USER and SMTP_PASS environment variables.'
    );
  }

  // Log configuration (without sensitive data) for debugging
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  console.log(`[Email Service] Using SMTP: ${smtpHost}:${process.env.SMTP_PORT || '587'}`);
  console.log(`[Email Service] SMTP_USER: ${smtpUser.substring(0, 3)}... (hidden)`);

  return nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} resetToken - Password reset token
 * @param {string} businessType - Business type (GYM, LIBRARY, etc.)
 * @returns {Promise}
 */
const sendPasswordResetEmail = async (email, resetToken, businessType) => {
  // Use FRONTEND_URL from env, or default to localhost for development
  // For local testing, set FRONTEND_URL=http://localhost:5173 in .env
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&business=${businessType}`;
  
  // Log the URL being used (helpful for debugging)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Email Service] Reset URL will point to: ${frontendUrl}`);
  }

  // Use FROM_EMAIL if set, otherwise use SMTP_USER
  const fromEmail = (process.env.FROM_EMAIL || process.env.SMTP_USER)?.trim();
  
  // Log the from email being used (for debugging)
  console.log(`[Email Service] From email: ${fromEmail}`);
  console.log(`[Email Service] Make sure this email is verified in SendGrid!`);
  
  if (!fromEmail) {
    throw new Error('FROM_EMAIL or SMTP_USER must be set in environment variables');
  }
  
  const mailOptions = {
    from: `"${process.env.APP_NAME || 'ManagePro'}" <${fromEmail}>`,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You have requested to reset your password for your <strong>${businessType}</strong> Management System account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you did not request this password reset, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'ManagePro'}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Password Reset Request
      
      You have requested to reset your password for your ${businessType} Management System account.
      
      Click the following link to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you did not request this password reset, please ignore this email.
    `,
  };

  try {
    // Create transporter when needed (lazy initialization)
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    
    // Provide more helpful error messages with troubleshooting tips
    if (error.message && error.message.includes('SMTP credentials are missing')) {
      throw new Error('Email service is not configured. Please contact support.');
    }
    
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
      let troubleshootingTip = '';
      
      // Provide specific troubleshooting based on the SMTP host
      if (smtpHost.includes('sendgrid')) {
        troubleshootingTip = '\n\nTroubleshooting for SendGrid:\n' +
          '1. SMTP_USER must be exactly "apikey" (not your email)\n' +
          '2. SMTP_PASS must be your full API key starting with "SG."\n' +
          '3. Make sure there are no extra spaces or quotes in your .env file\n' +
          '4. Verify your API key is active in SendGrid dashboard';
      } else if (smtpHost.includes('gmail')) {
        troubleshootingTip = '\n\nTroubleshooting for Gmail:\n' +
          '1. Use an App Password, not your regular password\n' +
          '2. Enable 2-Factor Authentication first\n' +
          '3. Generate App Password from: Google Account → Security → App Passwords';
      } else if (smtpHost.includes('resend')) {
        troubleshootingTip = '\n\nTroubleshooting for Resend:\n' +
          '1. SMTP_USER must be exactly "resend"\n' +
          '2. SMTP_PASS must be your API key starting with "re_"\n' +
          '3. Verify your API key in Resend dashboard';
      }
      
      throw new Error(`Email authentication failed. Please check your SMTP credentials.${troubleshootingTip}`);
    }
    
    // Handle SendGrid sender identity verification error
    if (error.code === 'EMESSAGE' || error.responseCode === 550) {
      const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
      const fromEmail = (process.env.FROM_EMAIL || process.env.SMTP_USER || 'not set')?.trim();
      
      if (smtpHost.includes('sendgrid')) {
        const errorMsg = 
          `SendGrid Sender Identity Error: The "from" address "${fromEmail}" is not verified.\n\n` +
          `Current FROM_EMAIL in .env: ${process.env.FROM_EMAIL || 'NOT SET'}\n` +
          `Current SMTP_USER in .env: ${process.env.SMTP_USER || 'NOT SET'}\n\n` +
          `To fix this:\n` +
          `1. Go to SendGrid Dashboard → Settings → Sender Authentication\n` +
          `2. Check "Verified Single Senders" - make sure your email is listed there\n` +
          `3. In your .env file, set FROM_EMAIL to match EXACTLY (case-sensitive):\n` +
          `   FROM_EMAIL=sunish.5186@gmail.com\n` +
          `4. Make sure there are NO quotes, NO spaces around the email\n` +
          `5. Restart your server after changing .env\n\n` +
          `Common mistakes:\n` +
          `- Using quotes: FROM_EMAIL="sunish.5186@gmail.com" ❌\n` +
          `- Extra spaces: FROM_EMAIL= sunish.5186@gmail.com ❌\n` +
          `- Wrong email: FROM_EMAIL=other@email.com ❌\n` +
          `- Correct: FROM_EMAIL=sunish.5186@gmail.com ✅`;
        
        throw new Error(errorMsg);
      }
    }
    
    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail,
};

