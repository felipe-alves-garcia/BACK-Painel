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

//-----

app.get("/", (req, res) => {
    res.status(200).send("Painel");
})

//Adicionar Unidade
app.post("/unidade/add", (req, res) => {
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
    painel.queryLocais(req.params.unidade).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Pesquisar Usuários
app.get("/unidade/users/:unidade", async (req, res) => {
    painel.queryUsers(req.params.unidade).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    });
});

//Editar Unidade
app.put("/unidade/edit/:unidade", async (req, res) => {
    painel.editUnidade({name:req.body.name}, req.params.unidade).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Editar Local
app.put("/unidade/local/edit/:unidade", async (req, res) => {
    painel.editLocal({name:req.body.name, lastName:req.body.lastName}, req.params.unidade).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Editar Usuário
app.put("/unidade/user/edit/:unidade", async (req, res) => {
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

//Criar Senha
app.put("/senha/:unidade", async (req, res) => {
    painel.addSenha({
        local:req.body.local,
        tipo:req.body.tipo
    }, req.params.unidade).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Listar Fila
app.get("/fila/senhas/:unidade/:local", async (req, res) => {
    painel.querySenhas(req.params.unidade, req.params.local).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    })
});

//Chamar Senha
app.put("/fila/senha/chamar/:unidade/:local", async (req, res) => {
    painel.chamarSenha(req.params.unidade, req.params.local).then((resp) => {
        res.send(resp);
    }).catch((error) => {
        res.send(error);
    });
});

module.exports = app;