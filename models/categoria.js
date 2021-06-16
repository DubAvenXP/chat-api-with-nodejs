const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre de la categoria es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

CategoriaSchema.methods.toJSON = function(){
    const {__v, ...categoria} = this.toObject();
    return categoria;
}

module.exports = model('Categoria', CategoriaSchema);