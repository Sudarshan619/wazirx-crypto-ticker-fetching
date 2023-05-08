const express = require("express");
const app = express();
const mysql = require("mysql");
const request = require("request");
const ejs = require("ejs")
app.use(express.static('public'));
app.set("view engine", "ejs");



app.use(express.static('public'));
const https = require("https");

app.listen(3000, () => {
    console.log("listen")
})
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sudu123',

    database: 'train',
});
connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connection created");
    }
});
const url = ("https://api.wazirx.com/api/v2/tickers");
const fun = function () {
    https.get(url, (response) => {
        let data = '';
        response.on('data', (data1) => {
            data += data1;
        });
        response.on('end', () => {
            const ans = JSON.parse(data);
            // const newans = ans.slice(0,10);
            console.log(ans);
            let length = 0;


            for (let i in ans) {
                const name = ans[i].name;
                const buy = ans[i].buy;
                const sell = ans[i].sell;
                const last = ans[i].last;
                const base_unit = ans[i].base_unit;
                const volume = ans[i].volume;
                if (length < 20) {
                    connection.query("INSERT INTO wazirx.tokens  (id,name,buy,sell,last,base_unit,volume) VALUES(?,?,?,?,?,?,?)", [null, name, buy, sell, last, base_unit, volume], (error, result) => {
                        if (error) {
                            console.log(error)
                        };
                    })
                    console.log(name);
                    length++;
                }

            }

        });
    
    }).on("error", (err) => {
        console.log(err);
    })

}


app.get('/', (req, res) => {
    
    connection.query("SELECT * FROM wazirx.tokens", (error, result) => {
        if (error) {
            throw error;
        }
        res.render('coins', { user: result });
    })


})
fun();








