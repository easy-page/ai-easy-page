import React from 'react';
import TabLayoutDemo from './TabLayoutDemo';
import TableLayoutDemo from './TableLayoutDemo';
import CustomContainerDemo from './CustomContainerDemo';
import SubsidyTierTableDemo from './SubsidyTierTableDemo';
import CrossRowValidationDemo from './CrossRowValidationDemo';
import WhenDemo from './WhenDemo';
import MergedCellDemo from './MergedCellDemo';
import MergedCellTableDemo from './MergedCellTableDemo';

const DynamicFormDemo: React.FC = () => {
	return (
		<>
			<MergedCellDemo />
			<MergedCellTableDemo />
			<WhenDemo />
			<CrossRowValidationDemo />
			<SubsidyTierTableDemo />
			<TabLayoutDemo />
			<TableLayoutDemo />
			<CustomContainerDemo />
		</>
	);
};

export default DynamicFormDemo;
