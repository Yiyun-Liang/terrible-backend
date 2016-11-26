var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/user';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query(
  'CREATE TABLE items(id VARCHAR(40) not null, name VARCHAR(40) not null, url VARCHAR(40) not null, value DOUBLE PRECISION not null, rank INTEGER not null)');
query.on('end', () => { client.end(); });
