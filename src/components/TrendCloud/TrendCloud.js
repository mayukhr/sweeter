import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3";
import d3Cloud from "d3-cloud";
import styles from './TrendCloud.module.css';

const Trend = ({data}) => {
  const [cloud, setCloud] = useState(null);
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  const width = 600 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  useEffect(() => {
    const fontSize = d3.scalePow(8).exponent(5).domain([0, 1]).range([15, 40]);
    d3Cloud()
      .size([width, height])
      .words(data)
      .rotate(function() {
        return ~~(Math.random() * 2) * 90;
      })
      .fontSize(() => fontSize(Math.random()))
      .fontWeight(["bold"])
      .text(tag=>`${tag.name} ${tag.tweet_volume?'(':''}${tag.tweet_volume||''}${tag.tweet_volume?')':''}`)
      .on("end", words => setCloud(words))
      .start();
  }, [data, width, height]);

  let color = d3.scaleOrdinal(d3.schemeCategory10);

  return (
    <svg viewBox="0 0 700 650" className={styles.svgContent}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          {
            cloud?.map?.((word, i) => (
              <text
                key={word.text}
                style={{
                  fill: color(i),
                  fontSize: word.size + "px",
                  fontFamily: word.font
                }}
                textAnchor="middle"
                transform={`translate(${word.x},${word.y}) rotate(${
                  word.rotate
                })`}
              >
                {word.text}
              </text>
            ))}
        </g>
      </g>
    </svg>
  );
  
};

Trend.propTypes = {
  data: PropTypes.array
};

export default Trend;
