const { Telnet } = require('telnet-client');
const connection = new Telnet();

const params = {
  host: '10.103.0.6', // Replace with the IP address of your Cisco device
  port: 23, // The Telnet port (usually 23)
  shellPrompt: '/ # ',
  timeout: 1500,
};

const password = 'your_password'; // Replace with your Telnet password
const command = 'show run'; // Replace with the desired command

connection.on('ready', () => {
  // Send the Telnet password
  connection.exec(password, (err, response) => {
    if (err) {
      console.error('Error entering password:', err);
    } else {
      console.log(response);
      // Now, send the command
      connection.exec(command, (err, response) => {
        if (err) {
          console.error('Error executing command:', err);
        } else {
          console.log(response);
          // Close the Telnet session
          connection.end();
        }
      });
    }
  });
});

connection.on('timeout', () => {
  console.log('Socket timeout!');
  connection.end();
});

connection.on('close', () => {
  console.log('Connection closed');
});

connection.connect(params);
