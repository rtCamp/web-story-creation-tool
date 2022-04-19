
const DB_NAME = 'gstories_creation_tool';
const DB_VERSION = 1;
const ASSET_OBJECT_STORE = 'assets';
const FILES_STORAGE_KEY = 'files';

export const initIndexDb = (
  files = [],
  action = 'get',
  callback = () => null
) => {
  const request = window.indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = function () {
    // Here we create a new object store called data, and give it an auto-generated key path
    const storage = this.result.createObjectStore(ASSET_OBJECT_STORE, {
      autoIncrement: true,
    });

    // Add an object to the "data" objectStore with the key.
    storage.add([], FILES_STORAGE_KEY);
  };

  request.onsuccess = function (event) {
    const database = event.target.result;

    const storage = database
      .transaction(ASSET_OBJECT_STORE, 'readwrite')
      .objectStore(ASSET_OBJECT_STORE);

    const getRequest = storage.get(FILES_STORAGE_KEY);

    getRequest.onsuccess = function () {
      let tempAssets = this.result;

      if ('save' === action) {
        tempAssets = files;
        storage.put(tempAssets, FILES_STORAGE_KEY);
      }

      if ('get' === action) {
        callback(tempAssets);
      }
    };
  };
};
