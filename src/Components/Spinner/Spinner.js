import React from 'react';
import { ClockLoader } from 'react-spinners';

const Spinner = () => {
    return (
        <div className="container-fluid">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default Spinner;