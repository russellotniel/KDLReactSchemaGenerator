import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface Props {
	features: string;
}

const SchemaEditor: React.FC<Props> = ({ features }) => {
	const [inputValue, setInputValue] = useState<string>(features);
	const [diagramHTML, setDiagramHTML] = useState<string>('');
  const [cursor, setCursor] = useState<number>(0);
  const ref = useRef<HTMLTextAreaElement>(null);

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

	return (
		<div className='d-flex vh-100'>
			<div style={{ width: '50vw', height: '100vh' }}>
				<h4 className='text-center mb-4'>Generated Query</h4>
				{/* <textarea style={{ height: '90vh' }} value={inputValue} onChange={handleInputChange} className='form-control' /> */}
				<textarea ref={ref} style={{ height: '90vh' }} value={inputValue} onChange={(e) => handleInputChange(e)} className='form-control' />
			</div>
			<div className='justify-content-center align-items-center'>
				<div dangerouslySetInnerHTML={{ __html: diagramHTML }} style={{ width: '50vw' }} />
			</div>
		</div>
	);
};

export default SchemaEditor;
