import axios from 'axios'

export default class DataServices {
  constructor() {

      this.service = axios.create({
        baseURL: 'http://localhost:5000',
        withCredentials: true
      })
  }

 getValues = () => {return this.service.get('/')}

}