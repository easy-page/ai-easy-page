import React, { FC, useEffect, useMemo, useState } from 'react';
import { Segmented, Typography, Collapse } from 'antd';
import {
	SizePositionGroup,
	TypographyGroup,
	FillGroup,
	SpacingGroup,
	BorderShadowGroup,
	PositionGroup,
	AutoLayoutGroup,
	AlignmentGroup,
} from './parts';

const { Text } = Typography;

interface StyleEditorProps {
	value?: Record<string, any>;
	onChange?: (value?: Record<string, any>) => void;
}

type Mode = 'visual' | 'json';

const StyleEditor: FC<StyleEditorProps> = ({ value, onChange }) => {
	const [mode, setMode] = useState<Mode>('visual');
	const [jsonText, setJsonText] = useState<string>('');
	const [jsonError, setJsonError] = useState<string | null>(null);

	const styleObject = useMemo(() => ({ ...(value || {}) }), [value]);

	useEffect(() => {
		if (mode === 'json') {
			try {
				setJsonText(JSON.stringify(styleObject ?? {}, null, 2));
				setJsonError(null);
			} catch {}
		}
	}, [mode, styleObject]);

	const updateStyle = (partial: Record<string, any>) => {
		const next = { ...styleObject, ...partial };
		onChange?.(next);
	};

	return (
		<div>
			<div
				style={{
					marginBottom: 8,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Text strong>样式</Text>
				<Segmented
					value={mode}
					onChange={(v) => setMode(v as Mode)}
					options={[
						{ label: '可视化', value: 'visual' },
						{ label: 'JSON', value: 'json' },
					]}
				/>
			</div>

			{mode === 'json' ? (
				<div>
					<textarea
						rows={8}
						placeholder='{"width":"100%","height":300}'
						value={jsonText}
						onChange={(e) => {
							const text = e.target.value;
							setJsonText(text);
							try {
								const parsed = text.trim() ? JSON.parse(text) : {};
								setJsonError(null);
								onChange?.(parsed);
							} catch (e: any) {
								setJsonError(e?.message || 'JSON 解析失败');
							}
						}}
						style={{ width: '100%', fontFamily: 'monospace' }}
					/>
					{jsonError && (
						<div style={{ color: '#ff4d4f', marginTop: 4 }}>{jsonError}</div>
					)}
				</div>
			) : (
				<Collapse bordered={false} defaultActiveKey={['panel']} ghost>
					<Collapse.Panel
						header={<Text type="secondary">样式设置</Text>}
						key="panel"
					>
						<SizePositionGroup value={styleObject} onChange={updateStyle} />
						<TypographyGroup value={styleObject} onChange={updateStyle} />
						<FillGroup value={styleObject} onChange={updateStyle} />
						<SpacingGroup value={styleObject} onChange={updateStyle} />
						<BorderShadowGroup value={styleObject} onChange={updateStyle} />
						<AlignmentGroup value={styleObject} onChange={updateStyle} />
						<AutoLayoutGroup value={styleObject} onChange={updateStyle} />
						<PositionGroup value={styleObject} onChange={updateStyle} />
					</Collapse.Panel>
				</Collapse>
			)}
		</div>
	);
};

export default StyleEditor;
