const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/user-model'); 

mongoose.connect('mongodb://localhost:27017/betsmart', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function createUser() {
    const hashedPassword = await bcrypt.hash('yourPassword123', 10);
    const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        console.log('User created:', savedUser);
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

createUser();