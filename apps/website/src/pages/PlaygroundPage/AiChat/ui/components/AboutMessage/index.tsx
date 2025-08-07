import { AboutClientMessage } from '../../../common/interfaces/messages/chatMessages/client';

interface AboutMessageProps {
	message: AboutClientMessage;
}

// 假设关于信息可能包含的详细信息
interface AboutData {
	version?: string;
	model?: string;
	capabilities?: string[];
	limitations?: string[];
	features?: {
		[feature: string]: boolean | string;
	};
	usage?: {
		maxTokens?: number;
		maxMessages?: number;
		supportedFormats?: string[];
	};
	contact?: {
		email?: string;
		website?: string;
		documentation?: string;
	};
}

export const AboutMessage: React.FC<AboutMessageProps> = ({ message }) => {
	// 尝试解析content中的JSON数据，如果失败则显示原始内容
	let aboutData: AboutData | null = null;
	try {
		if (message.content && message.content.startsWith('{')) {
			aboutData = JSON.parse(message.content);
		}
	} catch (e) {
		// 如果解析失败，保持为null，显示原始内容
	}

	return (
		<div className="flex justify-start mb-4">
			<div className="max-w-[80%] bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 shadow-sm">
				<div className="flex items-center gap-2 text-sm text-purple-700 mb-3">
					<span>ℹ️</span>
					<span>关于</span>
				</div>

				{aboutData ? (
					<div className="space-y-3">
						{/* 基本信息 */}
						{(aboutData.version || aboutData.model) && (
							<div className="bg-purple-100 rounded p-2">
								<div className="text-xs font-medium text-purple-700 mb-2">
									基本信息
								</div>
								<div className="space-y-1 text-xs">
									{aboutData.version && (
										<div className="flex justify-between">
											<span className="text-purple-600">版本:</span>
											<span className="font-medium">{aboutData.version}</span>
										</div>
									)}
									{aboutData.model && (
										<div className="flex justify-between">
											<span className="text-purple-600">模型:</span>
											<span className="font-medium">{aboutData.model}</span>
										</div>
									)}
								</div>
							</div>
						)}

						{/* 功能特性 */}
						{aboutData.capabilities && aboutData.capabilities.length > 0 && (
							<div className="bg-purple-100 rounded p-2">
								<div className="text-xs font-medium text-purple-700 mb-2">
									功能特性
								</div>
								<div className="space-y-1 text-xs">
									{aboutData.capabilities.map((capability, index) => (
										<div key={index} className="flex items-center gap-2">
											<span className="text-purple-500">✓</span>
											<span className="text-purple-600">{capability}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* 限制说明 */}
						{aboutData.limitations && aboutData.limitations.length > 0 && (
							<div className="bg-purple-100 rounded p-2">
								<div className="text-xs font-medium text-purple-700 mb-2">
									限制说明
								</div>
								<div className="space-y-1 text-xs">
									{aboutData.limitations.map((limitation, index) => (
										<div key={index} className="flex items-center gap-2">
											<span className="text-purple-500">⚠</span>
											<span className="text-purple-600">{limitation}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* 使用限制 */}
						{aboutData.usage && (
							<div className="bg-purple-100 rounded p-2">
								<div className="text-xs font-medium text-purple-700 mb-2">
									使用限制
								</div>
								<div className="space-y-1 text-xs">
									{aboutData.usage.maxTokens && (
										<div className="flex justify-between">
											<span className="text-purple-600">最大 Token:</span>
											<span className="font-medium">
												{aboutData.usage.maxTokens.toLocaleString()}
											</span>
										</div>
									)}
									{aboutData.usage.maxMessages && (
										<div className="flex justify-between">
											<span className="text-purple-600">最大消息数:</span>
											<span className="font-medium">
												{aboutData.usage.maxMessages}
											</span>
										</div>
									)}
									{aboutData.usage.supportedFormats &&
										aboutData.usage.supportedFormats.length > 0 && (
											<div>
												<span className="text-purple-600">支持格式:</span>
												<span className="ml-1 font-medium">
													{aboutData.usage.supportedFormats.join(', ')}
												</span>
											</div>
										)}
								</div>
							</div>
						)}

						{/* 功能开关 */}
						{aboutData.features &&
							Object.keys(aboutData.features).length > 0 && (
								<div className="bg-purple-100 rounded p-2">
									<div className="text-xs font-medium text-purple-700 mb-2">
										功能开关
									</div>
									<div className="space-y-1 text-xs">
										{Object.entries(aboutData.features).map(
											([feature, value]) => (
												<div key={feature} className="flex justify-between">
													<span className="text-purple-600">{feature}:</span>
													<span
														className={`font-medium ${
															value ? 'text-green-600' : 'text-red-600'
														}`}
													>
														{typeof value === 'boolean'
															? value
																? '启用'
																: '禁用'
															: value}
													</span>
												</div>
											)
										)}
									</div>
								</div>
							)}

						{/* 联系方式 */}
						{aboutData.contact && (
							<div className="bg-purple-100 rounded p-2">
								<div className="text-xs font-medium text-purple-700 mb-2">
									联系方式
								</div>
								<div className="space-y-1 text-xs">
									{aboutData.contact.email && (
										<div className="flex justify-between">
											<span className="text-purple-600">邮箱:</span>
											<span className="font-medium">
												{aboutData.contact.email}
											</span>
										</div>
									)}
									{aboutData.contact.website && (
										<div className="flex justify-between">
											<span className="text-purple-600">网站:</span>
											<span className="font-medium">
												{aboutData.contact.website}
											</span>
										</div>
									)}
									{aboutData.contact.documentation && (
										<div className="flex justify-between">
											<span className="text-purple-600">文档:</span>
											<span className="font-medium">
												{aboutData.contact.documentation}
											</span>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				) : (
					<div className="text-xs text-purple-600">{message.content}</div>
				)}
			</div>
		</div>
	);
};
