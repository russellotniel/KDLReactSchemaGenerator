export const UserStoriesGenerator = async (chatMessages: string) => {
	const userMessage = {
		role: 'user',
		content: chatMessages,
	};

	const systemMessage = {
		role: 'system',
		content: 'The response must be in bullet points without preamble. The bullet points change with *',
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
		content: 'The response must be in bullet points without preamble. The bullet points change with *. Make the features with the input.',
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
		content: 'Please response with an AML Syntax. Generate the database table from user input without preamble',
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
