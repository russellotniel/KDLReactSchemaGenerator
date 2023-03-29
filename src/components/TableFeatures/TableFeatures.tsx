import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

interface Props {
	features: string;
}

const SchemaEditor: React.FC<Props> = ({ features }) => {
	const [inputValue, setInputValue] = useState<string>(features);
	const [diagramHTML, setDiagramHTML] = useState<string>('');

	mermaid.initialize({ startOnLoad: true });

	const handleInputChange = async (event: React.ChangeEvent<HTMLTextAreaElement>): Promise<void> => {
		const text = event.target.value;
		try {
			const diagram = await mermaid.render('schema', text);
			const svg = diagram.svg;
			setDiagramHTML(svg);
		} catch (e) {
			//   setDiagramHTML(e);
		}
		setInputValue(text);
	};

	return (
		<div className='d-flex vh-100'>
			<div style={{ width: '50vw', height: '100vh' }}>
				<h4 className='text-center mb-4'>Generated Query</h4>
				{/* <textarea style={{ height: '90vh' }} value={inputValue} onChange={handleInputChange} className='form-control' /> */}
				<textarea style={{ height: '90vh' }} value={inputValue} onChange={(e) => handleInputChange(e)} className='form-control' />
			</div>
			<div className='justify-content-center align-items-center'>
				<div dangerouslySetInnerHTML={{ __html: diagramHTML }} style={{ width: '50vw' }} />
			</div>
		</div>
	);
};

export default SchemaEditor;
