const jwt = require("jsonwebtoken");
const painel = require("../controllers/painel");

async function setToken (unidadeID, login, password){
    try{
        let user = {};
        if (unidadeID == "admin"){
            const admin = await painel.queryAdmin();
            user = {
                name:undefined,
                tipo:undefined,
                token:undefined,
            }
            if (admin.data[0].login == login && admin.data[0].password == password){
                user = {
                    name:admin.data[0].login,
                    tipo:admin.data[0].tipo,
                };
            }   
            if (user.name == undefined) return {status:false, msg:["Usuário não encontrado"]};
        }
        else{
            const users = await painel.queryUsers(unidadeID);

            user = {
                name:undefined,
                local:undefined,
                tipo:undefined,
                token:undefined,
            };
            for(u of users.data){
                if (u.login == login && u.password == password){
                    user.name = u.login;
                    user.tipo = u.tipo;
                    user.local = u.local;
                    break;
                }
            }

            if (user.name == undefined) return {status:false, msg:["Usuário não encontrado"]};
        }

        user.token = jwt.sign(
            {password},
            login,
            {expiresIn:"12h"}
        )

        return {status:true, msg:["Usuário logado com sucesso"], data:user};    
    } catch (error){
        console.log("Erro --> "+error);
        return {status:true, msg:["Erro ao fazer login", error], data:{}};
    }
    

}

async function verifyToken (token, login){
    try{
        const decoded = jwt.verify(token, login);
        return {status:true, msg:["Usuário válido"]};    
    } catch (error){
        console.log("Erro --> "+error);
        return {status:false, msg:["Usuário Inválido"]};
    }
    
}

module.exports = { setToken, verifyToken }