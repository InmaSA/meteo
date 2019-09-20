import React from 'react'
import {connect} from 'react-redux'

// enviamos el estado del store al componente, que llega como props
const mapStateToProps = state => {
  return(
    {serverValues: state.serverValues}
  )
}

// función para coger el último elemento del array de serverValues que llega por props desde el store
const findLastValue = state => {return state[state.length-1]}


const SingleDataDisplay = (props) => {
  
// comprobamos si nos llegan las props para renderizar campos vacíos o llamar a findLastValue y renderizar los datos 
// correspondientes al último elemento del array de serverValues, último valor que nos ha llegado desde el servidor.  
  if(props.serverValues.length >= 1) {

    let lastValues = findLastValue(props.serverValues)

    return ( 
   
      <div className="flex">
          <p><span>time: </span>{lastValues.timeValue} hours</p>
          <p><span>temperature: </span>{lastValues.dKTempValue} dK</p>
          <p><span>power: </span>{lastValues.mWPowerValue} MW</p>
      </div>
  
     )
  } else {

    return ( 
   
      <div className="flex">
          <p>time:</p>
          <p>temperature:</p>
          <p>power: </p>
      </div>
  
     )
  }
}
 
export default connect(
  mapStateToProps,
) (SingleDataDisplay)