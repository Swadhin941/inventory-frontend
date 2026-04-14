import React, { useState } from 'react';
import "./UserStats.css";

const UserStats = () => {
    const [page, setPage]= useState(1);
    const [limit, setLimit]= useState(10);
    
    const allDivs = [
        {
            name: "Total User",
            value: 0
        }
    ]

    return (
        <div className="container-fluid">
            <div className="row">
                {allDivs.map((item, key) => (
                    <div className="col-12 col-md-4 col-lg-3" key={key}>
                        <div className="card">
                            <div className="card-body">
                                <h6>{item?.name}</h6>
                                <p className='card-text'>{item.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserStats;