import { PaperContextProvider } from "@/components/context/PaperContextProvider";
import { papersCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type TestProps = {
    db_paper_id: ObjectId;
};

export default async function Test({ db_paper_id }: TestProps) {
    // const res = await papersCollection.findOne({
    //     _id: db_paper_id,
    // });
    // if (!res) {
    //     console.log("something went wrong");
    //     return;
    // }
    console.log("this is a server component");
    // console.log(res);
    // const { title, abstract, reviews, issues_id, rebuttal_id, pdf, paper_id } =
    //     res;

    return (
        <h1>test</h1>
        // <PaperContextProvider
        //     title={title}
        //     abstract={abstract}
        //     reviews={reviews}
        //     issues_id={issues_id}
        //     rebuttal_id={rebuttal_id}
        //     pdf={pdf}
        //     paper_id={paper_id}
        // >
        //     <h1>{title}</h1>
        // </PaperContextProvider>
    );
}
