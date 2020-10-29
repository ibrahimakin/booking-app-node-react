import React from 'react';
import './BookingsControl.css';

function BookingsControl (props) {
    return (
        <div className="bookings-control">
            <button
                className={props.outputType ? 'active' : ''}
                onClick={props.changeOutputType.bind(this, true)}>
                List
            </button>
            <button
                className={!props.outputType ? 'active' : ''}
                onClick={props.changeOutputType.bind(this, false)}>
                Chart
            </button>
        </div>
    );
}

export default BookingsControl;
