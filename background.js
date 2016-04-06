chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'outerBounds': {
      'width': 400,
      'height': 500
    }
  });
});


console.log("Hi test!");

var device_names = {};
var updateDeviceName = function(device) {

  device_names[device.address] = device.name;
  console.log(device.name);
};
var removeDeviceName = function(device) {
  delete device_names[device.address];
}

// Add listeners to receive newly found devices and updates
// to the previously known devices.
chrome.bluetooth.onDeviceAdded.addListener(updateDeviceName);
chrome.bluetooth.onDeviceChanged.addListener(updateDeviceName);
chrome.bluetooth.onDeviceRemoved.addListener(removeDeviceName);

// With the listeners in place, get the list of devices found in
// previous discovery sessions, or any currently active ones,
// along with paired devices.
chrome.bluetooth.getDevices(function(devices) {
  for (var i = 0; i < devices.length; i++) {
    updateDeviceName(devices[i]);
  }
});

// Now begin the discovery process.
chrome.bluetooth.startDiscovery(function() {

  // Stop discovery after 30 seconds.
  setTimeout(function() {
    chrome.bluetooth.stopDiscovery(function() {});

    console.log("Bluetooth discovery completed!")
  }, 120000);

});