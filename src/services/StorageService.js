// src/services/StorageService.js
export default class StorageService {
    static getData(key) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    }
  
    static setData(key, data) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  
    static generateId(items) {
      return items.length ? Math.max(...items.map(item => item.id)) + 1 : 1;
    }
  }
  