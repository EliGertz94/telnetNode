var net = require('net');

//host is the ip
//port 23 for telnet
//action -> "shrun" or "vlan"

function showRunningConfig(level) {
  var client = new net.Socket();



client.connect(23, "10.103.0."+level, function() {
    console.log('Connected');
   
    // Send Telnet commands
    client.write('weno1\r\n'); // Replace with your Telnet password
    client.write('en\r\n'); // Enter enable mode if needed, replace with your enable password
    client.write('weno1\r\n');
    client.write('sh run\r\n'); // Send the "show run" command
 
   
});
let receivedData = '';
let spaceSentCount = 0; // Number of times space has been sent
const maxSpaceAttempts =7; // Maximum number of space attempts
let timeout;


client.on('data', function(data) {
  
    console.log('Received: ' + data);
    receivedData += data.toString(); // Accumulate received data as a string
    
    // Check for the --More-- prompt and send a space to continue
    if (receivedData.includes('--More--')) {
        if (spaceSentCount < maxSpaceAttempts) {
            client.write(' ');
            spaceSentCount++;
            // Set a timeout to send space again if needed (adjust the delay as necessary)
            timeout = setTimeout(function() {
                spaceSentCount = 0; // Reset space attempts after the timeout
            }, 2000); // 2 seconds delay
        }
    } else {
        // Cancel the timeout when the prompt is no longer present
        clearTimeout(timeout);
    }
    
    // To close the connection after receiving the desired data, you can add a condition.
    if (spaceSentCount === maxSpaceAttempts && !receivedData.includes('--More--')) {
        client.destroy();
    }
});

client.on('close', function() {
    
    console.log('Connection closed');
    console.log('Received Data:');
    console.log(receivedData); 
});


}


function configureVlan(level,computerNum,vlan) {

  var client = new net.Socket();



  client.connect(23, "10.103.0."+level, function() {
      console.log('Connected');
     
          // Send Telnet commands
    client.write('weno1\r\n'); // Replace with your Telnet password
    client.write('en\r\n'); // Enter enable mode if needed, replace with your enable password
    client.write('weno1\r\n');
    client.write('configure terminal\r\n'); // Enter global configuration mode
    client.write('interface GigabitEthernet0/'+computerNum+'\r\n'); // Enter the specific interface
    client.write('switchport access vlan '+vlan+'\r\n'); // Configure the VLAN for the interface
    client.write('end\r\n'); // Exit configuration mode
    client.write('write memory\r\n'); // Save the configuration
    client.write('exit\r\n'); // Exit Telnet session
  

     
  });
  let receivedData = '';
  let spaceSentCount = 0; // Number of times space has been sent
  const maxSpaceAttempts =7; // Maximum number of space attempts
  let timeout;
  
  
  client.on('data', function(data) {
    
      console.log('Received: ' + data);
      receivedData += data.toString(); // Accumulate received data as a string
      
      // Check for the --More-- prompt and send a space to continue
      if (receivedData.includes('--More--')) {
          if (spaceSentCount < maxSpaceAttempts) {
              client.write(' ');
              spaceSentCount++;
              // Set a timeout to send space again if needed (adjust the delay as necessary)
              timeout = setTimeout(function() {
                  spaceSentCount = 0; // Reset space attempts after the timeout
              }, 2000); // 2 seconds delay
          }
      } else {
          // Cancel the timeout when the prompt is no longer present
          clearTimeout(timeout);
      }
      
      // To close the connection after receiving the desired data, you can add a condition.
      if (spaceSentCount === maxSpaceAttempts && !receivedData.includes('--More--')) {
          client.destroy();
      }
  });
  
  client.on('close', function() {
      
      console.log('Connection closed');
      console.log('Received Data:');
      console.log(receivedData); 
  });
  
}

module.exports = {
  showRunningConfig,
  configureVlan
};