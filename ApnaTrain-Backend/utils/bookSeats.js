const Train = require('../models/Train.model.js');
const TrainClassConfig = require('../models/TrainClassConfig.model.js');

const bookSeats = async ({
  trainId,
  fromStation,
  toStation,
  classCode,
  seatsBooked,
}) => {
  // 1. Get Train with route
  const train = await Train.findById(trainId).populate('route.station');
  if (!train) throw new Error('Train not found');

  // 2. Extract route station IDs
  const route = train.route.map((r) => r.station._id.toString());

  const fromIndex = route.indexOf(fromStation.toString());
  const toIndex = route.indexOf(toStation.toString());

  if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
    throw new Error('Invalid station selection');
  }

  //   build segments
  const segments = [];
  for (let i = fromIndex; i < toIndex; i++) {
    segments.push({
      fromStation: train.route[i].station._id,
      toStation: train.route[i + 1].station._id,
    });
  }

  //   Fetch all segment configs in one query
  const segmentConfigs = await TrainClassConfig.find({
    train: trainId,
    classCode,
    $or: segments.map((seg) => ({
      fromStation: seg.fromStation,
      toStation: seg.toStation,
    })),
  });

  console.log(segmentConfigs);

  // Check seat availability (minimum logic)
  let minAvailableSeats = Infinity;
  for (const seg of segments) {
    const config = segmentConfigs.find((cfg) => {
      return (
        cfg.fromStation._id.toString() === seg.fromStation._id.toString() &&
        cfg.toStation.toString() === seg.toStation.toString()
      );
    });
    if (!config) throw new Error('Segment config not found');
    minAvailableSeats = Math.min(minAvailableSeats, config.seatCount);
  }

  if (minAvailableSeats < seatsBooked) {
    throw new Error('Not enough seats available');
  }

  //  Bulk update seat counts
  const bulkOps = segments.map((seg) => ({
    updateOne: {
      filter: {
        train: trainId,
        classCode,
        fromStation: seg.fromStation,
        toStation: seg.toStation,
      },
      update: {
        $inc: { seatCount: -seatsBooked },
      },
    },
  }));

  await TrainClassConfig.bulkWrite(bulkOps);

  /*
  const newsegmentConfigs = await TrainClassConfig.find({
    train: trainId,
    classCode,
    $or: segments.map((seg) => ({
      fromStation: seg.fromStation,
      toStation: seg.toStation,
    })),
  });
  console.log(newsegmentConfigs);
  */

  //  Get fare from direct config
  const fareConfig = await TrainClassConfig.findOne({
    train: trainId,
    classCode,
    fromStation,
    toStation,
  });

  if (!fareConfig) {
    throw new Error('Fare config not found for this route');
  }

  const totalFare = fareConfig.fare * seatsBooked;

  return {
    message: 'Seats booked successfully',
    totalFare,
    seatsBooked,
  };
};

module.exports = bookSeats;
