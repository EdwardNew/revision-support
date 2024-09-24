import { Collection, MongoClient, ObjectId } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to the environment variables");
}

const uri = process.env.MONGODB_URI;
const options = {};
const databaseName = "revision_support";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

client = new MongoClient(uri, options);

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    clientPromise = client.connect();
}

async () => {
    await clientPromise;
};

const db = client.db(databaseName);

export interface UserDoc {
    _id: string;
    username: string;
    hashed_password: string;
    papers: Array<ObjectId>;
    treatment: "Full-AI" | "Half-AI" | "No-AI";
}

interface SessionDoc {
    _id: string;
    expires_at: Date;
    user_id: string;
}

interface PapersDoc {
    _id: ObjectId;
    issues_id: ObjectId;
    rebuttal_id: ObjectId;
    title: string;
    abstract: string;
    pdf: string;
    paper_id: string;
    reviews: Array<Object>;
}

export const usersCollection = db.collection("users") as Collection<UserDoc>;
export const sessionsCollection = db.collection(
    "sessions"
) as Collection<SessionDoc>;
export const papersCollection = db.collection(
    "papers"
) as Collection<PapersDoc>;
export const issuesCollection = db.collection("issues");
export const rebuttalsCollection = db.collection("rebuttals");

export async function getPaper(paper_id: string) {
    if (!ObjectId.isValid(paper_id)) {
        return { error: "Invalid Paper ID format" };
    }
    const items = await papersCollection.findOne({
        _id: new ObjectId(paper_id),
    });
    return items;
}

export async function getIssues() {}

export async function getRebuttals() {}
