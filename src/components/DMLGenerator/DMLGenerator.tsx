import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { GenerateDML } from '../../helpers/helpers';
import { CopyBlock, a11yDark } from 'react-code-blocks';

interface Props {
	ddl: string;
}

function extractTableNames(ddl: string): string[] {
	const regex = /CREATE TABLE (\w+)/g;
	const matches = ddl.match(regex) || [];
	const tableNames = [];

	for (const match of matches) {
		const tableName = match.replace('CREATE TABLE ', '');
		tableNames.push(tableName);
	}

	return tableNames;
}

const DMLGenerator: React.FC<Props> = ({ ddl }) => {
	console.log(ddl);
	const tableNames = extractTableNames(ddl);
	console.log(tableNames);

	const [checkedTableNames, setCheckedTableNames] = useState<string[]>([]);
	const [input, setInput] = useState('');
	const [dmlValue, setDMLValue] = useState('');
	const [loading, setLoading] = useState<boolean>(false);

	const handleChange = (event: { target: { value: React.SetStateAction<string> } }) => {
		setInput(event.target.value);
	};

	const checkboxValues: { value: string; label: string }[] = tableNames.map((x) => {
		return { label: x, value: x };
	});

	const handleCheckboxChange = (event: { target: { value: any; checked: any } }) => {
		// Get the checked value
		const checkedValue = event.target.value;

		// If the checkbox is checked, add the value to the array
		if (event.target.checked) {
			setCheckedTableNames([...checkedTableNames, checkedValue]);
		} else {
			// If the checkbox is unchecked, remove the value from the array
			setCheckedTableNames(checkedTableNames.filter((value) => value !== checkedValue));
		}
	};

	const generateDML = async () => {
		const prompt = input + ' Include only the tables ' + checkedTableNames.join(', ') + '.' + '\n\n' + ddl;
		await processChatGPT(prompt);
	};

	async function processChatGPT(prompt: string) {
		setLoading(true);
		await GenerateDML(prompt)
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				setLoading(false);
				setDMLValue(data.choices[0].message.content);
			})
			.catch((e) => {
				setLoading(false);
				alert('Error Occured. Please Try Again!');
			});
	}

	console.log(checkedTableNames);

	return (
		<div className='d-flex align-items-center justify-content-center' style={{ gap: '10em' }}>
			<div className='d-flex flex-column'>
				<div className='mb-5'>
					<h3>Select Tables</h3>
					<div className='border rounded p-3'>
						{checkboxValues.map((tableName) => (
							<div key={tableName.value} style={{ textAlign: 'left' }} className='form-check'>
								<input className='form-check-input' type='checkbox' style={{ fontSize: '20px' }} id={tableName.value} value={tableName.value} checked={checkedTableNames.includes(tableName.value)} onChange={handleCheckboxChange} />
								<label htmlFor={tableName.value} style={{ fontSize: '20px' }}>
									{tableName.value}
								</label>
							</div>
						))}
					</div>
				</div>

				<div style={{ maxWidth: '30vw', minWidth: '25vw' }}>
					<h3>Selected Tables: {checkedTableNames.join(', ')}</h3>
					<div>
						<textarea style={{ height: '40vh' }} className='form-control' placeholder='Prompt Ex: Please generate an Insert PostgreSQL DML Statement for these Tables' value={input} onChange={handleChange} />
						<div className='d-flex justify-content-end mt-3'>
							<Button variant='success' onClick={generateDML}>
								Generate DML
							</Button>
						</div>
						{loading ? (
							<div className='ms-3'>
								<Spinner animation='border' role='status' variant='success'>
									<span className='visually-hidden'>Loading...</span>
								</Spinner>
							</div>
						) : null}
						{/* <textarea
						className='form-control'
						id='floatingTextarea'
						style={{ height: '40vh', resize: 'none' }}
						value={input}
						onChange={handleChange}
					/> */}
					</div>
				</div>
			</div>

			{dmlValue && (
				<div>
					<CopyBlock language='sql' showLineNumbers={false} theme={a11yDark} wrapLongLines={true} text={dmlValue} codeBlock style={{ overflow: 'auto' }} />
				</div>
			)}
		</div>
	);
};

export default DMLGenerator;

// interface Table {
// 	name: string;
// 	columns: Column[];
// 	constraints: Constraint[];
// }

// interface Column {
// 	name: string;
// 	type: string;
// }

// interface Constraint {
// 	name: string;
// 	type: string;
// 	columns: string[];
// 	references?: Reference;
// }

// interface Reference {
// 	table: string;
// 	columns: string[];
// }

// function parseDDL(ddl: string): Table[] {
// 	const tables: Table[] = [];
// 	const ddlLines = ddl
// 		.split('\n')
// 		.map((line) => line.trim())
// 		.filter(Boolean);

// 	let currentTable: Table | null = null;
// 	for (const line of ddlLines) {
// 		if (line.startsWith('CREATE TABLE')) {
// 			const tableName = line.match(/CREATE TABLE (\w+)/)![1];
// 			currentTable = {
// 				name: tableName,
// 				columns: [],
// 				constraints: [],
// 			};
// 			tables.push(currentTable);
// 		} else if (line.startsWith('ALTER TABLE')) {
// 			const [_, tableName, constraintType, constraintName, columnsStr, referencesStr] = line.match(/ALTER TABLE (\w+) ADD CONSTRAINT (\w+) (\w+) \((.*)\) REFERENCES (\w+)\((.*)\)/)!;
// 			const columns = columnsStr.split(',').map((s) => s.trim());
// 			const references = {
// 				table: referencesStr.split(',')[0].trim(),
// 				columns: referencesStr
// 					.split(',')
// 					.slice(1)
// 					.map((s) => s.trim()),
// 			};
// 			currentTable!.constraints.push({
// 				name: constraintName,
// 				type: constraintType,
// 				columns,
// 				references,
// 			});
// 		} else if (line.startsWith(')')) {
// 			currentTable = null;
// 		} else if (currentTable) {
// 			const [columnName, columnType] = line.split(' ').filter(Boolean);
// 			currentTable.columns.push({
// 				name: columnName,
// 				type: columnType,
// 			});
// 		}
// 	}

