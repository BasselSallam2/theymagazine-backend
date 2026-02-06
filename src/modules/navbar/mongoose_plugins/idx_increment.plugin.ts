import type { Model, Schema } from "mongoose";
import type { INAVBAR } from "../navbar.interface";

export function idxIncrementPlugin(schema: Schema) {
    
    schema.pre('save', async function(next) {
    
        if (!this.isNew) {
            return next();
        }
    
        try {
    
            const Model = this.constructor as Model<INAVBAR>;
    
            const lastDoc = await Model.findOne().sort({ idx: -1 });
    
            if (lastDoc) {
    
                this.idx = lastDoc.idx + 1;
            } else {
    
                this.idx = 1;
            }
    
            next(); 
        } catch (err: any) {
            next(err); 
        }
    });
}