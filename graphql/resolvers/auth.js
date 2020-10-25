const bcrypt = require('bcryptjs');
const User = require('../../models/user');


const authResolver = {
    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('User exists already');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);// return because bcrypt hash is an async task, we want graphql or express graphql to wait for us
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save();

            return { ...result, password: null, _id: result.id };

        } catch (error) {
            throw error;
        }
    },
};

module.exports = authResolver;
