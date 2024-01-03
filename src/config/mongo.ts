import { connect } from "mongoose";

export default async () => await connect(process.env.DATABASE_URL);
