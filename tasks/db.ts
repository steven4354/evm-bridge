// Importing Postgres to our project.
const { Client } = require("pg");

const credentials = {
	user: "jgvgiyrqwmlrde",
	host: "ec2-54-160-109-68.compute-1.amazonaws.com",
	database: "d3outivvmf318g",
	password: "77571d87f87c9692c402fcdddab8d175059b65dda47baf50ab2b5f4f9aa12674",
	port: 5432,
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
