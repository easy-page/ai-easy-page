import React, { useState } from 'react';
import { Descendant } from 'slate';
import { SlateEditor } from './index';
import styled from 'styled-components';
import { SENCE_ELEMENT } from './components/SenceElement';
import { PARAGRAPH_ELEMENT } from './components/PragraphElement';
import { ReactEditor } from 'slate-react';

const ExampleContainer = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
`;

const ResultContainer = styled.div`
    margin-top: 20px;
    padding: 15px;
    background: hsl(var(--background-secondary));
    border-radius: var(--radius);
    border: 1px solid hsl(var(--border));
`;

const Title = styled.h2`
    margin-bottom: 15px;
    color: hsl(var(--foreground-primary));
`;

const Subtitle = styled.h3`
    margin: 20px 0 10px;
    color: hsl(var(--foreground-secondary));
`;

const Description = styled.div`
    margin-bottom: 20px;
    color: hsl(var(--foreground-tertiary));
    line-height: 1.5;
`;

const Feature = styled.div`
    margin-bottom: 8px;
    display: flex;
    align-items: flex-start;
`;

const FeatureDot = styled.span`
    color: hsl(var(--foreground-brand));
    margin-right: 8px;
    font-weight: bold;
`;

// 初始值示例 - 使用Sence元素
const initialValueWithSence: Descendant[] = [
    {
        type: SENCE_ELEMENT,
        title: '如果场景很长会发生什么',
        children: [
            {
                text: '',
            },
        ],
    },
];

// 初始值示例 - 使用段落元素
const initialValueWithParagraph: Descendant[] = [
    {
        type: PARAGRAPH_ELEMENT,
        children: [{ text: '' }],
    },
];

export const SlateEditorExample: React.FC = () => {
    const [resultSence, setResultSence] = useState<string>('');
    const [resultParagraph, setResultParagraph] = useState<string>('');

    // 处理发送Sence编辑器内容
    const handleSendSence = (value: ReactEditor) => {
        // 将Slate的数据结构转换为可读的字符串
        const resultText = JSON.stringify(value, null, 2);
        setResultSence(resultText);
    };

    // 处理发送段落编辑器内容
    const handleSendParagraph = (value: Descendant[]) => {
        // 将Slate的数据结构转换为可读的字符串
        const resultText = JSON.stringify(value, null, 2);
        setResultParagraph(resultText);
    };

    return (
        <ExampleContainer>
            <Title>自定义元素编辑器</Title>

            <Description>
                <Feature>
                    <FeatureDot>•</FeatureDot>
                    <span>按钮为行内元素，换行后文本与左侧边缘对齐</span>
                </Feature>
                <Feature>
                    <FeatureDot>•</FeatureDot>
                    <span>左箭头图标和按钮文字样式保持一致</span>
                </Feature>
                <Feature>
                    <FeatureDot>•</FeatureDot>
                    <span>编辑器整体有蓝色边框，布局保持一致</span>
                </Feature>
                <Feature>
                    <FeatureDot>•</FeatureDot>
                    <span>当Sence元素为空时，placeholder 不会被挡住</span>
                </Feature>
            </Description>

            <Subtitle>示例1: 使用Sence元素作为初始元素</Subtitle>
            <div
                style={{
                    border: `1px solid hsl(var(--border))`,
                    padding: '0 20px',
                    borderRadius: 'var(--radius)',
                }}
            >
                {/* <SlateEditor initValue={initialValueWithSence} onSend={handleSendSence} chatService={undefined} editor={undefined} /> */}
            </div>

            {resultSence && (
                <ResultContainer>
                    <h3>编辑器内容结构：</h3>
                    <pre style={{ overflowX: 'auto' }}>{resultSence}</pre>
                </ResultContainer>
            )}

            <Subtitle>示例2: 使用段落元素作为初始元素</Subtitle>
            <div
                style={{
                    border: `1px solid hsl(var(--border))`,
                    padding: '20px',
                    marginBottom: '20px',
                    borderRadius: 'var(--radius)',
                }}
            >
                {/* <SlateEditor initValue={initialValueWithParagraph} onSend={handleSendParagraph} /> */}
            </div>

            {resultParagraph && (
                <ResultContainer>
                    <h3>编辑器内容结构：</h3>
                    <pre style={{ overflowX: 'auto' }}>{resultParagraph}</pre>
                </ResultContainer>
            )}
        </ExampleContainer>
    );
};
