const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const url = 'mongodb://localhost/Charts';
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(
    "mongodb://localhost:27017/Charts",
    {useUnifiedTopology:true}
);
var db=mongoose.connection;
db.on('error',console.log.bind(console,"connection error"));
db.once('open',function(callback){
    console.log("Connection success");
});


app.get('/',async(req,res)=>{
    var ss=await db.collection('Data').find({});
    var arr=await ss.toArray();
    let countryList=[];
    var i;
    var CountinentCount={
        "Africa":0,
        "Asia":0,
        "Europe":0,
        "NorthAmerica":0,
        "Oceania":0,
        "SouthAmerica":0,
    };
    var companyCount={
        "FAMANG":0,
        "EstablishedStartups":0,
        "Startups":0,
        "Service":0,
        "Unicorn":0,
    };
    for(i=0;i<arr.length;i++){
        //countryList.push(arr[i].Country);
        var continentCollection=await db.collection('Countries').findOne({Country:arr[i].Country});
        if(continentCollection.Continent=="Asia"){
            CountinentCount["Asia"]+=1;
        }else if(continentCollection.Continent=="Africa"){
            CountinentCount["Africa"]+=1;
        }else if(continentCollection.Continent=="North America"){
            CountinentCount["NorthAmerica"]+=1;
        }else if(continentCollection.Continent=="South America"){
            CountinentCount["SouthAmerica"]+=1;
        }else if(continentCollection.Continent=="Europe"){
            CountinentCount["Europe"]+=1;
        }else{
            CountinentCount["Oceania"]+=1;
        }
        //console.log(continentCollection.Continent);
    }
    for(i=0;i<arr.length;i++){
        //countryList.push(arr[i].Country);
        var companyCategory=await db.collection('Companies').findOne({Company:arr[i].Company});
        if(companyCategory.Category =="Startups"){
            companyCount["Startups"]+=1;
        }else if(companyCategory.Category=="Service"){
            companyCount["Service"]+=1;
        }else if(companyCategory.Category=="Unicorn"){
            companyCount["Unicorn"]+=1;
        }else if(companyCategory.Category=="Established StartUps"){
            companyCount["EstablishedStartups"]+=1;
        }else{
            companyCount["FAMANG"]+=1;
        }
       // console.log(companyCategory);
       
    }
    // console.log(j);
    // console.log(arr);
   // console.log(countryList);
   console.log(CountinentCount);
   console.log(companyCount);
    res.render('index',{
        Africa:CountinentCount.Africa,
        Asia:CountinentCount.Asia,
        Europe:CountinentCount.Europe,
        NorthAmerica:CountinentCount.NorthAmerica,
        SouthAmerica:CountinentCount.SouthAmerica,
        Oceania:CountinentCount.Oceania,
        FAMANG:companyCount.FAMANG,
        EstablishedStartups:companyCount.EstablishedStartups,
        Startups:companyCount.Startups,
        Service:companyCount.Service,
        Unicorn:companyCount.Unicorn,        
    });
});

app.listen(3000,function(){
    console.log('Server started');
});

