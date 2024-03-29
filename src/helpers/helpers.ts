export const UserStoriesGenerator = async (chatMessages: string) => {
	const userMessage = {
		role: 'user',
		content: chatMessages,
	};

	const systemMessage = {
		role: 'system',
		content: 'User wants to make an App. The response must be in bullet points without preamble. Change the bullet points with *. Not Accepting "-" bullet points. Give no less than five points.',
	};

	const apiRequestBody = {
		model: 'gpt-3.5-turbo',
		messages: [
			systemMessage, // always needs to be the first message
			userMessage, // [Message]
		],
	};

	return await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(apiRequestBody),
	});
};

export const SystemGenerator = async (chatMessages: string) => {
	const userMessage = {
		role: 'user',
		content: chatMessages,
	};

	const systemMessage = {
		role: 'system',
		content:
			'Tell the user what database features they should make. The response must be in bullet points without preamble. Change the bullet points with *. Not Accepting "-" bullet points. Give no less than five points. No points inside of points. I do not need the explanation',
	};

	const apiRequestBody = {
		model: 'gpt-3.5-turbo',
		messages: [
			systemMessage, // always needs to be the first message
			userMessage, // [Message]
		],
	};

	return await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(apiRequestBody),
	});
};

export const PostgreSQLGenerator = async (chatMessages: string) => {
	const userMessage = {
		role: 'user',
		content: chatMessages,
	};

	const systemMessage = {
		role: 'system',
		content:
			'Please generate an PostgreSQL Database DDL from the given Mermaid erDiagram Code without preamble.',
	};

	const apiRequestBody = {
		model: 'gpt-3.5-turbo',
		messages: [
			systemMessage, // always needs to be the first message
			userMessage, // [Message]
		],
	};

	return await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(apiRequestBody),
	});
};

export const TableGenerator = async (chatMessages: string) => {
	const userMessage = {
		role: 'user',
		content: chatMessages,
	};

	const systemMessage = {
		role: 'system',
		content:
			'Please generate an PostgreSQL Database DDL. Generate the database table from user input without preamble. To create table, use CREATE TABLE tableName, do not use CREATE TABLE IF NOT EXISTS or other examples. Do not make ALTER TABLE, TRIGGERS, INDEXES, etc. Just make the tables with the desired formats, with primary keys and foreign keys. For foreign keys, use this format FOREIGN KEY (attribute) REFERENCES tableName(attribute). Make sure you use the syntax FOREIGN KEY. Do not use any other format when creating FOREIGN KEY.',
		// content: 'Please response with an AML Syntax. Generate the database table from user input without preamble.',
	};

	const apiRequestBody = {
		model: 'gpt-3.5-turbo',
		messages: [
			systemMessage, // always needs to be the first message
			userMessage, // [Message]
		],
	};

	return await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(apiRequestBody),
	});
};

type TableColumn = {
	columnName: string;
	dataType: string;
	isPrimaryKey: boolean;
};

type Table = {
	tableName: string;
	columns: TableColumn[];
	foreignKeys: string[];
};

type Database = {
	tables: Table[];
};

export function postgresqlToMermaid(query: string): string {
	const database: Database = {
		tables: [],
	};

	const lines = query.split('\n');

	let currentTable: Table | null = null;

	for (const line of lines) {
		const trimmedLine = line.trim();

		if (trimmedLine.startsWith('CREATE TABLE')) {
			const tableName = trimmedLine.match(/CREATE TABLE\s+(\w+)/)![1];

			console.log(tableName);

			currentTable = {
				tableName,
				columns: [],
				foreignKeys: [],
			};

			database.tables.push(currentTable);
		} else if (trimmedLine.startsWith(')')) {
			currentTable = null;
		} else if (currentTable !== null && trimmedLine.startsWith('FOREIGN KEY')) {
			const matches = trimmedLine.match(/FOREIGN KEY\s+\((\w+)\)\s+REFERENCES\s+(\w+)\s*\((\w+)\)/)!;

			const columnName = matches[1];
			const referencedTable = matches[2];
			const referencedColumnName = matches[3];

			currentTable.foreignKeys.push(`${currentTable.tableName} ||--o{ ${referencedTable} : ""`);
		} else if (currentTable !== null && trimmedLine.match(/^\w+/)) {
			const matches = trimmedLine.match(/^(\w+)\s+(.*)/)!;

			const columnName = matches[1];
			const dataType = matches[2]
				.replace(/DECIMAL\(\d+,\s*\d+\)|NUMERIC\(\d+,\s*\d+\)/g, 'FLOAT')
				.replace(/,\s*/g, '')
				.replace(/\s+NOT\s+NULL/g, '')
				.replace(/\s+UNIQUE/g, '')
				.replace(/\s+DEFAULT\s+.*$/, '')
				.replace(/\s+CHECK\s+\(.*?\)/g, '')
				.replace(/^(SERIAL\s+PRIMARY\s+KEY|SERIAL|BIGSERIAL|SMALLSERIAL)/, 'SERIAL PRIMARY KEY')
				.replace(/\s.*/, '');

			const isPrimaryKey = trimmedLine.includes('PRIMARY KEY');

			if (isPrimaryKey && columnName.startsWith('PRIMARY')) {
				currentTable.columns.map((column) => console.log(column.columnName));

				currentTable.columns.map((column) =>
					currentTable?.columns.push({
						columnName: column.columnName,
						dataType: 'SERIAL',
						isPrimaryKey: true,
					})
				);

				console.log('PRE FILTER');
				console.log(currentTable);

				currentTable.columns = currentTable.columns.filter((column) => column.isPrimaryKey);

				console.log('FILTERED');
				console.log(currentTable);
			} else {
				// This is a regular column
				currentTable.columns.push({
					columnName,
					dataType,
					isPrimaryKey,
				});
			}
		}
	}

	const mermaidCode = `erDiagram
  ${database.tables
		.map((table) => {
			const pkColumns = table.columns.filter((c) => c.isPrimaryKey).map((c) => c.columnName);
			const nonPkColumns = table.columns
				.filter((c) => !c.isPrimaryKey)
				.map((c) => `${c.columnName} ${c.dataType}`)
				.join('\n  ');

			return `${table.tableName} {
				${pkColumns.map((pkColumn) => `${pkColumn} SERIAL PK`).join('\n  ')}
				${nonPkColumns}
			}`;
		})
		.join('\n  ')}

  ${database.tables
		.filter((table) => table.foreignKeys.length > 0)
		.map((table) => table.foreignKeys.join('\n  '))
		.join('\n  ')}`;

	return mermaidCode;
}

export const GenerateDML = async (chatMessages: string) => {
	const userMessage = {
		role: 'user',
		content: chatMessages,
	};

	const systemMessage = {
		role: 'system',
		content:
			'Act as a Software Developer. Please generate an PostgreSQL Database DML Statement. Generate the database table from user input without preamble, just give the codes. If data is not provided, just create at least 3 dummy datas.',
	};

	const apiRequestBody = {
		model: 'gpt-3.5-turbo',
		messages: [
			systemMessage, // always needs to be the first message
			userMessage, // [Message]
		],
	};

	return await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(apiRequestBody),
	});
};