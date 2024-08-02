import OpenAI from "openai";

const openai = new OpenAI();

export async function GET() {
    const rawText = await fetch("http://localhost:3000/parse_pdf");

    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content:
                    "Given the following text extracted from a peer review of an academic paper, identify actionable issues that the author of the paper can address formatted as a json object with each actionable item being a seperate field",
            },
            {
                role: "user",
                content: `Here are the reviews: 
                    Summary Of The Paper:
The paper proposes a novel framework for semi-supervised learning, that solves two issues of previous methods: 1) over-reliance on labeled data and 2) error accumulation. It shows that jointly solving the main task together with another task (that discriminates whether the data label is real or not) leads to better performance.

Main Review:
Strengths

The proposed framework seems to be novel.
It works well in experiments, on a wide range of tasks (classification, label propagation, and data imputation).
It seems to be potentially beneficial for many domains, since it does not have domain-restrictions, while many previous SSL methods rely on certain image domain techniques such as consistency regularization (and data augmentation).
Weaknesses

Since the proposed method is only compared with the original pseudo-label method, comparing with other extensions of pseudo-labelling methods that are mentioned in Section 5 will make the contributions more clear.
In addition to the papers mentioned in Section 5, there are a few papers that try to address the error accumulation in semi-supervised learning methods that is observed in pseudo-labelling. For example: "In Defense of Pseudo-Labeling: An Uncertainty-Aware Pseudo-label Selection Framework for Semi-Supervised Learning" from ICLR 2021 and "Repetitive Reprediction Deep Decipher for Semi-Supervised Learning" from AAAI2020.
Questions

I am not sure if I understood the experiments correctly. As the missing rate goes higher, do we have more unlabeled samples (as explained in the last paragraph of page 6), or do we have more noisy-labelled samples (as explained in 1st paragraph of Section 4.1)?
Can we show the 3rd task (data imputation) in Figures 2 to 4?
One of the benefits of the method seems to be that it can be incorporated into a wide range of SSL algorithms. I think the paper demonstrated that it can be used to enhance pseudo-labelling method, but what kind of other SSL algorithms can SCL incorporate?
Minor questions and comments

SSL is a very hot topic and there has recently been many advances. Since the experiments do not compare with many of the recent works, it would be better to emphasize why they were not compared. (For example, Section 1 has a discussion on how recent SSL methods utilize consistency regularization, which relies on heavy data augmentation techniques that is only available in certain domains.)
What kind of value for parameter alpha is used in the image classification? (For the other two tasks, I think the appendix explains that alpha is 1).
If we are given a labeled dataset L and unlabeled dataset U, it seems we can automatically construct vector M (which is explained in end of page 2). If this is correct, then why do we need M as an input in Algorithm 1 in page 6?
What is P introduced in the beginning of Section 2.2? It seems like it is a set from the 
 notation but since it compares with M in the loss function, it also looks like a vector.
typo "perforamnce" in page 6
Should 
 in the beginning of page 3 be 
?
Is 
 a label space (
), or is it the full set of labels in the training dataset (
)?
Ideally it would be better to perform several trials and report mean/standard error in Table 1.
=========== after rebuttal

Thank you for answering my questions. The additional experiments are helpful to have a better understanding about the proposed method. It looks like the advatangeous points of the proposed method is now about the low computational costs, according to the new experiments including UPS, rather than better performance. Although this still may be beneficial for the research community, it seems to be slightly less significant and also may affect the storyline. I would like to also recommend to put the new experiments with UPS in the main paper instead of the appendix.

Summary Of The Review:
The proposed method seems to have some nice benefits, but I feel there are a few weaknesses that should be addressed. I also have a few questions and it would be helpful if the authors can take a look at the previous section (main review).

Correctness: 3: Some of the paper’s claims have minor issues. A few statements are not well-supported, or require small changes to be made correct.
Technical Novelty And Significance: 3: The contributions are significant and somewhat new. Aspects of the contributions exist in prior work.
Empirical Novelty And Significance: 3: The contributions are significant and somewhat new. Aspects of the contributions exist in prior work.
Flag For Ethics Review: NO.
Recommendation: 5: marginally below the acceptance threshold
Confidence: 3: You are fairly confident in your assessment. It is possible that you did not understand some parts of the submission or that you are unfamiliar with some pieces of related work. Math/other details were not carefully checked.
                `,
            },
        ],
        model: "gpt-4o-mini",
    });

    let res = JSON.stringify(completion);

    return new Response(res);
}
