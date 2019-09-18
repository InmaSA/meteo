import React, { Component } from 'react'
import './App.css'

// importamos el servicio data.services para instanciarlo en el constructor
import DataServices from './services/data.services'

// importamos los componentes de chart
import FiveSecondsChart from './components/FiveSecondsChart'
import CelsiusAndkWhChart from './components/CelsiusAndkWhChart'
import SingleDataDisplay from './components/SingleDataDisplay'


// definimos en el state la propiedad serverValue en la que guardaremos la respuesta del servidor y definimos las propiedades fiveSecondsChartValues y celsiusAndkWhChartValues 
// para no mutar serverValues y trabajar en arrays distintos los valores que  pasaremos por props a los charts y guarderemos el último valor recibido en lastRecievedValues.


class App extends Component {

  constructor() {
    super()
    this.state = { 
      serverValues: [],
      fiveSecondsChartValues: [],
      celsiusAndkWhChartValues: [],
      lastRecievedValues : {},
      intervalId: {}
     }
    this.dataServices = new DataServices
  }


// método firstCallToServer para la primera llamada al servidor que ejecutaremos en CompDidMount para inicializar el estado

  firstCallToServer() {
    let serverValues = [], fiveSecondsChartValues = [], celsiusAndkWhChartValues = [], lastRecievedValues = {}, newValue = {}

    this.dataServices.getValues()
    .then(response =>{     
      newValue = response.data
      serverValues.push(newValue)
      fiveSecondsChartValues.push(newValue)
      celsiusAndkWhChartValues.push(newValue)
      lastRecievedValues = newValue
      this.setState({serverValues, fiveSecondsChartValues, celsiusAndkWhChartValues, lastRecievedValues})
    })
    .catch(err => console.log({err}))
  }


  // Utilizamos CompDidMount porque necesitamos que el estado se actualice antes de la renderización
  // hacemos la primera llamada al servidor para obtener el estado inicial correspondiente a 00:00:00,
  // ejecutamos la función setInterval para actualizar el estado cada 5 segundos, intervalo que hemos definido para las llamadas por axios al servidor.
  // ES6 no permite usar propiedades de clase dentro de setInterval, así que escribimos el código completo dentro.

  
  componentDidMount() {
    
    this.firstCallToServer()
    
    let intervalId = setInterval(() => {
      let newValue = {}
      
      this.dataServices.getValues()
      .then(response =>{ 
        newValue = response.data
        this.setState({serverValues: [...this.state.serverValues, newValue], lastRecievedValues: newValue})
        
        // Copiamos this.state.serverValues y comprobamos la longitud de las copias para que en el renderizado de los charts sólo salgan 30 valores cómo máximo.    
        // Seteamos las propiedades del estado fiveSecondsChartValues y celsiusAndkWhChartValues con los valores que procedan.
        let fiveSecondsChartValues = [...this.state.serverValues]
        let celsiusAndkWhChartValues = [...this.state.serverValues]
        
        if (fiveSecondsChartValues.length > 30) {
          fiveSecondsChartValues.splice(0, fiveSecondsChartValues.length -31) 
        }        
        if(celsiusAndkWhChartValues.length > 120) {
          celsiusAndkWhChartValues.splice(0, celsiusAndkWhChartValues.length -121)
        }

        this.setState({fiveSecondsChartValues, celsiusAndkWhChartValues})

      })
      .catch(err => console.log('error al obtener los datos de temperature y time: ', err))
    }, 5000)
    
    // Guardamos el intervalId en el estado para poder acceder a él en el compWillUnmount
    this.setState({intervalId: intervalId})
  }


  // eliminamos el componente del DOM y hacemos el clearInterval

  componentWillUnmount() {
    window.clearInterval(this.state.intervalId)
  }




  render() { 
      console.log(this.state.serverValues)
      return ( 
        <main className="App">

          <header className="hero">
            <h1>Welcome to meteoApp</h1>
          </header>

          <section className="chart">

            <article>
              <header>
                <h2>Temperature and Power: real time measurements shown every five seconds</h2>
              </header>
              <FiveSecondsChart chartValues = {this.state.fiveSecondsChartValues} />
            </article>
            
            <article className="last-data">
              <header>
                 <h3>Last recieved data:</h3>
              </header>
              <SingleDataDisplay lastValues = {this.state.lastRecievedValues}/>
            </article>

          </section>
            
          <section className="chart">
              <header>
                <h2>Temperature and Energy: real time measurements shown every minute</h2>
              </header>

              <CelsiusAndkWhChart chartValues = {this.state.celsiusAndkWhChartValues}/>
          </section>

      </main>
       )
    }

}
 
export default App
