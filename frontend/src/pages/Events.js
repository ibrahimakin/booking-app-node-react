import React, { useState, createRef, useContext, useEffect } from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import './Events.css';
//import '../index.css';

const EventsPage = (props) => {

    const [creating, setCreating] = useState(false);
    const [events, setEvents] = useState([]);

    const contextType = useContext(AuthContext);

    useEffect(() => {
        fetchEvents();
    }, []);

    const titleEl = createRef();
    const priceEl = createRef();
    const dateEl = createRef();
    const descriptionEl = createRef();


    const startCreateEventHandler = () => {
        setCreating(true);
        //console.log(contextType);
    };

    const modalConfirmHandler = () => {
        setCreating(false);
        const title = titleEl.current.value;
        const price = +priceEl.current.value;
        const date = dateEl.current.value;
        const description = descriptionEl.current.value;

        if (title.trim().length === 0 || price <= 0 || date.trim().length === 0) {
            return;
        }
        //const event = { title, price, date, description };
        //console.log(event);

        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput:{title: "${title}", description: "${description}", price:${price}, date:"${date}" }) {
                        _id
                        title
                        price
                        description
                        date
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        };

        const token = contextType.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
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
                fetchEvents();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const modalCancelHandler = () => {
        setCreating(false);
    };

    const fetchEvents = () => {
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        price
                        description
                        date
                        creator {
                            _id
                            email
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
                setEvents(resData.data.events);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const eventList = events.map(event => {
        return (<li key={event._id} className="events__list-item">{event.title}</li>);
    });

    return (
        <React.Fragment>
            {creating && <Backdrop />}
            {creating &&
                <Modal
                    title="Add Event"
                    canCancel
                    canConfirm
                    onCancel={modalCancelHandler}
                    onConfirm={modalConfirmHandler}>
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={titleEl} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={priceEl} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" ref={dateEl} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" rows="4" ref={descriptionEl} />
                        </div>
                    </form>
                </Modal>
            }
            {contextType.token &&
                <div className="events-control">
                    <p>Share your own Events!</p>
                    <button className="btn" onClick={startCreateEventHandler}>Create Event</button>
                </div>
            }
            <ul className="event__list">
                {eventList}
            </ul>
        </React.Fragment>

    );
};

export default EventsPage;
