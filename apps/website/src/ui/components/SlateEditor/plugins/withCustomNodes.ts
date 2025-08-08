import { Editor, Element } from 'slate';
import {
    ELEMENT_TYPES,
    NODE_CONFIGS,
    getNodeConfig,
    normalizeByConfig,
    detectAndTransformNode,
} from '../constants';
import { Element as SlateElement, Transforms, Path, Range, Text, Node } from 'slate';
// 自定义节点插件
export const withCustomNodes = (editor: Editor) => {
    const { isVoid, isInline, normalizeNode, insertBreak } = editor;

    // 重写 isVoid 方法，基于配置决定
    editor.isVoid = (element) => {
        if (SlateElement.isElement(element) && element.type) {
            const config = getNodeConfig(element.type);
            if (config && config.isVoid !== undefined) {
                return config.isVoid;
            }
        }
        return isVoid(element);
    };

    // 重写 isInline 方法，基于配置决定
    editor.isInline = (element) => {
        if (SlateElement.isElement(element) && element.type) {
            const config = getNodeConfig(element.type);
            if (config && config.isInline !== undefined) {
                return config.isInline;
            }
        }
        return isInline(element);
    };

    // 自定义回车行为，保持元素类型
    editor.insertBreak = () => {
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
            const [node, path] = Editor.node(editor, selection);
            const parent = Editor.parent(editor, path);

            // 如果当前在自定义元素内
            if (SlateElement.isElement(parent[0])) {
                if (parent[0].type !== ELEMENT_TYPES.PARAGRAPH) {
                    // 在当前自定义元素后插入一个新的自定义元素
                    const parentPath = parent[1];
                    const newPath = Path.next(parentPath);

                    // 判断是否在行末
                    const isAtEnd = Editor.isEnd(editor, selection.anchor, path);

                    if (isAtEnd) {
                        // 如果在行末，添加一个新的自定义元素
                        Transforms.insertNodes(
                            editor,
                            {
                                type: ELEMENT_TYPES.PARAGRAPH,
                                children: [{ text: '' }],
                            },
                            { at: newPath }
                        );

                        // 移动光标到新元素
                        Transforms.select(editor, newPath);
                        Transforms.collapse(editor, { edge: 'start' });
                    } else {
                        // 如果不在行末，将当前位置之后的内容移动到新节点
                        const currentRange = Editor.range(editor, path);
                        const endPoint = Range.end(currentRange);
                        const rangeAfterCursor = {
                            anchor: selection.anchor,
                            focus: endPoint,
                        };

                        // 获取光标后的文本内容
                        const fragment = Editor.fragment(editor, rangeAfterCursor);

                        // 删除光标后的内容
                        Transforms.delete(editor, {
                            at: {
                                anchor: selection.anchor,
                                focus: endPoint,
                            },
                        });

                        // 创建新节点并插入提取的内容
                        Transforms.insertNodes(
                            editor,
                            {
                                type: ELEMENT_TYPES.PARAGRAPH,
                                children: fragment.length > 0 ? fragment : [{ text: '' }],
                            },
                            { at: newPath }
                        );

                        // 移动光标到新元素开始处
                        Transforms.select(editor, newPath);
                        Transforms.collapse(editor, { edge: 'start' });
                    }

                    return;
                }
            }
        }

        // 否则使用默认行为
        insertBreak();
    };

    // 规范化节点，基于配置处理
    editor.normalizeNode = (entry) => {
        const [node, path] = entry;

        // 如果是根级节点
        if (path.length === 1) {
            if (Text.isText(node)) {
                // 如果是文本节点，包装成自定义元素
                Transforms.wrapNodes(
                    editor,
                    { type: ELEMENT_TYPES.PARAGRAPH, children: [] },
                    { at: path }
                );
                return;
            } else if (SlateElement.isElement(node) && !node.type) {
                // 如果是没有类型的元素，设置为自定义元素
                Transforms.setNodes(editor, { type: ELEMENT_TYPES.PARAGRAPH }, { at: path });
                return;
            }
        }

        // 使用配置系统处理节点规范化
        if (SlateElement.isElement(node)) {
            console.log('node.type: 其他元素 0000', node.type);
            // 首先尝试使用配置的normalize函数
            if (node.type && normalizeByConfig(editor, entry as any)) {
                return;
            }

            // 处理文本节点中可能存在的匹配模式
            if (node.type === ELEMENT_TYPES.PARAGRAPH) {
                // 检查段落内的文本节点
                for (let i = 0; i < node.children.length; i++) {
                    const child = node.children[i];
                    if (Text.isText(child) && child.text) {
                        // 尝试检测文本是否符合某个节点的模式
                        const transformedNode = detectAndTransformNode(child.text);
                        if (transformedNode) {
                            // 找到匹配的模式，将文本转换为相应的节点
                            // 确保transformedNode是一个完整的节点对象
                            const completeNode = {
                                ...transformedNode,
                                // 确保children属性存在
                                children: transformedNode.children || [{ text: child.text }],
                            } as Node;

                            Transforms.removeNodes(editor, { at: [...path, i] });
                            Transforms.insertNodes(editor, completeNode, {
                                at: [...path, i],
                            });
                            return;
                        }
                    }
                }
            }
        }

        // 调用原始的normalizeNode处理其他情况
        normalizeNode(entry);
    };

    return editor;
};
