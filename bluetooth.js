console.log("Hi test!");

// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}


// Make the actual CORS request.
function makeCorsRequest(url, device) {
  // All HTML5 Rocks properties support CORS.
  //var url = 'https://ashwyn.pythonanywhere.com/welcome/wolf/btLogin?btId='+btId;

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    console.log('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    //var title = getTitle(text);
    console.log('Response from CORS request to ' + url + ': ' + text);
    var btDevice = [device.name + " (" + device.address + ")"]

    try{

        var loginResponse = JSON.parse(text);
        if(loginResponse.success==true)
        {
          console.log("User logged in!");
          if(!(loginResponse.email in device_names))
          {
                  document.getElementById('foo').appendChild(makeUL(btDevice));
                  device_names[loginResponse.email] = device.address;        
          }

        }
    }
    catch(err)
    {
      console.log("error:"+err);
    }


  };

  xhr.onerror = function() {
    console.log('Woops, there was an error making the request.');
  };

  xhr.send();
}



function makeUL(array) {
    // Create the list element:
    var list = document.createElement('ul');

    for(var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');

        // Set its contents:
        item.appendChild(document.createTextNode(array[i]));

        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}


var device_names = {};
var updateDeviceName = function(device) {

  console.log(device.name);
  console.log(device.address);

  var btDevice = [device.name + " (" + device.address + ")"]


  //TODO
  //Login(device.address)
  // var listFlag = false;
  // var checkLoginUrl = 'https://ashwyn.pythonanywhere.com/welcome/wolf/isLoggedIn?user_email='+loginResponse.email
  // var checkLoginUrlResponse = JSON.parse(makeCorsRequest(checkLoginUrl));
  // if((checkLoginUrlResponse.success==false)&&(checkLoginUrlResponse.msg.equals("User is not logged in. Please turn on your bluetooth and wait for your name to show up on the screen!"))){
  //   listFlag = true;
  // }


    var loginUrl = 'https://ashwyn.pythonanywhere.com/welcome/wolf/btLogin?btId='+device.address;
    
    makeCorsRequest(loginUrl, device);
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