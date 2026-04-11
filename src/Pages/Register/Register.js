import React, { useEffect, useState } from "react";
import "./Register.css";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerApi } from "../../Services/slices/auth.slice";
import toast from "react-hot-toast";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { user, isRegisterLoading, error } = useSelector(
        (state) => state.auth.auth,
    );
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isRegisterLoading && isLoading && !error) {
            navigate("/login");
        }
        setIsLoading(isRegisterLoading);
    }, [isRegisterLoading]);

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[user])

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        if (form.password.value.length < 6) {
            toast.error("Password should at least 6 character long");
            return;
        }
        const payload = {
            username: form.full_name.value,
            email: form.email.value,
            password: form.password.value,
        };
        dispatch(registerApi(payload));
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
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="form-control border border-end-0"
                                            name="password"
                                            placeholder="Enter your password"
                                        />
                                        <span
                                            className="input-group-text"
                                            style={{
                                                backgroundColor: "#E8F0FE",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            <i
                                                className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}
                                            ></i>
                                        </span>
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
                                        disabled={isRegisterLoading}
                                    >
                                        Sign up{" "}
                                        {isRegisterLoading && (
                                            <ClipLoader size={18} />
                                        )}
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
