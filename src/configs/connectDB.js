
import mysql from 'mysql2';

// create the connection to database
const connection = mysql.createConnection({
    host: process.env.MYSQLHOST || 'localhost',
    user: MYSQLUSER || 'root',
    password: '19122004',
    database: MYSQLPASSWORD || 'databasenodejs',
    port: MYSQLPORT || '3036'
}).promise(); // mysql2 cung cấp .promise() function giúp đảm bảo code đc chạy theo đúng trình tự 


export default connection;