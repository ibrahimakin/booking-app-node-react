import React from 'react';

export default React.createContext({
    token: null,
    userId: null,
    tokenExpiration: null,
    login: (token, userId, tokenExpiration) => {

    },
    logout: () => {

    }
});