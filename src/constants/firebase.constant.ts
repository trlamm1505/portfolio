export const FB_BASE = `/uploads/`;

export const FB_FOLDER_PROJECT = `project`;
export const FB_FOLDER_LOGO = `logo`;
export const FB_FOLDER_SKILL = `skill`;

export const getMediaUrl = (folder: string, fileName: string): string => {
   if (!fileName) return "";
   if (
      fileName.startsWith("http://") ||
      fileName.startsWith("https://") ||
      fileName.startsWith("data:") ||
      fileName.startsWith("/")
   ) {
      return fileName;
   }
   return `/uploads/${folder}/${fileName}`;
};
