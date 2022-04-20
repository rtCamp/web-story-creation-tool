import { useEffect, useRef, useState } from "react";
import { getDummyMedia } from "./getDummyMedia";

const useIndexedDBMedia = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  const dbRef = useRef(null);

  const _initIndexedDB = () =>
    new Promise((resolve, reject) => {
      const request = indexedDB.open("MyTestDatabase");
      request.onerror = (event) => {
        reject(event.target.errorCode);
      };
      request.onsuccess = (event) => {
        dbRef.current = event.target.result;
        setIsInitialized(true);
        resolve();
      };
      request.onupgradeneeded = (event) => {
        const storage = event.target.result.createObjectStore("assets", {
          autoIncrement: true,
        });
        // Add an object to the "data" objectStore with the key.
        storage.add(getDummyMedia(), "files");
      };
    });

  const onMountRoutine = async () => {
    await _initIndexedDB();
  };

  const getMedia = () =>
    new Promise((resolve, reject) => {
      const request = dbRef.current
        .transaction(["assets"])
        .objectStore("assets")
        .get("files");
      request.onerror = (event) => {
        reject(event.target.errorCode);
      };
      request.onsuccess = (event) => {
        resolve({
          data: event.target.result,
          headers: {
            totalItems: event.target.result.length,
            totalPages: 1,
          },
        });
      };
    });

  useEffect(() => {
    onMountRoutine();
  }, []);

  return {
    dbRef,
    isInitialized,
    getMedia,
    isIndexedDBSupported: window.indexedDB,
  };
};

export default useIndexedDBMedia;
