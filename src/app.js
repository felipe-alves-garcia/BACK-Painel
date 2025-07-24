const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

//-----

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//-----

app.use((req, res, next) => {
    console.log("---===> Middleware <===---")
    next();
})

//-----

const db = require("./models/db");
db.conexaoDB().then((resp) => {
    console.log("Conexão com DB - Sucesso :) ")
}).catch((error) => {
    console.log("Conexão com DB - Falhada --> "+error)
})

const painel = require("./controllers/painel");
const token = require("./util/token");

//-----

app.get("/", (req, res) => {
    res.status(200).send("Painel");
})

//Login
app.get("/login/:unidade/:user/:password", async (req, res) => {
    token.setToken(
        req.params.unidade,
        req.params.user,
        req.params.password
    ).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    });
});

//Adicionar Unidade
app.post("/unidade/add", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status || req.headers.user != "admin") 
        return res.send({status:false, msg:["Usuário Inválido"]});

    painel.addUnidade({
        name:req.body.name,
    }).then((resp) => {
        res.status(200).send(resp); 
    }).catch((error) => {
        res.send(error);
    })
});

//Adicionar Local
app.post("/unidade/local/add/:unidade", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status || req.headers.user != "admin") 
        return res.send({status:false, msg:["Usuário Inválido"]});

    painel.addLocal({
        name:req.body.name,
        fila:[],
    }, req.params.unidade).then((resp) => {
        res.status(200).send(resp); 
    }).catch((error) => {
        res.send(error);
    })
});

//Adicionar Usuário
app.post("/unidade/user/add/:unidade", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status || req.headers.user != "admin") 
        return res.send({status:false, msg:["Usuário Inválido"]});

    if(req.body.password == req.body.password2){
        painel.addUser({
            login:req.body.login,
            password:req.body.password,
            tipo:req.body.type,
            local:req.body.local
        }, req.params.unidade).then((resp) => {
            res.status(200).send(resp); 
        }).catch((error) => {
            res.send(error);
        })    
    } else {
        res.send({status:false, msg:["Senhas diferentes"]});
    }
});

//Pesquisar Unidades
app.get("/unidades", async (req, res) => {
    painel.queryUnidades().then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Pesquisar Locais
app.get("/unidade/locais/:unidade", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status) return res.send({status:false, msg:["Usuário Inválido"]});

    painel.queryLocais(req.params.unidade).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Pesquisar Usuários
app.get("/unidade/users/:unidade", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status) return res.send({status:false, msg:["Usuário Inválido"]});

    painel.queryUsers(req.params.unidade).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    });
});


//Pesquisar Unidade
app.get("/unidade/:unidade", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status) return res.send({status:false, msg:["Usuário Inválido"]});

    painel.queryUnidade(req.params.unidade).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Pesquisar Local
app.get("/unidade/local/:unidade/:local", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status) return res.send({status:false, msg:["Usuário Inválido"]});

    painel.queryLocal(req.params.unidade, req.params.local).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Pesquisar Usuário
app.get("/unidade/user/:unidade/:user", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status) return res.send({status:false, msg:["Usuário Inválido"]});

    painel.queryUser(req.params.unidade, req.params.user).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    });
});

//Editar Unidade
app.put("/unidade/edit/:unidade", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status || req.headers.user != "admin") 
        return res.send({status:false, msg:["Usuário Inválido"]});

    painel.editUnidade({name:req.body.name}, req.params.unidade).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Editar Local
app.put("/unidade/local/edit/:unidade", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status || req.headers.user != "admin") 
        return res.send({status:false, msg:["Usuário Inválido"]});

    painel.editLocal({name:req.body.name, lastName:req.body.lastName}, req.params.unidade).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Editar Usuário
app.put("/unidade/user/edit/:unidade", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status || req.headers.user != "admin") 
        return res.send({status:false, msg:["Usuário Inválido"]});

    painel.editUser({
        lastLogin:req.body.lastLogin,
        login:req.body.login,
        tipo:req.body.tipo,
        password:req.body.password,
        local:req.body.local,
    }, req.params.unidade).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    });
});

//Deletar Unidade
app.delete("/unidade/del/:unidade", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status || req.headers.user != "admin") 
        return res.send({status:false, msg:["Usuário Inválido"]});

    painel.delUnidade(req.params.unidade).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    });
});

//Deletar Usuário
app.delete("/unidade/user/del/:unidade/:user", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status || req.headers.user != "admin") 
        return res.send({status:false, msg:["Usuário Inválido"]});

    painel.delUser(
        req.params.unidade,
        req.params.user
    ).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Deletar Local
app.delete("/unidade/local/del/:unidade/:local", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status || req.headers.user != "admin") 
        return res.send({status:false, msg:["Usuário Inválido"]});

    painel.delLocal(
        req.params.unidade,
        req.params.local
    ).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Criar Senha
app.put("/fila/senha/add/:unidade", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status || req.headers.user == "atendimento" || req.headers.tipo == "painel") 
        return res.send({status:false, msg:["Usuário Inválido"]});

    painel.addSenha({
        local:req.body.local,
        tipo:req.body.tipo
    }, req.params.unidade).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Deletar Senhas
app.delete("/fila/senhas/del/:unidade/:local", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status || req.headers.user == "atendimento" || req.headers.tipo == "painel") 
        return res.send({status:false, msg:["Usuário Inválido"]});
    
    painel.delSenhas(
        req.params.unidade,
        req.params.local
    ).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Listar Fila
app.get("/fila/senhas/:unidade/:local", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status || req.headers.user == "triagem" || req.headers.tipo == "painel") 
        return res.send({status:false, msg:["Usuário Inválido"]});

    painel.querySenhas(req.params.unidade, req.params.local).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Chamar Senha
app.put("/fila/senha/chamar/:unidade/:local", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status || req.headers.user == "triagem" || req.headers.tipo == "painel") 
        return res.send({status:false, msg:["Usuário Inválido"]});

    painel.chamarSenha(req.params.unidade, req.params.local).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    });
});

//Atender Senha
app.put("/fila/senha/atender/:unidade/:local", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status || req.headers.user == "triagem" || req.headers.tipo == "painel") 
        return res.send({status:false, msg:["Usuário Inválido"]});

    painel.atenderSenha(req.params.unidade, req.params.local).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Pesquisar Ultimas Senhas
app.get("/fila/senhas/last/:unidade/:local", async (req, res) => {
    const verify = await token.verifyToken(req.headers.token, req.headers.login);
    if(! verify.status || req.headers.user != "painel") 
        return res.send({status:false, msg:["Usuário Inválido"]});
    painel.queryLastSenhas(req.params.unidade, req.params.local).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        req.send(error);
    })
});

module.exports = app;