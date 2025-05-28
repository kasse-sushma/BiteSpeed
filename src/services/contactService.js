const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();

const handleIdentifyRequest = async ({ email, phoneNumber }) => {
  if (!email && !phoneNumber) {
    throw new Error('At least one of email or phoneNumber must be provided.');
  }

  // Step 1: Find all contacts with matching email or phone
  const matchedContacts = await prisma.Contact.findMany({
    where: {
      OR: [
        email ? { email } : undefined,
        phoneNumber ? { phoneNumber } : undefined,
      ].filter(Boolean),
    },
    orderBy: { createdAt: 'asc' }
  });

  let primary = null;
  let allContacts = [];

  if (matchedContacts.length === 0) {
    // No existing contact — create new primary
    const newContact = await prisma.Contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: 'primary'
      }
    });

    return {
      primaryContatctId: newContact.id,
      emails: [newContact.email].filter(Boolean),
      phoneNumbers: [newContact.phoneNumber].filter(Boolean),
      secondaryContactIds: []
    };
  } else {
    // Step 2: Determine primary contact
    primary = matchedContacts.find(c => c.linkPrecedence === 'primary') || matchedContacts[0];

    // Step 3: Get all linked contacts
    const allLinkedContacts = await prisma.Contact.findMany({
      where: {
        OR: [
          { id: primary.id },
          { linkedId: primary.id },
          { id: { in: matchedContacts.map(c => c.linkedId).filter(Boolean) } },
          { linkedId: { in: matchedContacts.map(c => c.id) } },
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    allContacts = [...new Set([...matchedContacts, ...allLinkedContacts])];

    // Step 4: Create secondary if current request info is new
    const alreadyExists = allContacts.some(c =>
      c.email === email && c.phoneNumber === phoneNumber
    );

    if (!alreadyExists) {
      await prisma.Contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: 'secondary',
          linkedId: primary.id
        }
      });

      // Reload all linked contacts including the new one
      allContacts = await prisma.Contact.findMany({
        where: {
          OR: [
            { id: primary.id },
            { linkedId: primary.id },
            { linkedId: { in: matchedContacts.map(c => c.id) } },
            { id: { in: matchedContacts.map(c => c.linkedId).filter(Boolean) } },
          ]
        },
        orderBy: { createdAt: 'asc' }
      });
    }

    // Step 5: Format response
    const emails = [...new Set(allContacts.map(c => c.email).filter(Boolean))];
    const phoneNumbers = [...new Set(allContacts.map(c => c.phoneNumber).filter(Boolean))];
    const secondaryContactIds = allContacts
      .filter(c => c.linkPrecedence === 'secondary')
      .map(c => c.id);

    return {
      primaryContatctId: primary.id,
      emails,
      phoneNumbers,
      secondaryContactIds
    };
  }
};

module.exports = { handleIdentifyRequest };
