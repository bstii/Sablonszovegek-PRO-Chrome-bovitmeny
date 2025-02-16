document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('insert').addEventListener('click', function() {
    var selectElement = document.getElementById('sablonszoveg');
    var selectedOption = selectElement.value;

    getSelectedSablonszoveg(selectedOption, function(sablonszoveg) {
      copyToClipboard(sablonszoveg);
    });

  // További eseménykezelők...
});


  document.getElementById('saveNewText').addEventListener('click', function() {
    var cim = document.getElementById('cimsor').value;
    var szoveg = document.getElementById('teljesSzoveg').value;
    
    saveNewSablonszoveg(cim, szoveg);
  });

  document.getElementById('deleteText').addEventListener('click', function() {
    var selectedOption = document.getElementById('deleteSablonszoveg').value;
    deleteSablonszoveg(selectedOption);
  });

  // Betölti a korábban rögzített szövegeket a sablonok és a törlési lenyíló listákba
  loadSavedTexts();
});

function saveNewSablonszoveg(cim, szoveg) {
  chrome.storage.sync.get('savedTexts', function(data) {
    var savedTexts = data.savedTexts || [];

    // Hozz létre egy objektumot a címsorral és a szöveggel
    var newSablonszoveg = {
      cim: cim,
      szoveg: szoveg
    };

    savedTexts.push(newSablonszoveg);

    chrome.storage.sync.set({ savedTexts: savedTexts }, function() {
      console.log('Új szöveg rögzítve: ' + cim);
      loadSavedTexts();
    });
  });
}

function getSelectedSablonszoveg(selectedOption, callback) {
  if (selectedOption === 'ValaszdMeg') {
    callback("Itt lehetne megadni az általad kívánt szöveget.");
  } else {
    chrome.storage.sync.get('savedTexts', function(data) {
      var savedTexts = data.savedTexts || [];
      var sablonszoveg = "Nincs ilyen sablon.";  // Alapértelmezett érték, ha nincs megtalálható sablon

      for (var i = 0; i < savedTexts.length; i++) {
        if (savedTexts[i].cim === selectedOption) {
          sablonszoveg = savedTexts[i].szoveg;
          break;
        }
      }

      callback(sablonszoveg);  // Hívjuk meg a callback függvényt a szöveggel
    });
  }
}


// A vágólapra másolás megváltozott, most a visszahívást használja
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(function() {
      console.log('Sikeresen vágólapra helyezve: ' + text);
    })
    .catch(function(error) {
      console.error('Hiba történt a vágólapra helyezés során: ' + error);
    });
}


function deleteSablonszoveg(selectedOption) {
  chrome.storage.sync.get('savedTexts', function(data) {
    var savedTexts = data.savedTexts || [];

    for (var i = 0; i < savedTexts.length; i++) {
      if (savedTexts[i].cim === selectedOption) {
        savedTexts.splice(i, 1); // Törli az elemet a tömbből
        chrome.storage.sync.set({ savedTexts: savedTexts }, function() {
          console.log('Sablonszöveg törölve: ' + selectedOption);
          loadSavedTexts();
        });
        return;
      }
    }
  });
}
function loadSavedTexts() {
  chrome.storage.sync.get('savedTexts', function(data) {
    var savedTexts = data.savedTexts || [];
    var selectElement = document.getElementById('sablonszoveg');
    var deleteSelectElement = document.getElementById('deleteSablonszoveg');

    selectElement.innerHTML = '';
    deleteSelectElement.innerHTML = '';

    savedTexts.forEach(function(sablonszoveg) {
      var option = document.createElement('option');
      option.value = sablonszoveg.cim;
      option.textContent = sablonszoveg.cim;
      selectElement.appendChild(option);

      var deleteOption = document.createElement('option');
      deleteOption.value = sablonszoveg.cim;
      deleteOption.textContent = sablonszoveg.cim;
      deleteSelectElement.appendChild(deleteOption);
    });
  });
}

