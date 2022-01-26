let musicians = [];
/*
 * Our application protocol specifies the following default multicast address and port
 */

const PROTOCOL_MULTICAST_ADDRESS = "239.255.22.5";
const PROTOCOL_PORT = 9907;
/*
 * We use a standard Node.js module to work with UDP
 */
const dgram = require('dgram');
const { count, time } = require('console');

/* 
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by thermometers and containing measures
 */
const s = dgram.createSocket('udp4');
s.bind(PROTOCOL_PORT, function() {
    console.log("Joining multicast group");
    
    s.addMembership(PROTOCOL_MULTICAST_ADDRESS);
});

function addMusician(noise, uuid){
    let musician = {
        uuid : uuid,
        instrument : 'piano',
        activeSince: Date.now(),
        lastActivity: Date.now()
    };
    musicians.unshift(this);
}

function removeMusician(index){
    musicians.splice(index,1);
}

setInterval(() => {
    let msg = []
    let data = [];
    musicians.forEach(m => {
        data += {
            uuid: m['uuid'],
            instrument: m['instrument'],
            activeSince: m['activeSince']
        };
        console.log(msg.push(data));
    });
    console.log(data);
    if (data.length <= 0)
    return JSON.stringify(msg);
}, 1000);

/* 
 * This call back is invoked when a new datagram has arrived.
 */
s.on('message', function(musician) {
    musicians.forEach(m => {
        if (Date.now() - m['lastActivity'] < 5000) {
            removeMusician(musicians.indexOf(m));
        }
        if(m.uuid == musician.uuid){
            m['lastActivity'] = Date.now();
            return;
        }
    });
    addMusician(musician['noise'],musician['uuid']);
});

