const { handleIdentifyRequest } = require('../services/contactService');

const identifyContact = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({
        error: 'At least one of email or phoneNumber must be provided.'
      });
    }

    const data = await handleIdentifyRequest({ email, phoneNumber });
    res.status(200).json({ contact: data });

  } catch (err) {
    console.error('Error in controller:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { identifyContact };
