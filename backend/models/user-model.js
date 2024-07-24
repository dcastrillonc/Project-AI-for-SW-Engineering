const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    resetPasswordToken: {type: String },
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Hash the password before updating the user
userSchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate();
    if (update.password) {
        update.password = await bcrypt.hash(update.password, 8);
    }
    next();
});

// Method to compare password
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};  

// Transform output to hide password
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.resetPasswordToken;
    return userObject;
};

module.exports = mongoose.model('User', userSchema);
