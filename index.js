
const mysql = require('mysql2/promise');

const {
  SNSClient,
  PublishCommand
} = require('@aws-sdk/client-sns');

const sns = new SNSClient({
  region: 'us-east-1'
});

exports.handler = async (event) => {

  try {

    const body = JSON.parse(event.body);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    // INSERT USER
    await connection.execute(
      'INSERT INTO users(name,email) VALUES (?,?)',
      [body.name, body.email]
    );

    await connection.end();

    // SEND SNS EMAIL
    await sns.send(
      new PublishCommand({
        TopicArn:
          'arn:aws:sns:us-east-1:916470729977:UserNotification',

        Subject:
          'New User Created',

        Message:
`User baru berhasil dibuat

Name: ${body.name}
Email: ${body.email}`
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: 'User created and SNS sent'
      })
    };

  } catch (error) {

    console.log(error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: 'Error',
        error: error.message
      })
    };

  }

};
