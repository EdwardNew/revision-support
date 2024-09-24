import { LoaderCircle } from "lucide-react";

type PDFPanelProps = {
    paperPdfUrl: string | null;
};

export default function PDFPanel({ paperPdfUrl }: PDFPanelProps) {
    return (
        <div className="flex flex-col h-full">
            <div className=" text-secondary-foreground px-4 py-3 font-medium rounded-t-lg">
                PDF Viewer
            </div>
            <div className="h-full flex items-center justify-center">
                {paperPdfUrl ? (
                    <iframe src={paperPdfUrl} className="w-full h-full" />
                ) : (
                    <LoaderCircle className="animate-spin h-10 w-10 text-gray-400" />
                )}
            </div>
        </div>
    );
}
