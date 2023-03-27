import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as SendIcon } from '../images/icon-send.svg';
import UserStories from './components/UserStories/UserStories';
import { SystemGenerator, TableGenerator } from './helpers/helpers';
import System from './components/System/System';
import TableFeatures from './components/TableFeatures/TableFeatures';
import { Spinner } from 'react-bootstrap';
import mermaid from 'mermaid';

const SqlGenerator = () => {
	//loading
	const [loading, setLoading] = useState(false);
	//Stepper
	const [step, setStep] = useState(1);
	const nextStep = () => {
		setStep(step + 1);
	};
	const prevStep = () => {
		setStep(step - 1);
	};

	//UserStories
	const [systemFeatures, setSystemFeatures] = useState([]);
	const handleSystemFeatures = async (features) => {
		setLoading(true);
		await SystemGenerator(features)
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				const arr = data.choices[0].message.content
					.replace(/\n/g, '')
					.split('*')
					.filter((item) => item !== '')
					.map((item) => item.trim());
				setSystemFeatures(arr);
				setLoading(false);
				nextStep();
			})
			.catch((e) => {
				alert('Error occured. Please Try Again');
			});
	};

	//system
	const [tableFeatures, setTableFeatures] = useState('');
	const handleTableFeatures = async (features) => {
		setLoading(true);
		await TableGenerator(features)
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				setTableFeatures(data.choices[0].message.content);
				console.log(data);
				setLoading(false);
				nextStep();
			})
			.catch((e) => {
				alert('Error occured. Please Try Again');
			});
	};

	mermaid.initialize({
		startOnLoad: true,
	});

	return (
		<div className='flex-column chatbot overflow-auto'>
			<div className='d-flex align-items-center '>
				{step === 1 ? <UserStories handleSystemFeatures={handleSystemFeatures} loading={loading} setLoading={setLoading} /> : null}
				{step === 2 ? <System features={systemFeatures} handleTableFeatures={handleTableFeatures} /> : null}
				{step === 3 ? <TableFeatures features={tableFeatures} setStep={setStep} /> : null}
			</div>
			{loading ? (
				<div className='d-flex justify-content-end'>
					<Spinner animation='border' role='status'>
						<span className='visually-hidden'>Loading...</span>
					</Spinner>
				</div>
			) : (
				<div className='d-flex flex-row chatbot align-items-center justify-content-center mermaid'>
					{`
					graph LR;
						A-->B;
						B-->C;
						B-->D[plop lanflz eknlzeknfz];
      		`}
				</div>
			)}
		</div>
	);
};

export default SqlGenerator;
