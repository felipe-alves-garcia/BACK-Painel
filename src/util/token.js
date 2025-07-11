const jwt = require("jsonwebtoken");
const painel = require("../controllers/painel");

async function setToken (unidadeID, login, password){
    try{
        const users = await painel.queryUsers(unidadeID);

        let user = {
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