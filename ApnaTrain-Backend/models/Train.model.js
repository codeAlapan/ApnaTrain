const mongoose=require('mongoose');
const trainSchema=new mongoose.Schema({
     trainNo: {
    type: String,
    required: true,
    unique: true,
  },
  trainName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true, 
  },
  availableClasses: {
    type: [String], 
    default: [],
  },
}, {
  timestamps: true
});
module.exports=mongoose.model('Train',trainSchema);