const { Telnet } = require('telnet-client');
const connection = new Telnet();

const params = {
  host: '10.103.0.6', // Replace with the IP address of your Cisco device
  port: 23, // The Telnet port (usually 23)
  shellPrompt: '/ # ',
  timeout: 1500,
};

const telnetPassword = 'your_telnet_password'; // Replace with your Telnet password
const enablePassword = 'your_enable_password'; // Replace with your enable password
const enableCommand = 'en'; // Command to enter enable mode
const showRunCommand = 'sh run'; // Command to display the running configuration

connection.on('ready', () => {
  // Send the Telnet password
  connection.exec(telnetPassword, (err, response) => {
    if (err) {
      console.error('Error entering Telnet password:', err);
    } else {
      console.log(response);
      // Now, send the enable command
      connection.exec(enableCommand, (err, response) => {
        if (err) {
          console.error('Error entering enable command:', err);
        } else {
          console.log(response);
          // Send the enable password
          connection.exec(enablePassword, (err, response) => {
            if (err) {
              console.error('Error entering enable password:', err);
            } else {
              console.log(response);
              // Now, send the "show run" command
              connection.exec(showRunCommand, (err, response) => {
                if (err) {
                  console.error('Error executing "show run" command:', err);
                } else {
                  console.log(response);
                  // Close the Telnet session
                  connection.end();
                }
              });
            }
          });
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
