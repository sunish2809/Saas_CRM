const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID // Replace with your Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Replace with your Twilio Auth Token
const client = twilio(accountSid, authToken);
const { parsePhoneNumber } = require("libphonenumber-js");
exports.automateMessage = async (req, res) => {
  try {
    const { members } = req.body; // Receive members array
    const results = [];

    for (const member of members) {
      if (member.phone) {
        try {
          // Parse and convert phone number to E.164 format
          const phoneNumber = parsePhoneNumber(member.phone, "IN");
          if (phoneNumber.isValid()) {
            const formattedPhone = phoneNumber.number; // E.164 format

            const message = await client.messages.create({
              body: `Hello ${member.name}, your membership is inactive. Please renew it to continue enjoying our services.`,
              from: "8955962121", // Replace with your Twilio number
              to: formattedPhone,
            });

            results.push({ phone: formattedPhone, messageSid: message.sid });
          } else {
            results.push({
              phone: member.phone,
              error: "Invalid phone number format",
            });
          }
        } catch (error) {
          if (error.status === 429) {
            // Handle rate limit exceeded error
            results.push({
              phone: member.phone,
              error: "Rate limit exceeded. Please try again later.",
            });
          } else {
            results.push({
              phone: member.phone,
              error: "Failed to send message",
            });
          }
          console.error(`Error processing member ${member.phone}:`, error);
        }
      }
    }

    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send messages",
      error: error.message,
    });
  }
};
