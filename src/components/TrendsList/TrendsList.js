import { useState, useEffect } from 'react';
import styles from './TrendsList.module.css';
import axios from 'axios';
import TrendCloud from '../TrendCloud/TrendCloud';

const TrendsList = () => {
    const [trends, setTrends] = useState([]);
    
    function getTrends() {
        axios.get('/api/trends')
            .then(response => {
                setTrends(response?.data?.body[0].trends);
                // setTrends(response?.data?.body[0].trends.map(item=> `${item.name} (${item.tweet_volume})`));
            })
            .catch(error => console.log(error.message));
    }

    useEffect(() => getTrends(), []);

    return (
        // <div className={styles.tagCloud}>   
            <TrendCloud data={trends}/>
        // </div>
    );
    
};

export default TrendsList;
