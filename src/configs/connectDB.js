
import mysql from 'mysql2';

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '19122004',
    database: 'databasenodejs',
    port: '3036'
}).promise(); // mysql2 cung cấp .promise() function giúp đảm bảo code đc chạy theo đúng trình tự 


export default connection;