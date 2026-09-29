// Every in-app path is built here so links and redirects cannot drift apart.

export const HOME_PATH = "/";
export const PROFILES_PATH = "/profiles";

export function subjectPath(subjectId: string): string {
  return `/subjects/${encodeURIComponent(subjectId)}`;
}

export function lessonPath(lessonId: string): string {
  return `/lessons/${encodeURIComponent(lessonId)}`;
}
