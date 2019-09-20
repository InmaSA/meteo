import React from 'react'
import {connect} from 'react-redux'
import {Bar} from 'react-chartjs-2'

// enviamos el estado del store al componente, que llega como props
const mapStateToProps = state => {
  return(
    {serverValues: state.serverValues}
  )
}

// función que llamaremos dentro del componente antes del return para manipular el array de serVervalues que llega por props y que pasaremos como parámetro
const findValues = state => {
  let myState = [...state]
  if(state.length >= 120) {
    myState.splice(0, myState.length-121)
  } 
  return myState
}



function CelsiusAndkWhChart (props) {

  // llmamamos a findValues y le pasamos como parámetro el estado del store y posteriormente filtramos los elementos del array que necesitamos
  let arrValues = findValues(props.serverValues)
  let celsiusAndkWhvalues = arrValues.filter(elm => elm.celsiusValueTemp)

  return (

      <Bar
        data={{
          datasets: [{
              label: 'Temperature (ºC)',
              type:'line',
              data: celsiusAndkWhvalues.map((elm => elm.celsiusValueTemp)),
              fill: false,
              borderColor: '#FA8706 ',
              backgroundColor: '#FA8706 ',
              yAxisID: 'y-axis-2'
            },{
              type: 'bar',
              label: 'Energy (KWh)',
              data: celsiusAndkWhvalues.map((elm => elm.kwHEnergy)),
              fill: false,
              backgroundColor: '#616CDE',
              borderColor: '#616CDE',
              yAxisID: 'y-axis-1'
            }]
        }}
        options={{
          responsive: true,
          tooltips: {
            mode: 'label'
          },
          elements: {
            line: {
              fill: false
            }
          },
          scales: {
            xAxes: [
              {
                display: true,
                gridLines: {
                  display: false
                },
                labels: celsiusAndkWhvalues.map((elm => elm.timeMinuteValue))
              }
            ],
            yAxes: [
              {
                type: 'linear',
                display: true,
                position: 'left',
                id: 'y-axis-1',
                gridLines: {
                  display: false
                },
                labels: {
                  show: true
                }
              },
              {
                type: 'linear',
                display: true,
                position: 'right',
                id: 'y-axis-2',
                gridLines: {
                  display: false
                },
                labels: {
                  show: true
                }
              }
            ]
          }
        }}
      />
  )


}


export default connect(
  mapStateToProps,
) (CelsiusAndkWhChart)


