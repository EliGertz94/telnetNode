const { Telnet } = require('telnet-client');
const connection = new Telnet();

const params = {
  host: '10.103.0.6', // Replace with the IP address of your network device
  port: 23, // The Telnet port (usually 23)
  shellPrompt: '/ # ',
  timeout: 1500,
};

const vlanConfigCommands = [
  'enable', // Enter enable mode (if needed)
  'configure terminal', // Enter global configuration mode
  'vlan 10', // Create VLAN 10 (replace with your desired VLAN configuration)
  'name MyVLAN', // Set VLAN name (replace with your desired name)
  'exit', // Exit VLAN configuration mode
  'exit', // Exit global configuration mode
  'write memory', // Save the configuration (if applicable)
  'exit', // Exit Telnet session
];

connection.on('ready', () => {
  // Send each Telnet command in sequence
  sendCommandsSequentially(0);

  function sendCommandsSequentially(index) {
    if (index < vlanConfigCommands.length) {
      const cmd = vlanConfigCommands[index];
      connection.exec(cmd, (err, response) => {
        if (err) {
          console.error(`Error executing command: ${cmd}`);
        } else {
          console.log(response);
        }
        // Continue sending commands
        sendCommandsSequentially(index + 1);
      });
    } else {
      // All commands have been sent, close the connection
      connection.end();
    }
  }
});

connection.on('timeout', () => {
  console.log('Socket timeout!');
  connection.end();
});

connection.on('close', () => {
  console.log('Connection closed');
});

connection.connect(params);
