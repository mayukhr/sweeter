import { useState, useEffect } from 'react';
import styles from './TrendsList.module.css';
import axios from 'axios';

const TrendsList = () => {
    const [trends, setTrends] = useState([]);
    
    function getTrends() {
        axios.get('/api/trends')
            .then(response => {
                console.log(response);
                setTrends(response?.data?.body[0].trends);
            })
            .catch(error => console.log(error.message));
    }

    useEffect(() => getTrends(), []);

    return (
        <div className={styles.tagCloud}>
            <ul>
                { trends.map((trend, index) => {
                    return (
                        <li key={index}>
                        <a href={trend.url}>{trend.name}</a>
                        {trend.tweet_volume && (
                            <span className='tweet_volume'>{trend.tweet_volume}</span>
                        )}
                        </li>
                    )
                    })
                }
            </ul>
        </div>
    );
    
};

export default TrendsList;
