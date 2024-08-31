import { useEditor, EditorContent } from "@tiptap/react";
import { Toggle } from "@/components/ui/toggle";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { TestCustomParagraph } from "./TestParagraphExtension";

import { Bold, Italic, List, ListChecks, ListOrdered } from "lucide-react";
import { UnderlineIcon } from "@radix-ui/react-icons";

function generateTodoListJSON(notesSummary) {
    if (!notesSummary) {
        return;
    }

    return {
        type: "doc",
        content: [
            {
                type: "bulletList",
                content: notesSummary.map((topicObject) => {
                    const topic = Object.keys(topicObject)[0];
                    const actionItems = topicObject[topic];
                    return {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                content: [{ type: "text", text: topic }],
                            },
                            {
                                type: "bulletList",
                                content: actionItems.map((actionItemObject) => {
                                    const actionItem =
                                        Object.keys(actionItemObject)[0];
                                    const ids =
                                        actionItemObject[actionItem].join(",");
                                    return {
                                        type: "listItem",
                                        content: [
                                            {
                                                type: "customParagraph",
                                                attrs: {
                                                    "data-ids": ids,
                                                },
                                                content: [
                                                    {
                                                        type: "text",
                                                        text: actionItem,
                                                    },
                                                ],
                                            },
                                        ],
                                    };
                                }),
                            },
                        ],
                    };
                }),
            },
        ],
    };
}

function generateOutlineJSON(notesSummary) {
    if (!notesSummary) {
        return;
    }

    function generateParagraph(heading, text) {
        if (text && typeof text === "object") {
            // If the text is an object, recursively process it
            return {
                type: "paragraph",
                content: [
                    {
                        type: "text",
                        text: heading,
                        marks: [{ type: "bold" }, { type: "underline" }],
                    },
                    ...Object.entries(text).map(([subHeading, subText]) =>
                        generateParagraph(subHeading, subText)
                    ),
                ],
            };
        } else {
            // Base case: when text is not an object
            return {
                type: "paragraph",
                content: [
                    {
                        type: "text",
                        marks: [{ type: "bold" }, { type: "underline" }],
                        text: heading, // Add heading as prefix
                    },
                    {
                        type: "paragraph",
                        content: [{ type: "text", text: text }],
                    },
                ],
            };
        }
    }

    return {
        type: "doc",
        content: Object.entries(notesSummary[0]).map(([heading, text]) =>
            generateParagraph(heading, text)
        ),
    };
}

import type { TodoTopic } from "@/app/page";

type TiptapProps = {
    rawContent: TodoTopic[] | any;
    type: "todoList" | "outline";
    setFilteredIssues?: React.Dispatch<React.SetStateAction<Array<string>>>;
};

export function Tiptap({ rawContent, type, setFilteredIssues }: TiptapProps) {
    let extensions = [
        StarterKit.configure({
            bulletList: {
                HTMLAttributes: {
                    class: "list-disc pl-6",
                },
            },
            orderedList: {
                HTMLAttributes: {
                    class: "list-decimal pl-6",
                },
            },
        }),
        Underline,
        TaskList,
        TaskItem.configure({
            nested: true,
            HTMLAttributes: {
                class: "flex items-start gap-2 pl-1",
            },
        }),
    ];

    if (type === "todoList") {
        extensions.push(
            TestCustomParagraph.configure({
                updateState: setFilteredIssues,
            })
        );
    }

    const parsedContent =
        type === "todoList"
            ? generateTodoListJSON(rawContent)
            : generateOutlineJSON(rawContent);

    const editor = useEditor({
        extensions: extensions,
        content: parsedContent,
        editorProps: {
            attributes: {
                class: "min-h-[250px] p-4 focus:outline-none",
            },
        },
    });
    if (!editor) {
        return null;
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted p-2 flex gap-1">
                <Toggle
                    className="data-[state=on]:bg-slate-300 hover:bg-slate-200"
                    aria-label="Toggle bold"
                    pressed={editor.isActive("bold")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleBold().run()
                    }
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    className="data-[state=on]:bg-slate-300 hover:bg-slate-200"
                    aria-label="Toggle italic"
                    pressed={editor.isActive("italic")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleItalic().run()
                    }
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                    className="data-[state=on]:bg-slate-300 hover:bg-slate-200"
                    aria-label="Toggle underline"
                    pressed={editor.isActive("underline")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Toggle>
                <Toggle
                    className="data-[state=on]:bg-slate-300 hover:bg-slate-200"
                    aria-label="Toggle bulleted list"
                    pressed={editor.isActive("bulletList")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                    className="data-[state=on]:bg-slate-300 hover:bg-slate-200"
                    aria-label="Toggle ordered list"
                    pressed={editor.isActive("orderedList")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>
                <Toggle
                    className="data-[state=on]:bg-slate-300 hover:bg-slate-200"
                    aria-label="Toggle ordered list"
                    pressed={editor.isActive("taskList")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleTaskList().run()
                    }
                >
                    <ListChecks className="h-4 w-4" />
                </Toggle>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
