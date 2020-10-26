import React, { useState, createRef, useContext, useEffect } from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
import './Events.css';
//import '../index.css';

const EventsPage = (props) => {

    const [creating, setCreating] = useState(false);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

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
                console.log(resData.data.createEvent);
                setEvents((prevState) => {
                    const updatedEvents = [...prevState];;
                    updatedEvents.push(
                        {
                            _id: resData.data.createEvent._id,
                            title: resData.data.createEvent.title,
                            description: resData.data.createEvent.description,
                            price: resData.data.createEvent.price,
                            date: resData.data.createEvent.date,
                            creator: {
                                _id: contextType.userId,
                                email: contextType.email
                            }
                        }
                    )
                    return updatedEvents;
                }
                );
                //                fetchEvents();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const modalCancelHandler = () => {
        setCreating(false);
        setSelectedEvent(null);
    };

    const fetchEvents = () => {
        setIsLoading(true);
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
                // console.log(resData);
                setEvents(resData.data.events);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    const showDetail = (eventId) => {
        //console.log(eventId);
        setSelectedEvent(events.find(e => e._id === eventId));
        //console.log(selectedEvent);
    }

    const bookEventHandler = () => {

    }

    return (
        <React.Fragment>
            {(creating || selectedEvent) && <Backdrop />}
            {creating &&
                <Modal
                    title="Add Event"
                    canCancel
                    canConfirm
                    onCancel={modalCancelHandler}
                    onConfirm={modalConfirmHandler}
                    confirmText="Confirm">
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
            {selectedEvent && (
                <Modal
                    title={selectedEvent.title}
                    canCancel
                    canConfirm
                    onCancel={modalCancelHandler}
                    onConfirm={bookEventHandler}
                    confirmText="Book">
                    <h1>{selectedEvent.title}</h1>
                    <h2>₺{selectedEvent.price}</h2>
                    <h2>{new Date(selectedEvent.date).toLocaleString('tr-TR')}</h2>
                    <p>{selectedEvent.description}</p>
                </Modal>
            )}
            {contextType.token &&
                <div className="events-control">
                    <p>Share your own Events!</p>
                    <button className="btn" onClick={startCreateEventHandler}>Create Event</button>
                </div>
            }
            {isLoading ?
                <Spinner />
                :
                <EventList events={events} onViewDetail={showDetail} />
            }
        </React.Fragment>

    );
};

export default EventsPage;
