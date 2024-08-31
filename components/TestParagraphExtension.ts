import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";

function createCustomParagraphPlugin(updateState) {
    return new Plugin({
        props: {
            handleClick(view, pos, event) {
                const { doc, schema } = view.state;
                const node = doc.resolve(pos).parent;
                const customParagraphNode = schema.nodes.customParagraph;

                if (node && node.type === customParagraphNode) {
                    const ids = node.attrs["data-ids"];
                    if (ids) {
                        updateState(ids.split(","));
                    }
                }

                return false;
            },
        },
    });
}

export const TestCustomParagraph = Node.create({
    name: "customParagraph",

    group: "block",
    content: "text*", // Directly holds text content
    defining: true,

    addAttributes() {
        return {
            "data-ids": {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'p[data-type="customParagraph"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "p",
            mergeAttributes(HTMLAttributes, {
                "data-type": "customParagraph",
                class: "hover:cursor-pointer hover:bg-sky-50",
            }),
            0, // 0 indicates that this node can directly hold text content
        ];
    },

    addOptions() {
        return {
            updateState: null, // Function to update state
        };
    },

    addProseMirrorPlugins() {
        return [createCustomParagraphPlugin(this.options.updateState)];
    },
});

export default TestCustomParagraph;
