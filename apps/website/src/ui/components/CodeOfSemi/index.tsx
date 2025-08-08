import React, { useCallback, useMemo, useState } from 'react';
import { PropsWithChildren } from 'react';
import { cssClasses } from '@douyinfe/semi-foundation/chat/constants';
import copy from 'copy-text-to-clipboard';
import { IconCopyStroked, IconTick } from '@douyinfe/semi-icons';
import { nth } from 'lodash-es';

import Prism from 'prismjs';
// code's default height type is html/js/css, add jsx & tsx;
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-tsx.js';
import { CodeHighlight } from '@douyinfe/semi-ui';
import 'prismjs/components/prism-vala.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-go.js';
const code = (props: PropsWithChildren<{ className: string }>) => {
    const language = nth(props.className?.split('-'), -1)?.replace(':', '');
    if (language) {
        console.log('language:', language);
        return (
            <CodeHighlight code={props.children as string} language={language} lineNumber={true} />
        );
    } else {
        return <span className={`${cssClasses.PREFIX}-simple-code`}>{props.children}</span>;
    }
};

console.log('Prism', Prism);
const { PREFIX_CHAT_BOX } = cssClasses;

const Code = (
    props: PropsWithChildren<{ className: string }> & {
        isStreaming?: boolean;
    }
) => {
    const [copied, setCopied] = useState(false);
    const language = useMemo(() => {
        return nth(props.className?.split('-'), -1)?.replace(':', '');
    }, [props.className]);

    const onCopyButtonClick = useCallback(() => {
        console.log('props.children:', props.children);
        copy(props.children as string);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }, [props.children]);

    if (language === 'html' && !props.isStreaming) {
        return (
            <iframe
                style={{ width: '100%', border: 'none', minHeight: 200, height: 400 }}
                sandbox="allow-same-origin"
                srcDoc={props.children as string}
            />
        );
    }

    return language ? (
        <div className={`${PREFIX_CHAT_BOX}-content-code semi-always-dark`}>
            <div className={`${PREFIX_CHAT_BOX}-content-code-topSlot`}>
                <span className={`${PREFIX_CHAT_BOX}-content-code-topSlot-type`}>{language}</span>
                <span className={`${PREFIX_CHAT_BOX}-content-code-topSlot-copy`}>
                    {copied ? (
                        <span className={`${PREFIX_CHAT_BOX}-content-code-topSlot-copy-wrapper`}>
                            <IconTick />
                            已复制
                        </span>
                    ) : (
                        <button
                            className={`${PREFIX_CHAT_BOX}-content-code-topSlot-copy-wrapper ${PREFIX_CHAT_BOX}-content-code-topSlot-toCopy`}
                            onClick={onCopyButtonClick}
                        >
                            <IconCopyStroked />
                            复制
                        </button>
                    )}
                </span>
            </div>
            {code(props)}
        </div>
    ) : (
        code(props)
    );
};

// const Code = () => {
// 	return <div>Code</div>;
// };

export default Code;
