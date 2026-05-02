import React from "react";
import UserStats from "./UserStats/UserStats";
import UserTable from "./UserTable/UserTable";

const User = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                    <div className="mt-3">
                        <UserStats></UserStats>
                    </div>
                    <div>
                        <UserTable></UserTable>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default User;
