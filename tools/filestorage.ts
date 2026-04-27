import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "filestorage",
   serverVersion: "1.1.0",
   description: "Allow your agents & Sidekick to save/retrieve files on our cloud storage",
} as const;

/**
 * The type of the input parameter for uploadFile tool.
 */
export type uploadFileParams = {
  // The file content. For binary files, provide base64-encoded content and set isBase64 to true. For text files, provide plain text. Either content or sourceUrl must be provided.
  content?: string,
  // If true, the file requires user authentication to access. Default: false (public, world-readable).
  private?: boolean,
  // The file name with extension (e.g., 'report.pdf', 'data.csv', 'image.png'). Will be sanitized to remove unsafe characters.
  fileName: string,
  // Set to true if content is base64-encoded (required for binary files like images, PDFs). Default: false. Ignored if sourceUrl is provided.
  isBase64?: boolean,
  // The MIME type of the file (e.g., 'text/csv', 'application/pdf', 'image/png'). If not provided, will be inferred from file extension or sourceUrl response.
  mimeType?: string,
  // URL to fetch the file content from. The file will be downloaded and stored. Use this for images or files from other tools/services. Either content or sourceUrl must be provided.
  sourceUrl?: string
}

/**
 * The type of the output of the uploadFile tool.
 */
export type uploadFileOutput = {
  // Public files: permanent URL. Private files: time-limited URL (10min) - call getFile for fresh URL.
  url?: string,
  error?: {
    type: string,
    message: string
  },
  // Unique identifier for this file. Use with getFile/deleteFile for exact matching.
  fileKey?: string,
  success: boolean,
  fileName?: string,
  mimeType?: string
}

/**
 * Upload a file to cloud storage. Files are public (world-readable) by default. Set private=true for files that require user authentication to access. Files are stored in the calling agent's directory. Sidekick can upload to the _sidekick directory.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function uploadFile(
  sdk: ServerSdk,
  params: uploadFileParams
): Promise<uploadFileOutput> {
  return await sdk.callTool("filestorage/1.1.0/uploadFile", params) as uploadFileOutput;
}

/**
 * The type of the input parameter for listFiles tool.
 */
export type listFilesParams = {
  // Optional: Filter files by path (includes directory and filename). Files whose path contains this string (case-insensitive) will be returned. Useful for searching when there are many files.
  search?: string,
  // Optional: List files from a specific agent's directory (by vanityId or name). Only Sidekick can list other agents' files. Omit to list your own files.
  agentDirectory?: string
}

/**
 * The type of the output of the listFiles tool.
 */
export type listFilesOutput = {
  error?: {
    type: string,
    message: string
  },
  files?: Array<{
    url: string,
    size: number,
    fileKey: string,
    fileName: string,
    mimeType: string,
    isPrivate: boolean
  }>,
  // True if there are more files beyond the returned limit
  hasMore?: boolean,
  success: boolean,
  // Total number of files (before limiting)
  totalCount?: number
}

/**
 * List files in cloud storage. By default, lists only files uploaded by this agent. Sidekick can list all files or files from a specific agent directory. Returns up to 20 files. Use 'search' to filter files by name. URLs are automatically generated based on file visibility (public or private).
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function listFiles(
  sdk: ServerSdk,
  params: listFilesParams
): Promise<listFilesOutput> {
  return await sdk.callTool("filestorage/1.1.0/listFiles", params) as listFilesOutput;
}

/**
 * The type of the input parameter for getFile tool.
 */
export type getFileParams = {
  // The unique file key (from uploadFile/listFiles). Preferred method for exact match.
  fileKey?: string,
  // The file name to retrieve (backwards compatible). For files in your own directory, just provide the file name. For files in other agent directories (Sidekick only), use format: agentDirectory/fileName. If both public and private versions exist with the same name, returns the public one.
  fileName?: string
}

/**
 * The type of the output of the getFile tool.
 */
export type getFileOutput = {
  // Access URL for the file. For private files, this is a fresh time-limited URL (10min).
  url?: string,
  error?: {
    type: string,
    message: string
  },
  // Unique identifier for this file.
  fileKey?: string,
  success: boolean,
  fileName?: string,
  mimeType?: string,
  // True if this is a private file.
  isPrivate?: boolean
}

/**
 * Get a file from cloud storage. For private files, this returns a fresh time-limited URL (10min). Use fileKey (preferred) for exact match or fileName for backwards compatibility. Returns a fresh access URL - essential for private files whose URLs expire.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function getFile(
  sdk: ServerSdk,
  params: getFileParams
): Promise<getFileOutput> {
  return await sdk.callTool("filestorage/1.1.0/getFile", params) as getFileOutput;
}

/**
 * The type of the input parameter for deleteFile tool.
 */
export type deleteFileParams = {
  // The unique file key (from uploadFile/listFiles).
  fileKey?: string,
  // The file name to delete. For files in your own directory, just provide the file name. For files in other agent directories (Sidekick only), use format: agentDirectory/fileName
  fileName?: string
}

/**
 * The type of the output of the deleteFile tool.
 */
export type deleteFileOutput = {
  error?: {
    type: string,
    message: string
  },
  success: boolean
}

/**
 * Delete a file from cloud storage. Use fileKey (preferred) or fileName. Agents can only delete files in their own directory. Sidekick can delete files from any directory.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function deleteFile(
  sdk: ServerSdk,
  params: deleteFileParams
): Promise<deleteFileOutput> {
  return await sdk.callTool("filestorage/1.1.0/deleteFile", params) as deleteFileOutput;
}


