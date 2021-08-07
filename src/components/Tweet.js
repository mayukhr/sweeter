import React from "react";

const Tweet = ({ json }) => {
  const { id } = json.data;
  console.log(json);
  
  return (
    <div>{JSON.stringify(json)}</div>
  )
};

export default Tweet;
