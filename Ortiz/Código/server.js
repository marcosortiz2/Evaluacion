'use strict';
 
const ADODB = require('node-adodb');
const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=base.mdb;');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.post('/inst', (req, resp) => {

    const exe = `INSERT INTO Notebooks(Marca, Modelo, Disco, RAM) VALUES ("${req.body.marca}", "${req.body.mod}", ${req.body.disk}, ${req.body.ram})`;
    connection
    .execute(exe)
    .then(data => {
        console.log(JSON.stringify(data, null, 2));
    })
    .catch(error => {
        console.error(error);
    });
    
    
    resp.redirect('/');
});

app.get('/send', (req, resp) => {
    
    connection
    .query('SELECT * FROM Notebooks')
    .then(data => {
        resp.json({data: data});
    })
    .catch(error => {
        console.error(error);
    });
});

app.delete('/elim', (req, resp) => {
    connection
    .execute(`DELETE * FROM Notebooks WHERE Id = ${req.body.id}`)
    .then(data => {
        resp.end();
    })
    .catch(error => {
        console.error(error);
    });
})


app.post('/actualizar', (req, resp) => {
    const data = req.body.data;
    const exe = `UPDATE Notebooks
    SET Marca = "${data.marca}", Modelo = "${data.mod}", Disco = ${data.disk}, RAM = ${data.ram}
    WHERE Id = ${data.id};`;
      connection
      .execute(exe)
      .then(data => {
        console.log("DONE!");
      })
      .catch(error => {
        console.error(error);
      });

      resp.end();
});


app.post('/modelo', (req, resp) => {
    const qry = 'SELECT * FROM Notebooks WHERE Modelo = "'+ req.body.qry+'"';
    connection
        .query(qry)
        .then(data => {
            resp.json({data: data});
        })
        .catch(error => {
            console.error(error);
        });
});

app.post('/marca', (req, resp) => {
    const qry = 'SELECT * FROM Notebooks WHERE Marca = "'+ req.body.qry+'"';
    connection
        .query(qry)
        .then(data => {
            resp.json({data: data});
        })
        .catch(error => {
            console.error(error);
        });
});


app.use(express.static('public'));

app.listen(3000, () => {
 console.log("Server running on port 3000");
});