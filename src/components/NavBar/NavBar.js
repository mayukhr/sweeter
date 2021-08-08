import styles from './NavBar.module.css';
import {  NavLink } from "react-router-dom";

const NavBar = () => {
    return (
        <div>
            <div className={styles.topnav}>
                <NavLink to='/'>
                    <img className={styles.icon} src='sweeterPink.png' alt='logo' />
                </NavLink>
                <NavLink to='/trends' className={styles.link}> Trends </NavLink>
            </div>
        </div>
    )
}

export default NavBar;