

interface Props{
	features: string,
	setStep: (num: number) => any,
}

const tableFeatures: React.FC<Props> = ({ features, setStep }) => {
	return (
		<div className='w-100'>
			<div className='flex-column input-container h-75'>
				<textarea
					className='form-control'
					// type='text'
					placeholder='Result'
					value={features}
					style={{ height: '400px', resize: 'none' }}
					//   onChange={handleChange}
					//   disabled={loading}
				/>
				<div className='text-end mt-2'>
					<button
						className='btn btn-primary'
						onClick={() => {
							setStep(1);
						}}
					>
						Back to Chat
					</button>
				</div>
			</div>
		</div>
	);
};

export default tableFeatures;
