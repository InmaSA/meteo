import {createStore} from 'redux'

import reducer from './reducer'

// creamos el store al que pasamos como parámetro el reducer que es el que se encarga de actualizar el estado
const store = createStore(reducer)

export default store