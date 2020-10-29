import React from 'react';
import './BookingItem.css';

function BookingItem (props) {
    return (
        <li className="bookings__item">
            <div className="bookings__item-data">
                {props.booking.event.title}
                &nbsp;
                &nbsp;
            {new Date(props.booking.createdAt).toLocaleString('tr-TR')}
            </div>
            <div className="bookings__item-actions">
                <button className="btn" onClick={props.onDelete.bind(this, props.booking._id)}>Cancel</button>
            </div>
        </li>
    );
}

export default BookingItem;
