import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleForgetPass = () => {
        navigate("/forget-password", { replace: true });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        if (form.password.value.length < 6) {
            toast.error("Password length should be at least 6 characters");
            return;
        }
    };
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <div className="loginCard d-flex justify-content-center align-items-center">
                        <div className="card p-2 w-25">
                            <div className="card-body">
                                <form className="form" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="email">Email</label>
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
                                    </div>
                                    <div className="mt-2">
                                        <label htmlFor="password">
                                            Password
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bi bi-key-fill"></i>
                                            </span>
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="form-control"
                                                style={{ borderRight: "none" }}
                                                placeholder="Enter your password"
                                                name="password"
                                            />
                                            <span
                                                className="input-group-text"
                                                style={{
                                                    backgroundColor: "#E8F0FE",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                            >
                                                <i
                                                    className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}
                                                ></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <small
                                            className="text-primary text-decoration-underline"
                                            style={{ cursor: "pointer" }}
                                            onClick={handleForgetPass}
                                        >
                                            Forget password
                                        </small>
                                    </div>
                                    <div className="mt-3">
                                        <button className="btn btn-outline-success w-100">
                                            Sign in
                                        </button>
                                    </div>
                                </form>
                                <div className="d-flex mt-3">
                                    <hr className="w-50" />
                                    <span className="ms-1 me-1">OR</span>
                                    <hr className="w-50" />
                                </div>
                                <div>
                                    <button
                                        className="w-100 btn btn-outline-success"
                                        onClick={() => navigate("/register")}
                                    >
                                        Sign up
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
