import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
}).promise();

export async function getData() {
    const result = await connection.query("SELECT user_name, user_score FROM Users ORDER BY user_score DESC LIMIT 10");
    const rows = result[0];
    return rows;
};

export async function getUserData(userName) {
    const result = await connection.query("SELECT * FROM Users WHERE user_name = ?", [userName]);
    return result[0];
}; // MySQL Prepared Statement

export async function insertData(userName, userScore) {
    const result = await connection.query("INSERT INTO Users (user_name, user_score) VALUES (?, ?)", [userName, userScore]);

    const rowNumber = await connection.query("SELECT COUNT(*) FROM Users");
    const validateData = await connection.query("SELECT EXISTS(SELECT * FROM Users WHERE user_id = ?)", [rowNumber[0][0]["COUNT(*)"]]);
    const dictData = validateData[0][0];
    const firstKey = Object.keys(dictData)[0];
    return validateData[0][0][firstKey];
}; // MySQL Insert Statement