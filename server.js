// Module einbringen:

const express = require('express');
const bodyParser = require('body-parser');
const lescape = require('escape-latex');
const latex = require('node-latex');
const fs = require('fs');

// Variabeln definieren, die als States genutzt werden
let Löschstate = true;
let Sendstate = false;

const app = express();
const FilePath = __dirname + '/output.pdf';

 
//Express sagen was es tun soll:
// Parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: true }));


// Wenn die http route / aufgerufen wird, wird auf diesen GET request als antwort die index.htlm gesendet, die sich im public folder befindet

  app.get('/', (req, res) => {

    res.sendFile(__dirname + '/public/index.html');
  
  });
  
  
   // Sobald /generate-muster aufgerufen wird, passiert folgendes:
  
  app.post('/generate-muster', (req, res) => {
    // Die Daten des html forms werden von der request in dem bodyparser in das Objket 'data' geschrieben
    const data = req.body;
    // es werden neue variablen definiert:
    // ortData ist ein String der Output der lescape funktion ist, die von dem escape-latex modul kommt. Hier wird ein String eingegeben und alle Latex relevanten charaktäre wie z.b. {,} \ werden durch "nicht latex relevante" ersetzt.
    // dabei ist data.erste der string des values von 'erste' in dem data objekt.
    const variable1Data = lescape(data.erste, {preserveFormating: true});
    const variable2Data = lescape(data.zweite, {preserveFormating: true});
  
  
   
  // die muster.tex datei wird aus dem dateinsystem gelesen und als string die die variable inputString gespeichert.
    const inputString = fs.readFileSync('muster.tex').toString();

    // hier passier die Magie:
    //in dem Latex string werden jetzt die platzhalter wie z.b. 'hierwirdspäterersetzt' mit dem Wert der Variable ersetzt von variable1Data.
    // d.h. es ist wichtig, dass die Platzhalter in eurem Latex dokument einzigartig sind, da alles ersetzt wird, was so heißt.
    const input_1 = inputString.replace('hierwirdspäterersetzt',variable1Data).replace('MaxMustereintrag',variable2Data);
    // wenn es mehr als 2 variablen gibt dann muss auch jeweils eine weitere replace funktion hinzugefügt werden.



    // A1
    const output = fs.createWriteStream('output.pdf');
    // erst wenn die Löschugn der vorherigen datei erfolgreich war wird der folgende code ausgeführt.
    if(Löschstate === false){
      res.sendStatus(500);
      console.log('Output kann nicht erzeugt werden, da Löschung unvollständig');
      return;

    }
    else{
      // hier wird jetzt der neue String, der unsern Latex code enthält und die ersetzten variablen in 
      // die funktion latex eingesetzt, die zusammen mit dem 'output' stream (siehe A1) die pdf generiert und als output.pdf speichert 
      const pdf = latex(input_1);
      pdf.pipe(output);
      res.setHeader('Content-Type', 'application/pdf');

      
      output.on('finish', () => {
        // erst wenn die datei vollkommen generiert wurde wird sie an den client gesendet. 
        res.sendFile(__dirname + '/output.pdf');
        res.on('finish', ()=> {
          Sendstate = true;
          console.log('Sending complete');
          console.log(Sendstate);
        
          return Sendstate;
        });
      });
    };
// hier wird alle 1000ms gecheckt ob sendstate true ist, welches erst nach vollständigem senden der pdf true wird.
// danach wird die output.pdf gelöscht mit der deletfile() funktion
    const interval = setInterval(() => {
      if (Sendstate === true) {
        clearInterval(interval); // Intervall beenden
        deletfile();
      }
    }, 1000);
    
  });

// funktion die die output datei löscht

function deletfile() {
  if(Sendstate === false){
    console.log('sending not yet complete')
    
  }
  else{
    fs.unlink(FilePath, (err) => {
      if (err) {
        console.error('There was an error whil deleting:', err);
        Löschstate = false;
        
        return Löschstate;
      } else {
        console.log('File succesfully deleted!');
        
      }
    });
  };
};

// Express Server fängt an auf Anfragen auf Port 3001 zu warten.

app.listen(3001, () => {

  console.log('Server listening on port 3001');

});
