const db = require("../models/painel");
const { admin, unidades } = db;

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
        const allUnidadesReturn = [];
        let allUnidades = await unidades.find().exec();
        allUnidades.forEach((item, index) => {
            allUnidadesReturn[index] = {}
            allUnidadesReturn[index]._id = item._id;
            allUnidadesReturn[index].name = item.name;
            allUnidadesReturn[index].users = item.users.length;
            allUnidadesReturn[index].locais = item.locais.length;
        })
        return {
            status:true,
            msg:["Unidades listadas com sucesso"],
            data:allUnidadesReturn,
        }
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao listar unidades", error], data:[]};
    }
}

async function queryLocais (unidadeID){
    try{
        let unidade = await unidades.findById(unidadeID).exec();
        if(! unidade) return {status:false, msg:["Erro ao encontrar unidade"]}

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

async function queryAdmin (){
    try{
        const userAdmin = await admin.find().exec();
        return {
            status:true,
            msg:["Admin encontrado"],
            data:userAdmin,
        }

    } catch(error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao buscar admin", error], data:[]}
    }
}

async function queryUsers (unidadeID){
    try{
        let unidade = await unidades.findById(unidadeID).exec();
        if(! unidade) return {status:false, msg:["Erro ao encontrar unidade"]}

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

async function queryUnidade (unidadeID){
    try{
        let unidade = await unidades.findById(unidadeID).exec();
        return {
            status:true,
            msg:["Unidade listada com sucesso"],
            data:unidade,
        }
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao listar unidade", error], data:[]};
    }
}

async function queryLocal (unidadeID, localName){
    try{
        let local = await unidades.findOne({
            _id:unidadeID,
            "locais.name":localName,
        },{
            "locais.$":1
        })
        return {
            status:true,
            msg:["Local listado com sucesso"],
            data:local,
        }
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao listar local", error], data:[]};
    }
}

async function queryUser (unidadeID, userName){
    try{
        let user = await unidades.findOne({
            _id:unidadeID,
            "users.login":userName,
        },{
            "users.$":1
        })
        return {
            status:true,
            msg:["User listado com sucesso"],
            data:user,
        }
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao listar user", error], data:[]};
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
        const unidade = await unidades.findById(unidadeID).exec();
        if(! unidade) return {status:false, msg:["Erro ao encontrar unidade"]}

        const queryLocal = unidade.locais.find(l => l.name == local.lastName);
        if (local) {
            queryLocal.name = local.name

            unidade.users.forEach((u) => {
                if(u.local == local.lastName)
                    u.local = local.name;
            })

            await unidade.save();
            return {status:true, msg:["Local alterado com sucesso"]};
        }
        return {status:false, msg:["Local não encontrado"]};
    } catch (error){
        console.log("Erro --> "+error);
        return {status:true, msg:["Erro ao alterar local", error]};
    }
}

async function editUser (user, unidadeID){
    try{
        const unidade = await unidades.findById(unidadeID).exec();
        if(! unidade) return {status:false, msg:["Erro ao encontrar unidade"]}

        const queryUser = unidade.users.find(u => u.login == user.lastLogin);
        if (user){
            queryUser.login = user.login;
            queryUser.tipo = user.tipo;
            queryUser.password = user.password;
            queryUser.local = user.local;
            await unidade.save();
            return {status:true, msg:["Usuário alterado com sucesso"]};
        }
        return {status:false, msg:["Usuário não encontrado"]};
    } catch (error){
        console.log("Erro --> "+error);
        return {status:true, msg:["Erro ao alterar o usuário", error]};
    }
}

//Del

async function delUnidade (unidadeID){
    try {
        await unidades.deleteOne({_id:unidadeID});
        return {status:true, msg:["Unidade deletada com sucesso"]};
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao deletar unidade", error]};
    }
}

async function delUser (unidadeID, userName){
    try{
        await unidades.updateOne(
            {_id:unidadeID},
            {$pull:{users:{login:userName}}}
        );
        return {status:true, msg:["Usuário deletado com sucesso"]}
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao deletar usuário", error]};
    }
}

async function delLocal (unidadeID, localName) {
    try{
        await unidades.updateOne(
            {_id:unidadeID},
            {$pull:{locais:{name:localName}}}
        );
        return {status:true, msg:["Local deletado com sucesso"]};
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao deletar local", error]};
    }
    
}

//Senhas

async function addSenha (local, unidadeID){
    try{
        const unidade = await unidades.findById(unidadeID).exec();
        if(! unidade) return {status:false, msg:["Erro ao encontrar unidade"], data:{}} 

        const queryLocal = unidade.locais.find(l => l.name == local.local);
        if(! queryLocal) return {status:false, msg:["Local não encontrado"], data:{}}

        let i;
        let divison = false;
        for(i=0; i<unidade.locais.length && divison == false;){
            if(unidade.locais[i].name == local.local)
                divison = true;
            i++;
        }

        let newSenha = {};
        if (queryLocal.fila.length < 1){
            newSenha.senha = 1;
            newSenha.divison = String.fromCharCode(64+i)
            newSenha.tipo = local.tipo;
        } else {
            newSenha.senha = queryLocal.fila[queryLocal.fila.length - 1].senha + 1;
            newSenha.divison = String.fromCharCode(64+i)
            newSenha.tipo = local.tipo;
        }

        queryLocal.fila.push(newSenha)
        await unidade.save();
        return {status:true, msg:["Senha criada com sucesso"], data:{senha:newSenha}};
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao criar senha", error], data:{}};
    }
}

async function delSenhas (unidadeID, localName){
    try{
        await unidades.updateOne(
            {_id:unidadeID, "locais.name":localName},
            {$set:{"locais.$.fila": [], "locais.$.lastFila": []}}
        )
        return {status:true, msg:["Filas resetadas"]};
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao deletar senhas", error]};
    }
}

//Atendimento

async function querySenhas (unidadeID, localName){
    try{
        const unidade = await unidades.findById(unidadeID).exec();
        if (! unidade) return {status:false, msg:["Unidade não encontrada"], data:[]};

        const local = unidade.locais.find(l => l.name == localName);
        if (! local) return {status:false, msg:["Local não encontrado"], data:[]};

        let senhas = [];
        let i = 0;
        local.fila.forEach((s) => {
            if (s.chamado == false){
                senhas[i] = s;
                i++;
            }
        })

        return {status:true, msg:["Fila listada com sucesso"], data:senhas};
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao buscar fila"], data:[]};
    }
}

async function chamarSenha (unidadeID, localName){
    try{
        const unidade = await unidades.findById(unidadeID).exec();
        if (! unidade) return {status:false, msg:["Erro ao buscar unidade"]};

        const local = unidade.locais.find(l => l.name == localName);
        if (! local) return {status:false, msg:["Erro ao buscar local"]};

        let next = false;
        for (s of local.fila){
            if(s.tipo == "prioridade" && s.chamado == false){
                s.chamado = true;
                next = true;
                break;
            }
        }
        if (! next){
            for(s of local.fila){
                if(s.tipo == "normal" && s.chamado == false){
                    s.chamado = true;
                    next = true;
                    break;
                }     
            }
        }
        
        if(! next) return {status:false, msg:["Fila vazia"]}

        await unidade.save();
        return {status:true, msg:["Senha chamada com sucesso"]};

    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao chama senha", error]};
    }
}

async function atenderSenha (unidadeID, localName){
    try{
        const unidade = await unidades.findById(unidadeID).exec();
        if (! unidade) return {status:false, msg:["Unidade não encontrada"]};

        const local = unidade.locais.find(l => l.name == localName);
        if (! local) return {status:false, msg:["Local não encontrado"]};

        for(s of local.fila){
            if (s.chamado && ! s.atendido){
                s.atendido = true;
                local.lastFila.push(s);
                break;
            }
        }

        await unidade.save();
        return {status:true, msg:["Senha Chamada com sucesso"]};

    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro oa iniciar atendimento", error]};
    }
}

//Painel

async function queryLastSenhas (unidadeID, localName){
    try{
        const unidade = await unidades.findById(unidadeID).exec();
        if (! unidade) return {status:false, msg:["Unidade não encontrada"], data:[]};

        const local = unidade.locais.find(l => l.name == localName);
        if (! local) return {status:false, msg:["Local não encontrado"], data:[]};

        return {status:true, msg:["Ultimas senhas listada com sucesso"], data:local.lastFila};
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Erro ao buscar ultimas senhas"], data:[]};
    }
}

//-----

module.exports = {
    addUnidade, 
    addLocal, 
    addUser,
    queryUnidades,
    queryLocais,
    queryUsers,
    queryAdmin,
    queryUnidade,
    queryLocal,
    queryUser,
    editUnidade,
    editLocal,
    editUser,
    delUnidade,
    delUser,
    delLocal,
    addSenha,
    delSenhas,
    querySenhas,
    chamarSenha,
    atenderSenha,
    queryLastSenhas,
}