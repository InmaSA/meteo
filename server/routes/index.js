const express = require('express')
const router  = express.Router()


/* YAML CONFIG */


const yaml = require('js-yaml')
const fs = require('fs')

// declaramos en global jsonData para recoger los datos que obtenemos con el método try y acceder a él luego en la llamada GET

let jsonData = {}

// convertimos el archivo yml a formato JSON p

try {
  const config = yaml.safeLoad(fs.readFileSync('data.yml', 'utf8'))
  const indentedJson = JSON.stringify(config, null, 4)
  jsonData = JSON.parse(indentedJson)
} catch (e) {
  console.log(e)
}




/* CONFIG PARA MANDAR LA INFO AL CLIENTE A TIEMPO REAL */


// inicializamos un contador en 0 que iremos actualizando tras cada llamada.
// Lo usaremos para filtrar los datos de data.yml y enviar sólo los que corresponden al dato de tiempo de cada llamada de axios. Esto es así porque
// las longitudes del array de valores de temperatura y de power en data.yml son respectivamente 16239 y 17027, con lo que simplemente iterando
// mezclaremos datos de temp correspondientes a un valor de tiempo con datos de power de otro valor de tiempo distinto
let counter = 0

// inicializamos en global la variabletimeString que usaremos en la función convertCounterToTimeString, para tener acceso a ella dentro del GET
let timeString = ''

// creamos la función convertCounterToTimeString para usarla dentro de la llamada get y pasarle como parámetro el valor de counter actual.
// Operamos con el valor de counter para transformarlo en un string comparable con el valor time de data.yml

convertCounterToTimeString = (counter) => {

  let hours = 0
  let minutes = 0
  let seconds = 0

  if (counter < 60) {
    (counter < 10) ? timeString = `00:00:0${counter}` : timeString = `00:00:${counter}`
  } 
    else if (counter >= 60 && counter < 3600) {
      minutes = Math.floor(counter/60)
      seconds = counter%60
      seconds < 10 ? seconds = `0${seconds}`: seconds = seconds
      minutes < 10 ? minutes = `0${minutes}` : minutes = minutes
      timeString = `00:${minutes}:${seconds}`
    } 
      else if (counter >= 3600) {
        hours = Math.floor(counter/3600)
        minutes = Math.floor((counter%3600)/60)
        seconds = (counter%3600)%60
        seconds < 10 ? seconds = `0${seconds}` : seconds = seconds
        minutes < 10 ? minutes = `0${minutes}` : minutes = minutes
        hours < 10 ? hours = `0${hours}` : hours = hours
        timeString = `${hours}:${minutes}:${seconds}`
      }
  return timeString    
}




/* CÁLCULO DE LA TEMPERATURA MEDIA EN CELSUIS Y DE LA ENERGÍA EN KWH */
// definimos funciones que llamaremos en GET para convertir los datos de data.yml a la info que queremos:


// función para guardar los valores de temperatura que hay en el intervalo de un minuto
// inicializamos tempArray en global para que se almacenen los datos y se actualice de acuerdo a getTempValuesInAMinute.
let tempArray = []

getTempValuesInAMinute = (temp) => {
  tempArray.push(temp)
  if(tempArray.length > 12)
  {return tempArray.shift()} 
    else {return tempArray}
}

// función para convertitr la temperatura de dK a celsius

convertDkToCelsius = (temperature) => {
  let celsiusTemp =  temperature/10 - 273.15
  return celsiusTemp.toFixed(2)
}

// función para calcular la temperatura media de los valores guardado con la función getTempValuesInAMinute y que converimos a 
// celsius llamando a convertDkToCelsius

calcAverageTemp = (arrayTemp) => {
let averageTemp = arrayTemp.reduce((acc, elm) => {return (acc+elm/arrayTemp.length)}, 0)
let averageCelsius = convertDkToCelsius(averageTemp)
return averageCelsius
}

// función para convertir potencia en MW a energía en KWH

convertMWtoKWh = (power) => {
  let numPower = parseFloat(power)
  return numPower * 1000
}





/* RECIBIMOS LA LLAMADA DESDE EL CLIENTE Y DEVOLVEMOS LOS DATOS */


router.get('/', (req, res) => {
  
  convertCounterToTimeString(counter)
  
  let dKTempValue = 0
  let mWPowerValue = ''

  let timeValue = timeString
  let rightPairTempValue = jsonData.temperature.values.filter(elm => elm.time === timeString)
  let rightPairPowerValue = jsonData.power.values.filter(elm => elm.time === timeString)

  // comprobamos si el valor para ese timeString existe para asignar valores por defecto o el que procede del data.yml a dKTempValue y mWPowerValue
  if (rightPairTempValue !== []) {
    dKTempValue = rightPairTempValue[0].value
  }  else {dKTempValue = 2731.5}
  
  if (rightPairPowerValue !== []) {
    mWPowerValue = rightPairPowerValue[0].value
  }  else {mWPowerValue = '0'}

  // guardamos los datos de temperartura del intervalo de un minuto:
  getTempValuesInAMinute(dKTempValue)
  
  // Comprobamos si estamos en minutos exactos y en función de ello enviamps en el send también celsiusValueTemp y KwHEnergy

  if (counter%60 === 0) {
    let celsiusValueTemp = calcAverageTemp(tempArray)
    let kwHEnergy = convertMWtoKWh(mWPowerValue)
    let timeMinuteValue = timeString
    res.send({timeValue, dKTempValue, mWPowerValue, celsiusValueTemp, kwHEnergy, timeMinuteValue})
  } 
    else {
      res.send({timeValue, dKTempValue, mWPowerValue})
    }

  // sumamos en cada llamada 5 a counter porque time va de 5 en 5 segundos y la llamada de axios viene también cada 5 segundos
  counter +=5
})



module.exports = router


/* NOTA: de cara a refactorizar, hay condicionales que pasados a ternarios fallan */