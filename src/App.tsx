import React from 'react';
import logo from "./image/logo_umamusume-fc81a00.png"
import './css/App.css';
import SearchUma from './component/searchUma';
import SearchUma2 from './component/searchUma2';
import { Route, BrowserRouter as Router, Routes} from "react-router-dom"

function App() {
    return (
        <div>
            <a href="http://192.168.11.2:3000/home"><img src={logo} className="logo" alt="" /></a>
            <Router>
                <Routes>
                    <Route path="/home" Component={SearchUma}></Route>
                    <Route path="/live" Component={SearchUma2}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
