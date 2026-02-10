import { cloudinary } from "@config/cloudinary.config";
import { ApiError } from "@utils/errorsHandlers/ApiError.handler";
import type { UploadApiResponse } from "cloudinary";

export class UploadService {
    async uploadToCloudnairy(file: any): Promise<UploadApiResponse> {
        if (!file || !file.buffer) {
            throw new ApiError("No file provided", 400);
        }

        try {

            const b64 = Buffer.from(file.buffer).toString("base64");
            const dataURI = `data:${file.mimetype};base64,${b64}`;

            const result = await cloudinary.uploader.upload(dataURI, {
                folder: "app_uploads",
                resource_type: "auto",
            });

            return result;
        } catch (error: any) {
            console.error("Cloudinary Direct Upload Error:", error);

            throw new ApiError(`Cloudinary: ${error.message}`, 500);
        }
    }
}

export default new UploadService();