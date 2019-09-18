import React from 'react'


const SingleDataDisplay = (props) => {
  
  return ( 
 
    <div className="flex">
        <p><span>time: </span>{props.lastValues.timeValue} hours</p>
        <p><span>temperature: </span>{props.lastValues.dKTempValue} dK</p>
        <p><span>power: </span>{props.lastValues.mWPowerValue} MW</p>
    </div>

   )
}
 
export default SingleDataDisplay