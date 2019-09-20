import React, {Component} from 'react'
import {connect} from 'react-redux'
import './App.css'

// importamos los componentes
import FiveSecondsChart from './components/FiveSecondsChart'
import CelsiusAndkWhChart from './components/CelsiusAndkWhChart'
import SingleDataDisplay from './components/SingleDataDisplay'

// importamos el servicio data.services e instanciamos uno nuevo para acceder al servidor mediante axios en la acción de redux 'GET-VALUES'
import DataServices from './services/data.services'
const dataServices = new DataServices


// con mapDispatchToProps App hace un dispatch de la acción 'GET_VALUES' que recoge el reducer y actualiza el state del store

const mapDispatchToProps = dispatch => {
  return {
    getValuesFromServer() {
      dataServices.getValues()
      .then(response => {
        dispatch(
          {type:'GET_VALUES', payload: response.data}
        )
      })
      .catch(err => console.log(err))
    }
  }
}



class App extends Component {
constructor(){
  super()
  this.intervalId= {}
}


  // Utilizamos CompDidMount porque necesitamos que nos llegue el state desde el Store antes de la renderización
  // hacemos la primera llamada al servidor para obtener el estado inicial correspondiente a 00:00:00,
  // ejecutamos la función setInterval para actualizar el estado cada 5 segundos, intervalo que hemos definido para las llamadas por axios al servidor.
    
  componentDidMount() {
    this.props.getValuesFromServer()

    this.intervalId = setInterval(() => {
      this.props.getValuesFromServer()
    }, 5000)
    console.log(this.intervalId)
  }


  componentWillUnmount() {
    clearInterval(this.intervalId)
    console.log(this.intervalId)
  }

  render() { 

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
              <FiveSecondsChart />
            </article>
            
            <article className="last-data">
              <header>
                 <h3>Last recieved data:</h3>
              </header>
              <SingleDataDisplay />
            </article>

          </section>
            
          <section className="chart">
              <header>
                <h2>Temperature and Energy: real time measurements shown every minute</h2>
              </header>

              <CelsiusAndkWhChart />
          </section>

      </main>
       )
    }

}
 
// con mapStateToProps nos aseguramos de que el estado del store llegue a este componente
const mapStateToProps = state => {
  return(
    {serverValues: state.serverValues}
  )
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
) (App)
