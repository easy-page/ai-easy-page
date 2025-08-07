import React, { useState } from 'react';
import { ChatMessageContext } from '../../../../../common/interfaces/messages/chatMessages/context';
import { ContextCard } from '../../../ContextCard';

interface FileContextListProps {
	files: ChatMessageContext[];
	maxShow?: number;
	className?: string;
}

export const FileContextList: React.FC<FileContextListProps> = ({
	files,
	maxShow = 2,
	className,
}) => {
	const [showAll, setShowAll] = useState(false);
	if (!files || files.length === 0) return null;
	const showFiles = showAll ? files : files.slice(0, maxShow + 1);
	const hasMore = files.length > maxShow;
	return (
		<div
			className={className || ''}
			style={{ position: 'relative', overflow: 'hidden' }}
		>
			<div className="flex flex-col gap-2">
				{showFiles.map((file, idx) => {
					if (!showAll && hasMore && idx === maxShow) {
						return (
							<div key={file.id} className="relative ">
								<ContextCard card={file} showDelete={false} />
								<div
									className="absolute left-0 top-0 w-full h-full z-10 rounded-b-lg"
									style={{
										background:
											'linear-gradient(to bottom, rgba(255,255,255,0) 30%, #fff 80%, #fff 100%)',
										pointerEvents: 'auto',
									}}
								/>
								<button
									className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-background-primary shadow text-foreground-primary text-small border border-border hover:bg-background-hover transition-colors z-20"
									onClick={() => setShowAll(true)}
								>
									查看所有
								</button>
							</div>
						);
					}
					return <ContextCard key={file.id} card={file} showDelete={false} />;
				})}
			</div>
		</div>
	);
};