// 	return tables;
// }

// function parseDDL2(ddl: string): Array<Record<string, any>> {
// 	const TABLE_REGEX = /CREATE TABLE (\w+) \(([\s\S]*?)\);/gm;
// 	const COLUMN_REGEX = /(\w+) (\w+(?:\([\d,]+\))?)(?: (.*))?/gm;
// 	const FOREIGN_KEY_REGEX = /ALTER TABLE (\w+) ADD CONSTRAINT (\w+) FOREIGN KEY \((\w+)\) REFERENCES (\w+)\((\w+)\);/gm;

// 	const result = [];
// 	let match;
// 	while ((match = TABLE_REGEX.exec(ddl)) !== null) {
// 		const [tableMatch, tableName, columnsMatch] = match;
// 		const columns = [];
// 		let columnMatch;
// 		while ((columnMatch = COLUMN_REGEX.exec(columnsMatch)) !== null) {
// 			const [columnMatchString, columnName, columnType, columnOptions] = columnMatch;
// 			const options = columnOptions ? columnOptions.split(' ') : [];
// 			const column = {
// 				name: columnName,
// 				type: columnType,
// 				options: options,
// 			};
// 			columns.push(column);
// 		}

// 		const foreignKeys = [];
// 		let fkMatch;
// 		while ((fkMatch = FOREIGN_KEY_REGEX.exec(ddl)) !== null) {
// 			const [fkMatchString, table, constraint, column, foreignTable, foreignColumn] = fkMatch;
// 			if (table !== tableName) {
// 				continue;
// 			}
// 			const foreignKey = {
// 				name: constraint,
// 				column: column,
// 				foreignTable: foreignTable,
// 				foreignColumn: foreignColumn,
// 			};
// 			foreignKeys.push(foreignKey);
// 		}

// 		const table = {
// 			name: tableName,
// 			columns: columns,
// 			foreignKeys: foreignKeys,
// 		};
// 		result.push(table);
// 	}

// 	return result;
// }

// function parseDDL3(ddl: string): Array<Record<string, any>> {
// 	const TABLE_REGEX = /CREATE TABLE (\w+) \(([\s\S]*?)\);/gm;
// 	const COLUMN_REGEX = /(\w+) (\w+(?:\([\d,]+\))?)(?: (.*))?/gm;
// 	const FOREIGN_KEY_REGEX = /ALTER TABLE (\w+) ADD CONSTRAINT (\w+) FOREIGN KEY \((\w+)\) REFERENCES (\w+)\((\w+)\);/gm;
// 	const PRIMARY_KEY_REGEX = /PRIMARY KEY \(([\s\S]+?)\)/gm;

// 	const result = [];
// 	let match;

// 	let table = {};
// 	while ((match = TABLE_REGEX.exec(ddl)) !== null) {
// 		const [tableMatch, tableName, columnsMatch] = match;
// 		const columns = [];
// 		let columnMatch;
// 		while ((columnMatch = COLUMN_REGEX.exec(columnsMatch)) !== null) {
// 			const [columnMatchString, columnName, columnType, columnOptions] = columnMatch;
// 			const options = columnOptions ? columnOptions.split(' ') : [];
// 			const column = {
// 				name: columnName,
// 				type: columnType,
// 				options: options,
// 			};
// 			columns.push(column);
// 		}

// 		const foreignKeys = [];
// 		let fkMatch;
// 		while ((fkMatch = FOREIGN_KEY_REGEX.exec(ddl)) !== null) {
// 			const [fkMatchString, table, constraint, column, foreignTable, foreignColumn] = fkMatch;
// 			if (table !== tableName) {
// 				continue;
// 			}
// 			const foreignKey = {
// 				name: constraint,
// 				column: column,
// 				foreignTable: foreignTable,
// 				foreignColumn: foreignColumn,
// 			};
// 			foreignKeys.push(foreignKey);
// 		}

// 		let primaryKeyColumns: string[] = [];
// 		let primaryKeyMatch;
// 		if ((primaryKeyMatch = PRIMARY_KEY_REGEX.exec(columnsMatch)) !== null) {
// 			const [primaryKeyMatchString, primaryKeyColumnsMatch] = primaryKeyMatch;
// 			primaryKeyColumns = primaryKeyColumnsMatch.split(',').map((col) => col.trim());

// 			table = {
// 				name: tableName,
// 				columns: primaryKeyColumns.map((col) => ({ name: col, type: 'SERIAL' })),
// 				primaryKey: primaryKeyColumns.map((col) => ({ name: col, type: 'SERIAL' })),
// 				foreignKeys: foreignKeys,
// 			};
// 		} else {
// 			table = {
// 				name: tableName,
// 				columns: columns.filter((col) => !primaryKeyColumns.includes(col.name)),
// 				primaryKey: primaryKeyColumns.map((col) => ({ name: col, type: 'INT' })),
// 				foreignKeys: foreignKeys,
// 			};
// 		}

// 		result.push(table);
// 	}

// 	return result;
// }
