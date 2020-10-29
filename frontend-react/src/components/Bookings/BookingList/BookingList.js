import React from 'react';
import BookingItem from './BookingItem/BookingItem';
import './BookingList.css';

function BookingList (props) {
    return (
        <ul className="bookings__list">
            {props.bookings.map((booking) => {
                return (<BookingItem key={booking._id} booking={booking} onDelete={props.onDelete} />);
            })}
        </ul>
    );
}

export default BookingList;
