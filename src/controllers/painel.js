const db = require("../models/painel");
const { unidades } = db;

//Add

async function addUnidade (unidade){
    const newUnidade = new unidades({
        name:unidade.name,
    })
    try{
        let findUnidade = await unidades.find({name:unidade.name}).exec()
        if (findUnidade.length < 1){
            await newUnidade.save();
            return {status:true, msg:["Unidade adicionada com sucesso"]}
        }       
        return {status:false, msg:["Esta unidade já existe"]}
    }catch (error) {
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao se conectar com o DB", error]};
    }
}

async function addLocal (local, unidadeID){
    try{
        let unidade = await unidades.findById(unidadeID).exec();
        if(! unidade) return {status:false, msg:["Erro ao encontrar unidade"]};

        let findLocal = unidade.locais.some(l => l.name == local.name);
        if (findLocal) return {status:false, msg:["Este local já existe"]}

        unidade.locais.push(local);
        await unidade.save();

        return {status:true, msg:["Local adicionado com sucesso"]};
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao se conectar com DB", error]};
    }
}

async function addUser (user, unidadeID){
    try{
        let unidade = await unidades.findById(unidadeID).exec();
        if(! unidade) return {status:false, msg:["Unidade não encontrada"]};

        let findUser = unidade.users.some(u => u.login == user.login)
        if(findUser) return {status:false, msg:["Este usuario já existe"]};

        unidade.users.push(user);
        await unidade.save();

        return {status:true, msg:["User adicionado com sucesso"]}
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao se conectar com o DB", error]}
    }
}

//Query

async function queryUnidades (){
    try{
        let allUnidades = await unidades.find().exec();
        return {
            status:true,
            msg:["Unidades listadas com sucesso"],
            data:allUnidades,
        }
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao listar unidades", error], data:[]};
    }
}

async function queryLocais (unidadeID){
    try{
        let unidade = await unidades.findById(unidadeID).exec();
        let locais = unidade.locais;
        return {
            status:true,
            msg:["Locais listados com sucesso"],
            data:locais,
        }
    }catch(error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao listar locais", error], data:[]}
    }
}

async function queryUsers (unidadeID){
    try{
        let unidade = await unidades.findById(unidadeID).exec();
        let users = unidade.users;
        return {
            status:true,
            msg:["Usuários Listados com sucesso"],
            data:users,
        }
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao listas usuários", error], data:[]}
    }
}

//Edit

async function editUnidade (unidade, unidadeID){
    try{
        await unidades.updateOne({
            _id: unidadeID,
        },{
            $set:{
                name:unidade.name,
            }
        })
        return {status:true, msg:["Unidade editada com sucesso"]};
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao editar unidade", error]};
    }
}

async function editLocal (local, unidadeID){
    try{
        await unidades.updateOne({
            _id:unidadeID,
            "users.name":local.lastName
        }, {
            $set:{
                "local.$.name":local.name,
            }
        })
        return {status:true, msg:["Local alterado com sucesso"]};
    } catch (error){
        console.log("Erro --> "+error);
        return {status:true, msg:["Erro ao alterar local", error]};
    }
}
/*
const unidade = await Unidade.findById(unidadeID);

const local = unidade.locais.find(loc => loc.name === "Sala 1");
if (local) {
    local.name = "Sala Principal";
    local.fila = [1, 2, 3, 4];
}

await unidade.save();
*/ 

//-----

module.exports = {
    addUnidade, 
    addLocal, 
    addUser,
    queryUnidades,
    queryLocais,
    queryUsers,
    editUnidade,
    editLocal,
}