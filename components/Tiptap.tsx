import { useEditor, EditorContent } from "@tiptap/react";
import { Toggle } from "@/components/ui/toggle";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { CustomHeading } from "@/components/HeadingExtension";
import { TestCustomParagraph } from "./TestParagraphExtension";

import { Bold, Italic, List, ListChecks, ListOrdered } from "lucide-react";
import { UnderlineIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";

type TiptapProps = {
    rawContent: any;
    setRawContent: React.Dispatch<React.SetStateAction<any>>;
    type: "todoList" | "outline";
    setFilteredIssues?: React.Dispatch<React.SetStateAction<Array<string>>>;
};

export function Tiptap({
    rawContent,
    type,
    setRawContent,
    setFilteredIssues,
}: TiptapProps) {
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
        CustomHeading,
    ];

    if (type === "todoList") {
        extensions.push(
            TestCustomParagraph.configure({
                updateState: setFilteredIssues,
            })
        );
    }

    const editor = useEditor({
        extensions: extensions,
        content: rawContent,
        onUpdate: ({ editor }) => {
            const jsonContent = editor.getJSON();
            setRawContent(jsonContent);
        },
        editorProps: {
            attributes: {
                class: "min-h-[250px] p-4 focus:outline-none text-sm",
            },
        },
    });

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(rawContent);
        }
    }, [rawContent, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted p-1 flex gap-1">
                <Toggle
                    className=" data-[state=on]:bg-slate-300 hover:bg-slate-200"
                    aria-label="Toggle bold"
                    pressed={editor.isActive("bold")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleBold().run()
                    }
                >
                    <Bold className="h-3 w-3" />
                </Toggle>
                <Toggle
                    className="data-[state=on]:bg-slate-300 hover:bg-slate-200"
                    aria-label="Toggle italic"
                    pressed={editor.isActive("italic")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleItalic().run()
                    }
                >
                    <Italic className="h-3 w-3" />
                </Toggle>
                <Toggle
                    className="data-[state=on]:bg-slate-300 hover:bg-slate-200"
                    aria-label="Toggle underline"
                    pressed={editor.isActive("underline")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                >
                    <UnderlineIcon className="h-3 w-3" />
                </Toggle>
                <Toggle
                    className="data-[state=on]:bg-slate-300 hover:bg-slate-200"
                    aria-label="Toggle bulleted list"
                    pressed={editor.isActive("bulletList")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >
                    <List className="h-3 w-3" />
                </Toggle>
                <Toggle
                    className="data-[state=on]:bg-slate-300 hover:bg-slate-200"
                    aria-label="Toggle ordered list"
                    pressed={editor.isActive("orderedList")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                >
                    <ListOrdered className="h-3 w-3" />
                </Toggle>
                <Toggle
                    className="data-[state=on]:bg-slate-300 hover:bg-slate-200"
                    aria-label="Toggle ordered list"
                    pressed={editor.isActive("taskList")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleTaskList().run()
                    }
                >
                    <ListChecks className="h-3 w-3" />
                </Toggle>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
