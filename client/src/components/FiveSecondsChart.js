import React from 'react'
import {Bar} from 'react-chartjs-2'


function FiveSecondsChart(props) {


  return (

      <Bar
        data={{
          datasets: [{
              label: 'Temperature (dK)',
              type:'line',
              data: props.chartValues.map(elm => elm.dKTempValue),
              fill: false,
              borderColor: '#FA8706',
              backgroundColor: '#FA8706',
              yAxisID: 'y-axis-2'
            },{
              type: 'bar',
              label: 'Power (MW)',
              data: props.chartValues.map(elm => elm.mWPowerValue),
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
                labels: props.chartValues.map(elm => elm.timeValue)
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

export default FiveSecondsChart


