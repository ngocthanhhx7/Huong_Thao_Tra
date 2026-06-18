const mongoose = require('mongoose');
const dns = require('dns');

const configureMongoDns = () => {
  const dnsServers = process.env.MONGO_DNS_SERVERS;

  if (!dnsServers) {
    return;
  }

  const servers = dnsServers
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (servers.length) {
    dns.setServers(servers);
  }
};

const connectDB = async () => {
  try {
    configureMongoDns();

    if (!process.env.MONGO_URI) {
      throw new Error('Missing MONGO_URI environment variable');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
