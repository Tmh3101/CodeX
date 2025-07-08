/**
 * Utility functions for file operations, such as uploading files to Supabase storage.
 */

const supabase = require("../utils/supabaseClient");

/**
 * Uploads a file to Supabase storage.
 * @param {Object} file - The file object containing the file data.
 * @param {string} bucketName - The name of the Supabase storage bucket to upload the file to.
 * @returns {Promise<Object>} - The response data from Supabase storage..
 */
const uploadFileToSupabase = async (bucketName, file, fileName) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) {
    console.error("Supabase storage error:", error);
    throw new Error(`Supabase upload error: ${error.message}`);
  }

  return data;
};

/**
 * Deletes a file from Supabase storage.
 * @param {string} bucketName - The name of the Supabase storage bucket.
 * @param {string} fileName - The name of the file to delete.
 * @returns {Promise<void>} - Resolves when the file is deleted.
 */
const deleteFileFromSupabase = async (bucketName, fileName) => {
  const { error } = await supabase.storage.from(bucketName).remove([fileName]);

  if (error) {
    console.error("Error deleting file from Supabase storage:", error);
    throw new Error(`Supabase delete error: ${error.message}`);
  }
  console.log(
    `File ${fileName} deleted successfully from ${bucketName} bucket.`
  );
};

/**
 * Gets the public URL of a file stored in Supabase storage.
 * @param {string} bucketName - The name of the Supabase storage bucket.
 * @param {string} fileName - The name of the file in the storage bucket.
 * @returns {string} - The public URL of the file.
 */
const getPublicUrl = (bucketName, fileName) => {
  try {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return data.publicUrl;
  } catch (error) {
    console.error("Error getting public URL from Supabase storage:", error);
    throw new Error(`Supabase get public URL error: ${error.message}`);
  }
};

module.exports = {
  uploadFileToSupabase,
  deleteFileFromSupabase,
  getPublicUrl,
};
