const Ticket = require('../models/Ticket.model');
const generatePNR = require('../utils/generatePNR');

const createTicket = async ({
  userId,
  trainId,
  classCode,
  fromStation,
  toStation,
  journeyDate,
  passengers,
  seatsBooked,
  totalFare,
}) => {
  const ticket = new Ticket({
    user: userId,
    train: trainId,
    classCode,
    fromStation,
    toStation,
    journeyDate,
    passengers,
    seatsBooked,
    totalFare,
    pnr: generatePNR(),
  });

  await ticket.save();
  return ticket;
};

module.exports = createTicket;