export const ThinkingLoading = () => {
	return (
		<div
			style={{
				width: 'fit-content',
			}}
			className="flex px-2 flex-row items-center bg-white rounded-lg gap-2 py-4 my-2 text-small content-start"
		>
			<div className="planning-container">
				<span className="planning-text">思考中</span>
				<div className="rotating-dots">
					<span className="dot dot-1"></span>
					<span className="dot dot-2"></span>
				</div>
			</div>
		</div>
	);
};
