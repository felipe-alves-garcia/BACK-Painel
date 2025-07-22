const mongoose = require("mongoose");
const { model, Schema } = mongoose;

//-----

const adminSchema = new Schema({
    login:String,
    password:String,
    tipo:String,
})

const admin = model("admin", adminSchema);

//

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
            chamado:{
                type:Boolean,
                default:false,
            },
            atendido:{
                type:Boolean,
                default:false,
            }
        }],
        lastFila:[{
            senha:Number,
            divison:String,
            tipo:String,
            chamado:{
                type:Boolean,
                default:false,
            },
            atendido:{
                type:Boolean,
                default:false,
            }
        }]
    }],
});

const unidades = model("unidades", unidadeSchema);

//-----

module.exports = { admin, unidades };

