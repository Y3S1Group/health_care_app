import { Schema, model, Document } from 'mongoose';

export interface ICounterDocument extends Document {
  name: string;
  seq: number;
}

const CounterSchema = new Schema<ICounterDocument>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

export const CounterModel = model<ICounterDocument>('Counter', CounterSchema);