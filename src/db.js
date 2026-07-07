import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.resolve('data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
await fs.mkdir(DATA_DIR, { recursive: true }).catch(() => {});

/**
 * Read messages from the local JSON database file.
 * Returns an array of messages.
 */
export async function readMessages() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Return empty array if file does not exist
      return [];
    }
    console.error('Error reading database file:', error);
    throw error;
  }
}

/**
 * Save a message payload to the local JSON database file.
 * Appends the message to the list.
 */
export async function saveMessage(payload) {
  try {
    const messages = await readMessages();
    const newRecord = {
      ...payload,
      ingestedAt: new Date().toISOString(),
    };
    messages.unshift(newRecord); // Add to the front so newest are first
    await fs.writeFile(DB_FILE, JSON.stringify(messages, null, 2), 'utf-8');
    return newRecord;
  } catch (error) {
    console.error('Error writing to database file:', error);
    throw error;
  }
}

/**
 * Clear all messages in the local JSON database file.
 */
export async function clearMessages() {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  } catch (error) {
    console.error('Error clearing database file:', error);
    throw error;
  }
}
