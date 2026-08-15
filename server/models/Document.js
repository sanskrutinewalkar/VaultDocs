const mongoose = require ('mongoose');

const documentSchema = new mongoose.Schema(
    {
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required : true,
        },
        title:{
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String ,
            enum:['Adhar','Pan','Driving Liscense','Marksheet','Passport','Other'],
            default: 'Other',
        },

        expiryDate:{
            type: Date,
            default: null
        },

       sharedWith: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        expiresAt: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document',documentSchema);