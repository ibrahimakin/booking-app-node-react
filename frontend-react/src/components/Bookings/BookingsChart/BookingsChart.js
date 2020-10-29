import React from 'react';
import { Bar as BarChart } from 'react-chartjs';
import './BookingsChart.css';

const BOOKINGS_BUCKET = {
    'Cheap': {
        min: 0,
        max: 100
    },
    'Normal': {
        min: 100,
        max: 200
    },
    'Expensive': {
        min: 200,
        max: 10000
    }
};
const chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};


function BookingsChart (props) {
    const output = {};
    for (const bucket in BOOKINGS_BUCKET) {
        const filteredBookingsCount = props.bookings.reduce((prev, current) => {
            if (current.event.price > BOOKINGS_BUCKET[bucket].min &&
                current.event.price < BOOKINGS_BUCKET[bucket].max) {
                return prev + 1;
            }
            else {
                return prev;
            }
        }, 0);
        output[bucket] = filteredBookingsCount;
        console.log(output);
    }
    return (
        <div className="bookings__chart">
            {//<BarChart data={chartData} width="600" height="250" />
            }
            <h2>Chart</h2>
        </div>
    );
}

export default BookingsChart;
