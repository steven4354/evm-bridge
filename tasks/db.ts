// Importing Postgres to our project.
const { Client } = require("pg");

const credentials = {
	user: process.env.POSTGRES_USER,
	host: process.env.POSTGRES_HOST,
	database: process.env.POSTGRES_DATABASE,
	password: process.env.POSTGRES_PASSWORD,
	port: process.env.POSTGRES_PORT,
	ssl: {
		rejectUnauthorized: false
	}
};

// const table = `
// 	CREATE TABLE records (
// 		id TEXT,
// 		fromchain TEXT,
// 		tochain TEXT,
// 		fromaddr TEXT,
// 		toaddr TEXT,
// 		amount TEXT,
// 		state TEXT
// 	);
// `

export async function addRecord(
	id: string,
	fromchain: string, tochain: string,
	from: string, to: string, amount: number) {
	const text = `
		INSERT INTO records (id, fromchain, tochain, fromaddr, toaddr, amount, state)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id
	`;
	const values = [id, fromchain, tochain, from, to, amount.toString(), 'LOCKED'];
	const client = new Client(credentials);
	await client.connect();
	const addedRecord = await client.query(text, values);
	await client.end();
  	return addedRecord.rows;
}


export async function updateState(id: string, state: string) {
    const text = `UPDATE records SET state=$1 WHERE id=$2`;
    var values = [state, id];
	const client = new Client(credentials);
	await client.connect();
	const updatedRecord = await client.query(text, values);
	await client.end();
  	return updatedRecord.rows;
}

export async function dumpRecords() {
	// Add a task to the todo list.
	const text = `SELECT * FROM records`;
	const client = new Client(credentials);
	await client.connect();
	const records = await client.query(text);
	await client.end();
  	return records.rows;
}
