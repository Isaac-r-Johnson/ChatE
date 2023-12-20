import React from "react";
import { BrowserRouter as Router, Routes, Route }from 'react-router-dom';
import Login from "./pages/login";
import Main from "./pages/main";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Main/>}></Route>
                <Route path="/login" element={<Login/>}></Route>
            </Routes>
        </Router>
    );
}

export default App;