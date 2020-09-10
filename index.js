"use strict";

const config = require("./config.json");
const { ImapFlow } = require("imapflow");

const checkLogin = async () => {
  config.imap.logger = false;
  const client = new ImapFlow(config.imap);
  try {
    await client.connect();
    await client.mailboxOpen("INBOX");
  } finally {
    // log out and close connection
    await client.logout();
  }
};

const main = async () => {
  // Wait until client connects and authorizes

  while (true) {
    try {
      await checkLogin();
      console.log(`${new Date().toISOString()} SUCESS`);
    } catch (err) {
      console.error(`${new Date().toISOString()} ERROR ${err.message}${err.response ? `: ${err.response}` : ""}`);
    }
    await new Promise((resolve) => setTimeout(resolve, config.check_interval));
  }
};

main().catch((err) => console.error(err));
