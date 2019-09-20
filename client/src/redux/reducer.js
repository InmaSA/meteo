const initialState = {
  serverValues: []
}


// con mapDispatchToProps del compoenente App haremos un dispatch de la acción GET_VALUES 
// que recogemos en el reducer para actualizar el esatdo del store con los datos que nos llegan del servidor.

function reducer(state=initialState, action={}) {
  switch (action.type) {
    case 'GET_VALUES':
      return {
        ...state,
        serverValues: [...state.serverValues, action.payload]
      }
      default: return state
  }
}

export default reducer

