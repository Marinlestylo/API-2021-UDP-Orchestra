const dgram = require('dgram');
let s = dgram.createSocket('udp4');
const { v4: uuidv4 } = require('uuid');
const allInstruments = {
    piano: 'ti-ta-ti',
    trumpet: 'pouet',
    flute: 'trulu',
    violin: 'gzi-gzi',
    drum: 'boum-boum'
};


function Musician(instrument) {
    this.instrument = instrument;
    // Si l'instrument n'est pas dans le tableau, on quitte
    if(!(instrument in allInstruments)){
        console.log('This instrument does not exist !');
        return;
    }
    
    // On crée une fonction send qui envoie le son de l'instrument 
    // ainsi qu'un unique id représentant le musicien.
    Musician.prototype.send = function () {
        let musician = {
            noise: allInstruments[instrument],
            uuid: uuidv4()
        };
        let data = JSON.stringify(musician);

        // La méthode buffer étant dépréciée, nous utilisons son remplacent Buffer.from
        message = new Buffer.from(data);
        s.send(message, 0, message.length, 9907, "239.255.22.5", function (err, bytes) {
            console.log("Data sent: " + data + " via port " + s.address().port);
        });

    }
    // On envoie des données toutes les secondes
    setInterval(this.send.bind(this), 1000);

}
let muse = new Musician(process.argv[2]);