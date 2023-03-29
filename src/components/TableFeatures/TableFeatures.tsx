import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { PostgreSQLGenerator } from '../../helpers/helpers';
import { Spinner } from 'react-bootstrap';

interface Props {
	features: string;
}

const SchemaEditor: React.FC<Props> = ({ features }) => {
	const [inputValue, setInputValue] = useState<string>(features);
	const [diagramHTML, setDiagramHTML] = useState<string>('');
	const [cursor, setCursor] = useState<number>(0);
	const ref = useRef<HTMLTextAreaElement>(null);
	const [ddl, setDDL] = useState<string>('');

	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const input = ref.current;
		if (input) input.setSelectionRange(cursor, cursor);
	}, [ref, cursor, inputValue]);

	mermaid.initialize({ startOnLoad: true });

	const handleInputChange = async (event: React.ChangeEvent<HTMLTextAreaElement>): Promise<void> => {
		const text = event.target.value;
		const cursorPosition = event.target.selectionStart;
		setCursor(cursorPosition);
		try {
			const diagram = await mermaid.render('schema', text);
			const svg = diagram.svg;
			setDiagramHTML(svg);
		} catch (e) {
			//   setDiagramHTML(e);
		}
		setInputValue(text);
	};

	const generateSQL = async () => {
		setLoading(true);
		await PostgreSQLGenerator(inputValue)
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				setLoading(false);
				setDDL(data.choices[0].message.content);
			})
			.catch((e) => {
				setLoading(false);
				alert('Error occured. Please try again!');
			});
	};

	return (
		<div className='d-flex vh-100'>
			<div style={{ width: '50vw', height: '100vh' }}>
				<h4 className='text-center mb-4'>Mermaid erDiagram Code</h4>
				<textarea ref={ref} style={{ height: '90vh' }} value={inputValue} onChange={(e) => handleInputChange(e)} className='form-control' />
				<div className='d-flex mt-2'>
					<button className='d-flex btn btn-success' disabled={loading} onClick={generateSQL}>
						{loading ? 'Generating...' : 'Generate SQL'}
					</button>
					{loading ? (
						<div className='ms-3'>
							<Spinner animation='border' role='status' variant='success'>
								<span className='visually-hidden'>Loading...</span>
							</Spinner>
						</div>
					) : null}
				</div>
			</div>
			<div className="ms-5">
				<div className='justify-content-center align-items-center'>
					<div dangerouslySetInnerHTML={{ __html: diagramHTML }} style={{ width: '50vw', height: '60vh' }} />
				</div>
				{ddl === '' ? null : (
					<div style={{ width: '50vw', height: '50vh' }} className='mt-4'>
						<h4>PostgreSQL</h4>
						<textarea value={ddl} disabled style={{ height: '30vh', width: '50vw' }} />
					</div>
				)}
			</div>
		</div>
	);
};

export default SchemaEditor;
