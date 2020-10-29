import React, { useEffect, useState, useContext } from 'react';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart';
import BookingsControl from '../components/Bookings/BookingsControl/BookingsControl';

const BookingsPage = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [outputType, setOutputType] = useState(true);
    const contextType = useContext(AuthContext);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = () => {
        setIsLoading(true);
        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        updatedAt
                        event {
                            _id
                            title
                            date
                            price
                        }
                    }
                }
            `
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + contextType.token
            }
        })
            .then((res) => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed');
                }
                return res.json();
            })
            .then((resData) => {
                //console.log(resData);
                setBookings(resData.data.bookings);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    const deleteBookingHandler = (bookingId) => {
        setIsLoading(true);
        const requestBody = {
            query: `
                mutation CancelBooking($id: ID!) {
                    cancelBooking(bookingId: $id) {
                        _id
                        title
                    }
                }
            `,
            variables: {
                id: bookingId
            }
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + contextType.token
            }
        })
            .then((res) => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed');
                }
                return res.json();
            })
            .then((resData) => {
                //console.log(resData);
                setBookings(prevState => {
                    const updatedBookings = prevState.filter((booking) => {
                        return booking._id !== bookingId;
                    });
                    return updatedBookings;
                });
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    const changeOutputTypeHandler = outputType => {
        if (outputType) {
            setOutputType(true);
        }
        else {
            setOutputType(false);
        }
    };

    return (
        <div>
            <h1 style={{ width: '40rem', margin: 'auto', maxWidth: '90%' }}>Bookings</h1>
            {isLoading ?
                <Spinner />
                :
                <React.Fragment>
                    <BookingsControl outputType={outputType} changeOutputType={changeOutputTypeHandler} />
                    <div>
                        {outputType ?
                            <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
                            :
                            <BookingsChart bookings={bookings} />
                        }
                    </div>
                </React.Fragment>
            }
        </div>
    );
};

export default BookingsPage;
