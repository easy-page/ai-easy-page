import React, { FC, useEffect, useMemo, useState } from 'react';
import { Input, Segmented, Space, Select, InputNumber, Typography } from 'antd';

const { TextArea } = Input;
const { Option } = Select as any;
const { Text } = Typography;

interface StyleEditorProps {
	value?: Record<string, any>;
	onChange?: (value?: Record<string, any>) => void;
}

type Mode = 'visual' | 'json';

/**
 * 通用样式编辑器：
 * - JSON 模式：原样 JSON 文本编辑，只有当 JSON 有效时才触发 onChange
 * - 可视化模式：若干常用样式的表单控件
 */
const StyleEditor: FC<StyleEditorProps> = ({ value, onChange }) => {
	const [mode, setMode] = useState<Mode>('visual');
	const [jsonText, setJsonText] = useState<string>('');
	const [jsonError, setJsonError] = useState<string | null>(null);

	useEffect(() => {
		// 当外部值变化时，若在 JSON 模式则刷新文本
		if (mode === 'json') {
			try {
				setJsonText(JSON.stringify(value ?? {}, null, 2));
				setJsonError(null);
			} catch {
				// ignore
			}
		}
	}, [value, mode]);

	const styleObject = useMemo(() => ({ ...(value || {}) }), [value]);

	const updateStyle = (partial: Record<string, any>) => {
		const next = { ...styleObject, ...partial };
		if (onChange) onChange(next);
	};

	const handleJsonChange = (text: string) => {
		setJsonText(text);
		try {
			const parsed = text.trim() ? JSON.parse(text) : {};
			setJsonError(null);
			onChange?.(parsed);
		} catch (e: any) {
			setJsonError(e?.message || 'JSON 解析失败');
		}
	};

	return (
		<div>
			<div style={{ marginBottom: 8 }}>
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
					<TextArea
						rows={6}
						placeholder='{"width":"100%","height":300}'
						value={jsonText}
						onChange={(e) => handleJsonChange(e.target.value)}
					/>
					{jsonError && (
						<Text type="danger" style={{ marginTop: 4, display: 'block' }}>
							{jsonError}
						</Text>
					)}
				</div>
			) : (
				<Space direction="vertical" style={{ width: '100%' }} size={8}>
					<Space wrap>
						<Input
							style={{ width: 180 }}
							addonBefore="width"
							value={styleObject.width as any}
							onChange={(e) => updateStyle({ width: e.target.value })}
							placeholder="e.g. 100% 或 300"
						/>
						<Input
							style={{ width: 180 }}
							addonBefore="height"
							value={styleObject.height as any}
							onChange={(e) => updateStyle({ height: e.target.value })}
							placeholder="e.g. 100% 或 300"
						/>
						<InputNumber
							style={{ width: 180 }}
							addonBefore="fontSize"
							value={Number(styleObject.fontSize) as any}
							onChange={(v) => updateStyle({ fontSize: v ?? undefined })}
						/>
						<Input
							style={{ width: 180 }}
							addonBefore="color"
							value={styleObject.color as any}
							onChange={(e) => updateStyle({ color: e.target.value })}
							placeholder="#333 / red / rgb(0,0,0)"
						/>
						<Input
							style={{ width: 220 }}
							addonBefore="backgroundColor"
							value={styleObject.backgroundColor as any}
							onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
							placeholder="#fff / transparent"
						/>
					</Space>
					<Space wrap>
						<Input
							style={{ width: 180 }}
							addonBefore="padding"
							value={styleObject.padding as any}
							onChange={(e) => updateStyle({ padding: e.target.value })}
							placeholder="8px 12px"
						/>
						<Input
							style={{ width: 180 }}
							addonBefore="margin"
							value={styleObject.margin as any}
							onChange={(e) => updateStyle({ margin: e.target.value })}
							placeholder="8px auto"
						/>
						<Select
							style={{ width: 180 }}
							value={styleObject.textAlign as any}
							onChange={(v) => updateStyle({ textAlign: v })}
							placeholder="textAlign"
							allowClear
						>
							<Option value="left">left</Option>
							<Option value="center">center</Option>
							<Option value="right">right</Option>
							<Option value="justify">justify</Option>
						</Select>
						<Select
							style={{ width: 180 }}
							value={styleObject.position as any}
							onChange={(v) => updateStyle({ position: v })}
							placeholder="position"
							allowClear
						>
							<Option value="static">static</Option>
							<Option value="relative">relative</Option>
							<Option value="absolute">absolute</Option>
							<Option value="fixed">fixed</Option>
							<Option value="sticky">sticky</Option>
						</Select>
					</Space>
				</Space>
			)}
		</div>
	);
};

export default StyleEditor;
