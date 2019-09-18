import React from 'react'
import {Bar} from 'react-chartjs-2'


function CelsiusAndkWhChart (props) {


  return (

      <Bar
        data={{
          datasets: [{
              label: 'Temperature (ºC)',
              type:'line',
              data: props.chartValues.filter(elm => elm.celsiusValueTemp).map((elm => elm.celsiusValueTemp)),
              fill: false,
              borderColor: '#FA8706 ',
              backgroundColor: '#FA8706 ',
              yAxisID: 'y-axis-2'
            },{
              type: 'bar',
              label: 'Energy (KWh)',
              data: props.chartValues.filter(elm => elm.kwHEnergy).map((elm => elm.kwHEnergy)),
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
                labels: props.chartValues.filter(elm => elm.timeMinuteValue).map((elm => elm.timeMinuteValue))
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

export default CelsiusAndkWhChart


