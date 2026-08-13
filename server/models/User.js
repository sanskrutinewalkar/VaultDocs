const mongoose = require ("mongoose");

const UserSchema = new mongoose.Schema(
    {
        mobile:{
            type: String,
            required: true,
            unique: true,
        },
        pinHash:{
            type: String,
            default: null,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model('User',UserSchema);