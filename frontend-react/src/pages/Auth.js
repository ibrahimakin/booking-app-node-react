import React, { useState, useContext } from 'react';
import AuthContext from '../context/auth-context';
import './Auth.css';

const AuthPage = (props) => {

    const [isLogin, setIsLogin] = useState(true);

    const contextType = useContext(AuthContext);

    const emailEl = React.createRef();
    const passwordEl = React.createRef();

    const switchModeHandler = () => {
        setIsLogin(!isLogin);
        //setIsLogin(prevState => !prevState);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        const email = emailEl.current.value;
        const password = passwordEl.current.value;
        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
                query {
                    login(email: "${email}", password: "${password}"){
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        };
        if (!isLogin) {
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput:{email: "${email}", password: "${password}"}){
                            _id
                            email
                        }
                    }
                `
            };
        }


        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed');
                }
                return res.json();
            })
            .then((resData) => {
                if (resData.data.login.token) {
                    contextType.login(
                        resData.data.login.token,
                        resData.data.login.userId,
                        resData.data.login.tokenExpiration
                    );
                }
                // console.log(resData);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        /*<AuthContext.Consumer >
            {(context) => {
                return (*/
        <form className="auth-form" onSubmit={submitHandler}>
            <div className="form-control">
                <label htmlFor="email">E-mail</label>
                <input type="email" ref={emailEl}></input>
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" ref={passwordEl}></input>
            </div>
            <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={switchModeHandler}>Switch to {isLogin ? 'Signup' : 'Login'}</button>
            </div>
        </form>
        /*);
    }}
</AuthContext.Consumer >*/
    );
};

export default AuthPage;
