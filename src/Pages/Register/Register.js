import React, { useState } from "react";
import "./Register.css";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        setLoading(true);
    };

    const handleSignInNav = () => {
        navigate("/login");
    };
    return (
        <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                <div className="registerCard d-flex justify-content-center align-items-center">
                    <div className="card p-3 w-25">
                        <div className="card-body">
                            <form className="form" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="full_name">Full name</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="bi bi-person"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="full_name"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="email">Email</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="bi bi-person"></i>
                                        </span>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="password">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="bi bi-person"></i>
                                        </span>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                </div>
                                <div className="text-primary text-decoration-underline mt-2">
                                    <span
                                        style={{ cursor: "pointer" }}
                                        onClick={handleSignInNav}
                                    >
                                        Already have an account?
                                    </span>
                                </div>
                                <div className="mt-3">
                                    <button
                                        className="btn btn-outline-success w-100"
                                        disabled={loading}
                                    >
                                        Sign up{" "}
                                        {loading && <ClipLoader size={18} />}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
