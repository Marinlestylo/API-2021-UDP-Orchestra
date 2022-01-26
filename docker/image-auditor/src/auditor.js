/*
 * Our application protocol specifies the following default multicast address and port
 */

const PROTOCOL_MULTICAST_ADDRESS = "239.255.22.5";
const PROTOCOL_PORT = 9907;
const TCP_PORT = 2205;
/*
 * We use a standard Node.js module to work with UDP
 */
const dgram = require('dgram');
const { count, time } = require('console');
let net = require('net');

/* 
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by thermometers and containing measures
 */
const s = dgram.createSocket('udp4');

s.bind(PROTOCOL_PORT, function() {
    console.log("Joining multicast group");
    
    s.addMembership(PROTOCOL_MULTICAST_ADDRESS);
});

const server = net.createServer();

server.listen(TCP_PORT);

server.on('connection', function onConnect(socket) {
    let msg = [];
    musicians.forEach(m => {
        if (Date.now() - m['lastActivity'] > 5000) {
            removeMusician(m.index);
            return;
        } 
        let musician = {
            uuid: m['uuid'],
            instrument: m['instrument'],
            activeSince: new Date(m['activeSince'])
        }
        msg.unshift(musician);
    });
    socket.write(JSON.stringify(msg) + '\n');
    socket.end();
});

let musicians = [];
const allInstruments = {
    piano: 'ti-ta-ti',
    trumpet: 'pouet',
    flute: 'trulu',
    violin: 'gzi-gzi',
    drum: 'boum-boum'
};

function addMusician(noise, id) {
    let musician = {
        uuid: id,
        instrument : Object.keys(allInstruments).find(key => allInstruments[key] === noise),
        activeSince: Date.now(),
        lastActivity: Date.now()
    };
    musicians.unshift(musician);
}

function removeMusician(index){
    musicians.splice(index,1);
}

/* 
 * This call back is invoked when a new datagram has arrived.
 */
s.on('message', function (musician) {
    const mus = JSON.parse(musician);
    let addNew = true;
    musicians.forEach(m => {
        if (m['uuid'] == mus.uuid) {
            addNew = false;
            m['lastActivity'] = Date.now();
        } 
    });
    if(addNew){
        addMusician(mus.noise,mus.uuid);
    }
});

