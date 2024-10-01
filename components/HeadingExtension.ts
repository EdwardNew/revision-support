import { Heading } from "@tiptap/extension-heading";

export const CustomHeading = Heading.extend({
    renderHTML({ node, HTMLAttributes }) {
        const level = node.attrs.level;
        let className = "";

        switch (level) {
            case 1:
                className = "text-base font-bold underline";
                break;
            case 2:
                className = "text-sm font-semibold";
                break;
            default:
                className = "text-sm";
                break;
        }

        return ["h" + level, { ...HTMLAttributes, class: className }, 0];
    },
});
