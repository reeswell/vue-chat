import {io} from 'socket.io-client'

export default {
  install: (app, {connection, options}) => {
    const socket = io(connection, options)
    app.config.globalProperties.$socket = socket

    app.provide('socket', socket)
  }
}
