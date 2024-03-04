import { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import SearchUma from './component/searchUma'
import SearchUma2 from './component/searchUma2'
import { setWidth } from "./store"
import './css/App.css'

function App() {
    const dispatch = useDispatch()
    const initialMargin = 160
    const [isSideBarOpened, setSideBarOpened] = useState<boolean>(true)
    const [contentMargin, setContentMargin] = useState<number>(initialMargin)
    const [selected, setSelected] = useState(0)
    const variants = {
        opened: { x: 0, transition: { duration: 0.1, y: { stiffness: 1000 } } },
        closed: { x: "-100%", transition: { duration: 0.1, y: { stiffness: 1000 } } }
        //closed: { opacity: 0, x: "-100% ", minWidth: isSideBarOpened ? 150 + "px" : 0 }
    }
    dispatch(setWidth(contentMargin))

    const onSideBarVisible = () => {
        setSideBarOpened(!isSideBarOpened)
        setContentMargin(isSideBarOpened ? 0 : initialMargin)
        dispatch(setWidth(contentMargin))
    }

    return (
        <div>
            <button className="btn_sideBarVisible" onClick={onSideBarVisible}>≡</button>
            <div className="sidebarContainer">
                <Router>
                    <motion.nav className="sidebar" initial={{ x: 0 }} animate={isSideBarOpened ? "opened" : "closed"} variants={variants}>
                        <ul>
                            <li>
                                <Link to="/home" state={{ sideBarWidth: contentMargin }} onClick={() => { setSelected(0) }} style={{ backgroundColor: selected === 0 ? "#c6edff" : "" }}>→HomeChara</Link><br />
                            </li>
                            <li>
                                <Link to="/live" onClick={() => { setSelected(1) }} style={{ backgroundColor: selected === 1 ? "#c6edff" : "" }}>→LiveChara</Link>
                            </li>
                        </ul>
                    </motion.nav>
                    <div style={{ marginLeft: contentMargin }}>
                        <Routes>
                            <Route path="/home" Component={SearchUma}></Route>
                            <Route path="/live" Component={SearchUma2}></Route>
                        </Routes>
                    </div>
                </Router>
            </div>
        </div>
    );
}

export default App;
