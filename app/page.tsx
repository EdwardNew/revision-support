import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function Component() {
    return (
        <div className="flex h-screen">
            <ResizablePanelGroup
                direction="horizontal"
                className="w-full border rounded-lg"
            >
                <ResizablePanel defaultSize={25}>
                    <div className="flex flex-col h-full">
                        <div className="bg-primary text-primary-foreground px-4 py-3 font-medium rounded-t-lg">
                            PDF Viewer
                        </div>
                        <div className="flex-1 p-4 overflow-auto">
                            <object
                                data="/example.pdf"
                                type="application/pdf"
                                width="100%"
                                height="100%"
                            >
                                <p>
                                    It appears your web browser doesn't have a
                                    PDF viewer. You can{" "}
                                    <a
                                        href="#"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        download the PDF
                                    </a>
                                    to view it.
                                </p>
                            </object>
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={25}>
                    <div className="flex flex-col h-full">
                        <div className="bg-secondary text-secondary-foreground px-4 py-3 font-medium rounded-t-lg">
                            Reviews
                        </div>
                        <div className="flex-1 p-4 overflow-auto">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                Filter{" "}
                                                <ChevronDownIcon className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuLabel>
                                                Filter by
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuCheckboxItem checked>
                                                All
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem>
                                                Positive
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem>
                                                Negative
                                            </DropdownMenuCheckboxItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                            Verified
                                        </Badge>
                                        <Badge variant="outline">Helpful</Badge>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                        Sort{" "}
                                        <ChevronDownIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="grid gap-4">
                                <Card>
                                    <CardContent>
                                        <h3 className="text-lg font-medium">
                                            Great product!
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            I love this product. It's well-made
                                            and looks great. Highly recommend!
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline">
                                                Verified
                                            </Badge>
                                            <Badge variant="outline">
                                                Helpful
                                            </Badge>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="text-xs text-muted-foreground">
                                        Reviewed by John Doe on 2023-07-01
                                    </CardFooter>
                                </Card>
                                <Card>
                                    <CardContent>
                                        <h3 className="text-lg font-medium">
                                            Excellent quality
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            I'm really impressed with the
                                            quality of this product. It exceeded
                                            my expectations.
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline">
                                                Verified
                                            </Badge>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="text-xs text-muted-foreground">
                                        Reviewed by Jane Smith on 2023-06-15
                                    </CardFooter>
                                </Card>
                                <Card>
                                    <CardContent>
                                        <h3 className="text-lg font-medium">
                                            Disappointed
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            I'm not happy with this product. It
                                            didn't meet my expectations and the
                                            quality is poor.
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline">
                                                Verified
                                            </Badge>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="text-xs text-muted-foreground">
                                        Reviewed by Michael Johnson on
                                        2023-05-20
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={25}>
                    <div className="flex flex-col h-full">
                        <div className="bg-muted text-muted-foreground px-4 py-3 font-medium rounded-t-lg">
                            Response
                        </div>
                        <div className="flex-1 p-4 overflow-auto">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">Tag 1</Badge>
                                    <Badge variant="outline">Tag 2</Badge>
                                    <Badge variant="outline">Tag 3</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        Author 1
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        Author 2
                                    </span>
                                </div>
                            </div>
                            <Textarea
                                placeholder="Type your response here..."
                                className="w-full min-h-[100px] rounded-md border border-input bg-background p-2 text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <div className="flex justify-end mt-4">
                                <Button>Save</Button>
                            </div>
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={25}>
                    <div className="flex flex-col h-full">
                        <div className="bg-card text-card-foreground px-4 py-3 font-medium rounded-t-lg">
                            Outline
                        </div>
                        <div className="flex-1 p-4 overflow-auto">
                            <div className="grid gap-4">
                                <Card className="border border-muted">
                                    <CardContent className="cursor-move">
                                        <h3 className="text-lg font-medium">
                                            Draggable Card 1
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            This is the first draggable card.
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="border border-muted">
                                    <CardContent>
                                        <h3 className="text-lg font-medium">
                                            Draggable Card 2
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            This is the second draggable card.
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="border border-muted">
                                    <CardContent>
                                        <h3 className="text-lg font-medium">
                                            Draggable Card 3
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            This is the third draggable card.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}

function ChevronDownIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

function XIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}
