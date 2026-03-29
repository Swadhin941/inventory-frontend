import React, { useState } from "react";
import "./ForgetPassword.css";
import {ClipLoader} from "react-spinners";
const ForgetPassword = () => {
    const [showNewPass, setShowNewPass] = useState(true);
    const [passVisibility, setPassVisibility] = useState(false);
    const [isLoading, setIsLoading]= useState(false);
    const handleFindEmailSubmit = (event) => {
        event.preventDefault();
        console.log(event.target.value, "event target value");
    };

    const handlePassChngSubmit = (event)=>{
        event.preventDefault();
        console.log(event.target.new_pass.value, event.target.confirm_new_pass.value);
        setIsLoading(true);
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="forgetPassword d-flex justify-content-center align-items-center">
                        {!showNewPass ? (
                            <div className="card w-25 p-3">
                                <div className="card-body">
                                    <h4 className="text-center mb-3">
                                        Find your account
                                    </h4>
                                    <div className="mt-2">
                                        <form onSubmit={handleFindEmailSubmit}>
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <i className="bi bi-envelope-at-fill"></i>
                                                </span>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Enter your email"
                                                    name="email"
                                                />
                                            </div>
                                            <div className="mt-3">
                                                <button className="btn btn-outline-success w-100">
                                                    Send OTP
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="card w-25 p-3">
                                <div className="card-body">
                                    <h4 className="mb-3 text-center">
                                        Set new password
                                    </h4>
                                    <form onSubmit={handlePassChngSubmit}>
                                        <div>
                                            <label htmlFor="new_pass">
                                                New Password
                                            </label>
                                            <div className="input-group">
                                                <input
                                                    type={
                                                        passVisibility
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    name="new_pass"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <label htmlFor="new_pass">
                                                Confirm New Password
                                            </label>
                                            <div className="input-group">
                                                <input
                                                    type={
                                                        passVisibility
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    name="confirm_new_pass"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <input
                                                type="checkbox"
                                                value={passVisibility}
                                                className="form-check-input"
                                                onClick={() =>
                                                    setPassVisibility(
                                                        !passVisibility,
                                                    )
                                                }
                                            />{" "}
                                            <span>Show password</span>
                                        </div>
                                        <div className="mt-3">
                                            <button
                                                className="btn btn-outline-success w-100"
                                                disabled={isLoading}
                                            >
                                                Change password{" "}
                                                {isLoading && (
                                                    <span>
                                                        <ClipLoader size={18} />
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
