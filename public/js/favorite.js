var dbPromised = idb.open("football-standings", 1, upgradeDb => {
  if (!upgradeDb.objectStoreNames.contains("favoteams")) {
    upgradeDb.createObjectStore("favoteams", {
      keyPath: "id"
    });
  }
});

function addFavoriteTeam(team) {
  dbPromised.then(db => {
      var tx = db.transaction("favoteams", "readwrite");
      var store = tx.objectStore("favoteams");
      store.put(team);
      return tx.complete;
    })
    .then(() => {
      M.toast({
        html: 'Berhasil menambahkan team favorite'
      })
    })
}

function getAllFavorite() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction("favoteams", "readonly");
        var store = tx.objectStore("favoteams");
        return store.getAll();
      })
      .then(function (teams) {
        resolve(teams);
      });
  })
}

function deleteFavorite(idteam) {
  dbPromised.then(function (db) {
    var tx = db.transaction('favoteams', 'readwrite');
    var store = tx.objectStore('favoteams');
    store.delete(idteam);
    return tx.complete;
  }).then(function () {
    M.toast({
      html: 'Berhasil menghapus team favorite'
    })
    location.reload();
  });
}