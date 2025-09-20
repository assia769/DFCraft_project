import browser from 'webextension-polyfill';

// Background script for DFCraft Extension
console.log('DFCraft Extension background script loaded');

// Use browser API instead of chrome API
browser.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Example of other common background script tasks
browser.runtime.onMessage.addListener((message) => {
  console.log('Message received:', message);
  // Handle messages from content scripts or popup
});

// Example: Create context menu
browser.contextMenus.create({
  id: 'dfcraft-menu',
  title: 'DFCraft Extension',
  contexts: ['all']
});