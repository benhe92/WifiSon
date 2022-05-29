// Get references to UI elements
let connectButton = document.getElementById('connect');
let disconnectButton = document.getElementById('disconnect');
let terminalContainer = document.getElementById('terminal');
let sendForm = document.getElementById('send-form');
let inputField = document.getElementById('input');

// Connect to the device on Connect button click
connectButton.addEventListener('click', function() {
  connect();
});

// Disconnect from the device on Disconnect button click
disconnectButton.addEventListener('click', function() {
  disconnect();
});

// Handle form submit event
sendForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form sending
  send(inputField.value); // Send text field contents
  inputField.value = '';  // Zero text field
  inputField.focus();     // Focus on text field
});

// Launch Bluetooth device chooser and connect to the selected
function connect() {
  //
}

// Disconnect from the connected device
function disconnect() {
  //
}

// Send data to the connected device
function send(data) {
    data = String(data);
  
    if (!data || !characteristicCache) {
      return;
    }
  
    data += '\n';
  
    if (data.length > 20) {
      let chunks = data.match(/(.|[\r\n]){1,20}/g);
  
      writeToCharacteristic(characteristicCache, chunks[0]);
  
      for (let i = 1; i < chunks.length; i++) {
        setTimeout(() => {
          writeToCharacteristic(characteristicCache, chunks[i]);
        }, i * 100);
      }
    }
    else {
      writeToCharacteristic(characteristicCache, data);
    }
  
    log(data, 'out');
  }

// Enable the characteristic changes notification
function startNotifications(characteristic) {
    log('Starting notifications...');
  
    return characteristic.startNotifications().
        then(() => {
          log('Notifications started');
          // Added line
          characteristic.addEventListener('characteristicvaluechanged',
              handleCharacteristicValueChanged);
        });
  }
  
  function disconnect() {
    if (deviceCache) {
      log('Disconnecting from "' + deviceCache.name + '" bluetooth device...');
      deviceCache.removeEventListener('gattserverdisconnected',
          handleDisconnection);
  
      if (deviceCache.gatt.connected) {
        deviceCache.gatt.disconnect();
        log('"' + deviceCache.name + '" bluetooth device disconnected');
      }
      else {
        log('"' + deviceCache.name +
            '" bluetooth device is already disconnected');
      }
    }
  
    // Added condition
    if (characteristicCache) {
      characteristicCache.removeEventListener('characteristicvaluechanged',
          handleCharacteristicValueChanged);
      characteristicCache = null;
    }
  
    deviceCache = null;
  }
  
  // Data receiving
  function handleCharacteristicValueChanged(event) {
    let value = new TextDecoder().decode(event.target.value);
    log(value, 'in');
  }