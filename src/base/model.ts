import {
  Document,
  SchemaDefinition,
  Model,
  Schema,
  model as DbModel,
  Types,
} from "mongoose";

export interface BaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

export default abstract class BaseModel<T extends BaseDocument> {
  public model: Model<
    T,
    {},
    {},
    {},
    Document<unknown, {}, T> & T & { _id: Types.ObjectId },
    any
  >;
  protected modelSchema: SchemaDefinition<T>;

  private factory(
    collectionName: string,
    schemaDefinition: SchemaDefinition<T>,
    alias?: string
  ) {
    const schema = new Schema<T>(schemaDefinition, {
      timestamps: true,
      toJSON: { virtuals: true, getters: true },
      toObject: { virtuals: true, getters: true },
    });

    return DbModel<T>(collectionName, schema, alias);
  }

  constructor(
    collectionName: string,
    schemaDefinition: SchemaDefinition<T>,
    collectionAlias?: string
  ) {
    this.modelSchema = schemaDefinition;
    this.model = this.factory(
      collectionName,
      this.modelSchema,
      collectionAlias
    );
  }
}
