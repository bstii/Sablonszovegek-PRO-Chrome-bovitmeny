document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('insert').addEventListener('click', function() {
    var selectedOption = document.getElementById('sablonszoveg').value;
    var sablonszoveg = getSelectedSablonszoveg(selectedOption);

    copyToClipboard(sablonszoveg);
  });

  document.getElementById('saveNewText').addEventListener('click', function() {
    var newText = document.getElementById('ujSablonszoveg').value;
    saveNewSablonszoveg(newText);
  });

  // Betölti a korábban rögzített szövegeket
  loadSavedTexts();
});

function getSelectedSablonszoveg(selectedOption) {
  // Módosítsd a kódodat, hogy visszaadjon egy előre definiált szöveget vagy a felhasználó rögzített szövegét
  // Például: ha selectedOption egy rögzített szöveg neve, akkor azt adjuk vissza
  return selectedOption; // Ide kell a szöveg visszaadása
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(function() {
      console.log('Sikeresen vágólapra helyezve: ' + text);
    })
    .catch(function(error) {
      console.error('Hiba történt a vágólapra helyezés során: ' + error);
    });
}

function saveNewSablonszoveg(newText) {
  // Mentsd el az új szöveget a böngésző helyi tárolásában (storage)
  // Ehhez használhatsz a Chrome storage API-t
  chrome.storage.sync.get('savedTexts', function(data) {
    var savedTexts = data.savedTexts || [];
    savedTexts.push(newText);

    chrome.storage.sync.set({ savedTexts: savedTexts }, function() {
      console.log('Új szöveg rögzítve: ' + newText);
      loadSavedTexts();
    });
  });
}

function loadSavedTexts() {
  // Betölti a korábban rögzített szövegeket a select elembe
  chrome.storage.sync.get('savedTexts', function(data) {
    var savedTexts = data.savedTexts || [];
    var selectElement = document.getElementById('sablonszoveg');

    // Töröld az előzően betöltött szövegeket
    selectElement.innerHTML = '';

    // Adj hozzá minden korábban rögzített szöveget a select elemhez
    savedTexts.forEach(function(text) {
      var option = document.createElement('option');
      option.value = text;
      option.textContent = text;
      selectElement.appendChild(option);
    });
  });
}
