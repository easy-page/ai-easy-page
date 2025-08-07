import { SenceInputComponentInputConfig } from '@/common/interfaces';
import { Descendant, Node } from 'slate';
import { CustomRenderElementProps } from '../../interface';
import './index.less';
import classNames from 'classnames';
export const INPUT_ELEMENT = 'input-element';

export type InputElement = {
    type: typeof INPUT_ELEMENT;
    children: Descendant[];
    config: SenceInputComponentInputConfig;
};

export const InputElementComponent = ({
    attributes,
    children,
    element,
}: CustomRenderElementProps) => {
    const inputElement = element as InputElement;
    const config = inputElement.config;
    const style = (config.style || {}) as any;
    const isEmpty = inputElement.children.length === 1 && Node.string(inputElement) === '';
    const placeholder = config.placeholder || '';

    return (
        <div
            {...attributes}
            style={style}
            className={classNames(
                'bg-[#FFFBDD] mx-2 inline-block relative rounded-md my-2'
                // {
                // 	'w-auto': isEmpty,
                // 	'min-w-[80px]': !isEmpty,
                // }
            )}
            data-is-empty={isEmpty ? 'true' : 'false'}
        >
            <div className="px-2 py-1 relative">
                {children}
                {isEmpty && placeholder && (
                    <div
                        contentEditable={false}
                        className="absolute inset-0 flex items-center pointer-events-none"
                    >
                        <span
                            className="text-foreground-tertiary opacity-30 truncate px-2 mx-0"
                            style={{
                                maxWidth: 'calc(100% - 4px)',
                            }}
                        >
                            {placeholder}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
