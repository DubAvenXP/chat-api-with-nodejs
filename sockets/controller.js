const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");


const chatMensajes = new ChatMensajes();
//quitar el new Socket 
const socketController = async (socket = new Socket, io) => {

    // console.log(socket);
    // console.log('Cliente conectado - ' + socket.id);
    // const token = socket.handshake.headers['x-toxen'];
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    if (!usuario) {
        return socket.disconnect();
    }

    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10Msg);

    //Conectar usuario a una sala especial
    socket.join(usuario.id); //global socket.id usuario.id


    //Desconexion usuario
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        
        if (uid) {
            //Mensaje privado
            socket.to(uid).emit('mensaje-privado', {de: usuario.nombre, mensaje})
        } else {
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10Msg);
        }
    });





}


module.exports = {
    socketController
}