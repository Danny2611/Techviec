// // src/types/soft-delete-plugin-mongoose.d.ts
// declare module 'soft-delete-plugin-mongoose' {
//   import { Model, Document, Schema } from 'mongoose';

//   // Đây là function (plugin), không phải type
//   export function softDeletePlugin(schema: Schema): void;

//   // Đây là interface để dùng làm type cho Model
//   export interface SoftDeleteModel<T extends Document> extends Model<T> {
//     softDelete(filter: any): Promise<any>;
//     restore(filter: any): Promise<any>;
//   }
// }
