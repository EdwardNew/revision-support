"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";

import type { Tags } from "@/app/page";

const tagCategoryColors = {
    reviewer: "text-red-600" as string,
    type: "text-green-600" as string,
    status: "text-blue-600" as string,
};

type SearchbarProps = {
    selectedTags: Tags;
    setSelectedTags: React.Dispatch<React.SetStateAction<Tags>>;
};

export function Searchbar({ selectedTags, setSelectedTags }: SearchbarProps) {
    const [allTags, setAllTags] = useState({
        reviewer: ["reviewer 1", "reviewer 2", "reviewer 3"] as string[],
        type: ["novelty", "grammar & style", "technical accuracy"] as string[],
        status: ["not started", "in progress", "done"] as string[],
    });

    const [suggestedTags, setSuggestedTags] = useState(
        allTags as Partial<typeof allTags>
    );

    const [searchQuery, setSearchQuery] = useState("");
    const [inputFocused, setInputFocused] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isChecked = (tagCategory: keyof typeof selectedTags, tag: string) => {
        // console.log("isChecked?", selectedTags[tagCategory].includes(tag));
        return selectedTags[tagCategory].includes(tag);
    };

    const handleTagSelect = (
        tagCategory: keyof typeof selectedTags,
        tag: string
    ) => {
        setSelectedTags((prevSelectedTags) => ({
            ...prevSelectedTags,
            [tagCategory]: [...prevSelectedTags[tagCategory], tag],
        }));
    };

    const handleTagRemove = (
        tagCategory: keyof typeof selectedTags,
        tag: string
    ) => {
        setSelectedTags((prevSelectedTags) => ({
            ...prevSelectedTags,
            [tagCategory]: prevSelectedTags[tagCategory].filter(
                (t) => t !== tag
            ),
        }));
    };

    const handleTagCheckbox = (
        isChecked: boolean,
        tagCategory: keyof typeof selectedTags,
        tag: string
    ) => {
        // console.log(isChecked, selectedTags);
        isChecked
            ? handleTagSelect(tagCategory, tag)
            : handleTagRemove(tagCategory, tag);
    };

    const handleSearch = (e: any) => {
        // console.log("changed!");

        setSearchQuery(e.target.value);

        let filteredTags: Partial<typeof allTags> = {};

        Object.keys(allTags).forEach((tagCategory) => {
            const filteredArray = allTags[
                tagCategory as keyof typeof allTags
            ].filter((tag) =>
                tag.toLowerCase().includes(e.target.value.toLowerCase())
            );

            if (filteredArray.length > 0) {
                filteredTags[tagCategory as keyof typeof allTags] =
                    filteredArray;
            }
        });

        setSuggestedTags(filteredTags);
    };

    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (
            dropdownRef.current &&
            dropdownRef.current.contains(event.relatedTarget)
        ) {
            return;
        }
        setInputFocused(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setInputFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="relative mt-6" ref={dropdownRef}>
                <Input
                    type="text"
                    placeholder="Filter tags..."
                    value={searchQuery}
                    onChange={handleSearch}
                    onFocus={() => setInputFocused(true)}
                    onBlur={handleInputBlur}
                    className="pr-10"
                />
                {inputFocused && (
                    <div
                        onMouseDown={(e) => e.preventDefault()}
                        className="absolute top-full left-0 w-full bg-background border rounded-md shadow-lg z-10 mt-1"
                    >
                        <ul className="p-4 text-sm">
                            {Object.entries(suggestedTags).map(
                                ([tagCategory, tags]) => (
                                    <div
                                        key={tagCategory}
                                        className="flex flex-col"
                                    >
                                        <span className="mb-2 border-b-2 border-orange-600">
                                            {tagCategory}
                                        </span>
                                        {tags.map((tag) => (
                                            <span
                                                key={`${tag}-checkbox`}
                                                className="flex flex-row items-center"
                                            >
                                                <Checkbox
                                                    id={tag}
                                                    checked={isChecked(
                                                        tagCategory as keyof typeof selectedTags,
                                                        tag as string
                                                    )}
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        handleTagCheckbox(
                                                            checked as boolean,
                                                            tagCategory as keyof typeof selectedTags,
                                                            tag as string
                                                        )
                                                    }
                                                />
                                                <label
                                                    htmlFor={tag}
                                                    className={`${
                                                        tagCategoryColors[
                                                            tagCategory as keyof typeof tagCategoryColors
                                                        ]
                                                    } font-sm ml-2 hover: cursor-pointer`}
                                                >
                                                    {tag}
                                                </label>
                                            </span>
                                        ))}
                                    </div>
                                )
                            )}
                        </ul>
                    </div>
                )}
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                </Button>
            </div>
            <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedTags).map(([tagCategory, tags]) =>
                        tags.map((tag) => (
                            <Badge
                                key={`${tag}-badge`}
                                variant="outline"
                                className={`${
                                    tagCategoryColors[
                                        tagCategory as keyof typeof tagCategoryColors
                                    ]
                                } hover: cursor-pointer`}
                                onClick={() =>
                                    handleTagRemove(
                                        tagCategory as keyof typeof selectedTags,
                                        tag as string
                                    )
                                }
                            >
                                <span>{tag}</span>
                                <Cross2Icon className="w-4 h-4 ml-4" />
                            </Badge>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

// import { Check, ChevronsUpDown } from "lucide-react"

// import { CheckIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
// } from "@/components/ui/command";
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover";

// import { useState } from "react";

// const frameworks = [
//     {
//         value: "next.js",
//         label: "Next.js",
//     },
//     {
//         value: "sveltekit",
//         label: "SvelteKit",
//     },
//     {
//         value: "nuxt.js",
//         label: "Nuxt.js",
//     },
//     {
//         value: "remix",
//         label: "Remix",
//     },
//     {
//         value: "astro",
//         label: "Astro",
//     },
// ];

// export function Searchbar() {
//     const [open, setOpen] = useState(false);
//     const [value, setValue] = useState("");

//     const [searchQuery, setSearchQuery] = useState("");
//     const [selectedTags, setSelectedTags] = useState([]);
//     const [suggestedTags, setSuggestedTags] = useState([
//         "react",
//         "javascript",
//         "tailwind",
//         "shadcn",
//         "ui",
//         "design",
//         "development",
//         "frontend",
//         "backend",
//         "fullstack",
//     ]);
//     const handleSearch = (e) => {
//         setSearchQuery(e.target.value);
//         const filteredTags = suggestedTags.filter((tag) =>
//             tag.toLowerCase().includes(e.target.value.toLowerCase())
//         );
//         setSuggestedTags(filteredTags);
//     };
//     const handleTagSelect = (tag) => {
//         setSelectedTags([...selectedTags, tag]);
//         setSearchQuery("");
//         setSuggestedTags(suggestedTags.filter((t) => t !== tag));
//     };
//     const handleTagRemove = (tag) => {
//         setSelectedTags(selectedTags.filter((t) => t !== tag));
//         setSuggestedTags([...suggestedTags, tag].sort());
//     };

//     return (
//         <Popover open={open} onOpenChange={setOpen}>
//             <PopoverTrigger asChild>
//                 <Button
//                     variant="outline"
//                     role="combobox"
//                     aria-expanded={open}
//                     className="w-[200px] justify-between"
//                 >
//                     {value
//                         ? frameworks.find(
//                               (framework) => framework.value === value
//                           )?.label
//                         : "Select framework..."}
//                     <MagnifyingGlassIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                 </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-[200px] p-0">
//                 <Command>
//                     <CommandInput placeholder="Search framework..." />
//                     <CommandEmpty>No framework found.</CommandEmpty>
//                     <CommandList>
//                         <CommandGroup>
//                             {frameworks.map((framework) => (
//                                 <CommandItem
//                                     key={framework.value}
//                                     value={framework.value}
//                                     onSelect={(currentValue) => {
//                                         setValue(
//                                             currentValue === value
//                                                 ? ""
//                                                 : currentValue
//                                         );
//                                         setOpen(false);
//                                     }}
//                                 >
//                                     <CheckIcon
//                                         className={cn(
//                                             "mr-2 h-4 w-4",
//                                             value === framework.value
//                                                 ? "opacity-100"
//                                                 : "opacity-0"
//                                         )}
//                                     />
//                                     {framework.label}
//                                 </CommandItem>
//                             ))}
//                         </CommandGroup>
//                     </CommandList>
//                 </Command>
//             </PopoverContent>
//         </Popover>
//     );
// }

// "use client";

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//     Command,
//     CommandDialog,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
//     CommandSeparator,
//     CommandShortcut,
// } from "@/components/ui/command";

// import { Popover } from "@radix-ui/react-popover";

// export function Searchbar() {
//     const [searchQuery, setSearchQuery] = useState("");
//     const [selectedTags, setSelectedTags] = useState([]);
//     const [suggestedTags, setSuggestedTags] = useState([
//         "react",
//         "javascript",
//         "tailwind",
//         "shadcn",
//         "ui",
//         "design",
//         "development",
//         "frontend",
//         "backend",
//         "fullstack",
//     ]);
//     const handleSearch = (e) => {
//         setSearchQuery(e.target.value);
//         const filteredTags = suggestedTags.filter((tag) =>
//             tag.toLowerCase().includes(e.target.value.toLowerCase())
//         );
//         setSuggestedTags(filteredTags);
//     };
//     const handleTagSelect = (tag) => {
//         setSelectedTags([...selectedTags, tag]);
//         setSearchQuery("");
//         setSuggestedTags(suggestedTags.filter((t) => t !== tag));
//     };
//     const handleTagRemove = (tag) => {
//         setSelectedTags(selectedTags.filter((t) => t !== tag));
//         setSuggestedTags([...suggestedTags, tag].sort());
//     };
//     return (
//         <div className="w-full max-w-md">
//             <div className="relative">
//                 <Input
//                     type="text"
//                     placeholder="Filter tags..."
//                     value={searchQuery}
//                     onChange={handleSearch}
//                     className="pr-10"
//                 />
//                 {suggestedTags.length > 0 && (
//                     <div className="absolute top-full left-0 w-full bg-background border rounded-md shadow-lg z-10 mt-1">
//                         <ul className="py-1">
//                             {suggestedTags.map((tag) => (
//                                 <li
//                                     key={tag}
//                                     className="px-4 py-2 hover:bg-muted cursor-pointer"
//                                     onClick={() => handleTagSelect(tag)}
//                                 >
//                                     {tag}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}
//                 <Button
//                     type="button"
//                     size="icon"
//                     variant="ghost"
//                     className="absolute right-2 top-1/2 -translate-y-1/2"
//                 >
//                     <SearchIcon className="w-5 h-5" />
//                 </Button>
//             </div>
//             <div className="mt-4">
//                 <div className="flex flex-wrap gap-2">
//                     {selectedTags.map((tag) => (
//                         <div
//                             key={tag}
//                             className="bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-2"
//                         >
//                             <span>{tag}</span>
//                             <Button
//                                 type="button"
//                                 size="icon"
//                                 variant="ghost"
//                                 className="text-primary-foreground/80 hover:text-primary-foreground"
//                                 onClick={() => handleTagRemove(tag)}
//                             >
//                                 <XIcon className="w-4 h-4" />
//                             </Button>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// function SearchIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <circle cx="11" cy="11" r="8" />
//             <path d="m21 21-4.3-4.3" />
//         </svg>
//     );
// }

// function XIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M18 6 6 18" />
//             <path d="m6 6 12 12" />
//         </svg>
//     );
// }
