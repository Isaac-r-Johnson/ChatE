import React from "react";
import { BrowserRouter as Router, Routes, Route }from 'react-router-dom';
import Signup from "./pages/signup";
import Main from "./pages/main";


const App = () => {

    const apiUrl = "http://localhost:5000/"
    const siteUrl = "http://localhost:3000/";

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main apiUrl={apiUrl} siteUrl={siteUrl}/>}></Route>
                <Route path="/signup" element={<Signup apiUrl={apiUrl} siteUrl={siteUrl}/>}></Route>
            </Routes>
        </Router>
    );
}

export default App;