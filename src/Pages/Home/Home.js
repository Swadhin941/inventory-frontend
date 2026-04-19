import React, { useEffect } from "react";
import HomeCss from "./Home.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Home = () => {
    const user = useSelector(state=>state.auth.auth);
    useEffect(()=>{
        console.log(user?.user);
    },[user])
    const navigate = useNavigate();
    
    return (
        <div>
            <h1>Dashboard page home</h1>
        </div>
    );
};

export default Home;
