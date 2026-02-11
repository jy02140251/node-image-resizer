const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class Utils {
  static generateId(length = 16) {
    return crypto.randomBytes(length).toString('hex');
  }

  static hash(data, algorithm = 'sha256') {
    return crypto.createHash(algorithm).update(data).digest('hex');
  }

  static async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static retry(fn, retries = 3, delay = 1000) {
    return async (...args) => {
      let lastError;
      for (let i = 0; i < retries; i++) {
        try {
          return await fn(...args);
        } catch (err) {
          lastError = err;
          await this.sleep(delay * Math.pow(2, i));
        }
      }
      throw lastError;
    };
  }
}

class Logger {
  constructor(name) {
    this.name = name;
  }

  log(level, message, meta = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      name: this.name,
      message,
      ...meta
    };
    console.log(JSON.stringify(entry));
  }

  info(msg, meta) { this.log('info', msg, meta); }
  warn(msg, meta) { this.log('warn', msg, meta); }
  error(msg, meta) { this.log('error', msg, meta); }
}

module.exports = { Utils, Logger };