import React, { useEffect } from "react";
import HomeCss from "./Home.css";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const navigate = useNavigate();
    useEffect(()=>{
        navigate("/dashboard");
    },[])
    return (
        <div>

        </div>
    );
};

export default Home;
