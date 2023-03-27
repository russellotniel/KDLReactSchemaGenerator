import React, { useState, useEffect, useRef } from 'react';
import { UserStoriesGenerator } from '../../helpers/helpers';
import { ReactComponent as SendIcon } from '../../images/icon-send.svg';
import Checkbox from './Checkbox';

interface Props{
	loading: boolean,
	setLoading: (bool: boolean) => void,
	handleSystemFeatures : (features: string) => Promise<void>
}

const Generator: React.FC<Props> = ({ handleSystemFeatures, loading, setLoading }) => {
	const [input, setInput] = useState('');
	const [features, setFeatures] = useState([]);
	
	const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setInput(event.target.value);
	};

	const sendMessage = () => {
		console.log(input);
		setLoading(true);
		processMessageToChatGPT(input);
	};

	async function processMessageToChatGPT(chatMessages: string) {
		await UserStoriesGenerator(chatMessages)
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				const arr = data.choices[0].message.content
					.replace(/\n/g, '')
					.split('*')
					.filter((item: string) => item !== '')
					.map((item: string) => item.trim());
				setFeatures(arr);
				setLoading(false);
			})
			.catch((e) => {
				setLoading(false);
			});
	}

	return (
		<div className='w-100'>
			<div className='flex-column input-container'>
				{/* <textarea className='form-control ' type='text' id='floatingTextarea' placeholder='What do you want to make...' value={input} onChange={handleChange} disabled={loading} /> */}
				<textarea className='form-control ' id='floatingTextarea' placeholder='What do you want to make...' value={input} onChange={handleChange} disabled={loading} />
				<button className='button-primary' onClick={sendMessage} disabled={loading}>
					<SendIcon className='send-icon' />
				</button>
			</div>
			{features.length != 0 ? (
				<div className='container p-4'>
					<p>Please select the features</p>
					<Checkbox features={features} handleSystemFeatures={handleSystemFeatures} />
				</div>
			) : null}
		</div>
	);
};

export default Generator;
