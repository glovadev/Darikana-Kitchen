/**
 * Cloudinary image upload utility for Darikana Kitchen Admin Panel
 * Uses SHA-1 signing via Web Crypto API for secure direct browser-to-Cloudinary uploads
 */

const CLOUD_NAME = "bpi3s64e";
const API_KEY = "223898674186319";
const API_SECRET = "5a-GEF8ujc8zLzR_o0FtoNWt8ho";

/**
 * Computes SHA-1 hash of a string using browser's native Web Crypto API
 */
async function sha1(str: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
}

/**
 * Upload an image file directly to Cloudinary
 * Computes signature using API Key & Secret
 */
export async function uploadToCloudinary(
  file: File,
  folder = "darikana-dishes",
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Cloudinary signature parameters must be sorted alphabetically
  // We sign: folder=...&timestamp=...<API_SECRET>
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
  const signature = await sha1(paramsToSign);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", API_KEY);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            secure_url: response.secure_url,
            public_id: response.public_id,
            width: response.width,
            height: response.height,
            format: response.format
          });
        } catch (err) {
          reject(new Error("Failed to parse Cloudinary response"));
        }
      } else {
        try {
          const errResp = JSON.parse(xhr.responseText);
          reject(new Error(errResp?.error?.message || `Cloudinary upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during Cloudinary image upload. Please check your connection."));
    };

    xhr.send(formData);
  });
}
