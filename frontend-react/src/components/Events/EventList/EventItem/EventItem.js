import React, { useContext } from 'react';
import AuthContext from '../../../../context/auth-context';
import './EventItem.css';

const EventItem = (props) => {
    const contextType = useContext(AuthContext);
    return (
        <li className="event__list-item" >
            <div>
                <h1>{props.event.title}</h1>
                <h2>₺{props.event.price} - {new Date(props.event.date).toLocaleString('tr-TR')}</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button className="btn" style={{ alignSelf: 'flex-end' }} onClick={props.onDetail.bind(this, props.event._id)}>View Details</button>
                {props.event.creator._id === contextType.userId &&
                    <p>You are the owner of this event.</p>
                }
            </div>
        </li >
    );
}

export default EventItem;
