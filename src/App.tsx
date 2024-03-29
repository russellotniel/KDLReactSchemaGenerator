import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as SendIcon } from '../images/icon-send.svg';
import UserStories from './components/UserStories/UserStories';
import { postgresqlToMermaid, SystemGenerator, TableGenerator } from './helpers/helpers';
import System from './components/System/System';
import TableFeatures from './components/TableFeatures/TableFeatures';
import { Spinner } from 'react-bootstrap';
import DMLGenerator from './components/DMLGenerator/DMLGenerator';

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
	const [systemFeatures, setSystemFeatures] = useState<string[]>([]);
	const handleSystemFeatures = async (features: string) => {
		setLoading(true);
		do {
			await processToGenerateSystemFeatures(features);
		} while (loading != false);
	};

	const processToGenerateSystemFeatures = async (features: string) => {
		await SystemGenerator(features)
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				const arr = data.choices[0].message.content
					.replace(/\n/g, '')
					.split('*')
					.filter((item: string) => item !== '')
					.map((item: string) => item.trim());
				if (arr.length >= 5) {
					setSystemFeatures(arr);
					setLoading(false);
					nextStep();
					console.log(step);
				} else {
					setLoading(true);
				}
			})
			.catch((e) => {
				setLoading(false);
				alert('Error occured. Please Try Again');
			});
	};

	//system
	const [tableFeatures, setTableFeatures] = useState('');

	const containsCreateTable = (inputString: string): boolean => {
		const regex = /\bCREATE\s+TABLE\b/;
		return regex.test(inputString);
	};

	const handleTableFeatures: (features: string) => Promise<void> = async (features: string) => {
		setLoading(true);
		await TableGenerator(features)
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				setLoading(false);
				if (containsCreateTable(data.choices[0].message.content)) {
					const newData = postgresqlToMermaid(data.choices[0].message.content);
					setTableFeatures(newData);
					console.log(data);
					nextStep();
				} else {
					alert(data.choices[0].message.content);
				}
			})
			.catch((e) => {
				alert('Error occured. Please Try Again');
			});
	};

	// DDL
	const [ddl, setDDL] = useState('');

	const handleStep4 = (tempDDL: string) => {
		setDDL(tempDDL);
		nextStep();
	};

	return (
		<div className='vh-100'>
			{step < 3 ? (
				<div className='vh-100 d-flex align-items-center justify-content-center chatbot'>
					<div className=''>
						{step === 1 ? <UserStories handleSystemFeatures={handleSystemFeatures} loading={loading} setLoading={setLoading} /> : null}
						{step === 2 ? <System features={systemFeatures} handleTableFeatures={handleTableFeatures} /> : null}
					</div>
					{loading ? (
						<div className='d-flex justify-content-end'>
							<Spinner animation='border' role='status' variant='success'>
								<span className='visually-hidden'>Loading...</span>
							</Spinner>
						</div>
					) : null}
				</div>
			) : (
				<>
					<div>{step === 3 ? <TableFeatures features={tableFeatures} handleStep4={handleStep4} /> : null}</div>
					<div>{step === 4 ? <DMLGenerator ddl={ddl} /> : null}</div>
				</>
			)}
		</div>
	);
};

export default SqlGenerator;
