import React from 'react';
import { Typography } from 'antd';
import { motion } from 'framer-motion';
import './index.less';

const { Title } = Typography;

interface PageContainerProps {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
	className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
	title,
	subtitle,
	children,
	className = '',
}) => {
	return (
		<div className={`page-container ${className}`}>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Title level={1} className="page-title">
					{title}
				</Title>
				{subtitle && (
					<Title level={4} className="page-subtitle">
						{subtitle}
					</Title>
				)}
			</motion.div>

			<div className="page-content">{children}</div>
		</div>
	);
};

export default PageContainer;
