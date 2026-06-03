const mysql = require('mysql2/promise');

exports.handler = async (event) => {

  const body = JSON.parse(event.body);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  await connection.execute(
    'INSERT INTO users(name,email) VALUES (?,?)',
    [body.name, body.email]
  );

  await connection.end();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'User created'
    })
  };
};