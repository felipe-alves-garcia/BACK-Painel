const mongoose = require("mongoose");
const { model, Schema } = mongoose;

//-----

const unidadeSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    users:[{
        login:String,
        password:String,
        tipo:String,
        local:String,
    }],
    locais:[{
        name:String,
        fila:[{
            senha:Number,
            tipo:String,
            atendido:{
                type:Boolean,
                default:false,
            }
        }],
    }],
});

const unidades = model("unidades", unidadeSchema);

//-----

module.exports = { unidades };

