export const getCardComponent = ({
	chunkId,
	messageId,
	conversationId,
}: {
	chunkId: string;
	messageId: string;
	conversationId: string;
}): string => {
	return `\n\r<CustomCard id="${chunkId}" messageId="${messageId}" conversationId="${conversationId}" />\n\r`;
};
