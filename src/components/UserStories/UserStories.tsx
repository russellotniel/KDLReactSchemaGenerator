import React, { useState, useEffect, useRef } from 'react';
import { UserStoriesGenerator } from '../../helpers/helpers';
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

	const sendMessage = async () => {
		console.log(input);
		setLoading(true);
		do{
			await processMessageToChatGPT(input);
		}while(loading != false)
		
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
				if(arr.length >= 5){
					setFeatures(arr);
					setLoading(false)
				}else{
					setLoading(true)
				}
			})
			.catch((e) => {
				alert("Error Occured. Please Try Again");
				setLoading(false)
			});
	}

	return (
			<div>
			<h1 className='text-center mb-2'>Generate your database schema</h1>
			<textarea
			  className="form-control"
			  id="floatingTextarea"
			  placeholder="What do you want to make..."
			  style={{height:"100px", resize:"none"}}
			  value={input}
			  onChange={handleChange}
			  disabled={loading}
			/>
			<div className="p-2 text-center">
			  <button
				className="btn btn-success w-50"
				onClick={sendMessage}
				disabled={loading}
			  >
				<b>Generate features</b>
			  </button>
			</div>
		  {features.length != 0 ? (
			<div className="container p-4">
			  <p>Please select the features</p>
			  <Checkbox
				features={features}
				handleSystemFeatures={handleSystemFeatures}
			  />
			</div>
		  ) : null}
		</div>
	  );
	};

export default Generator;
