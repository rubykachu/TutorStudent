// Every in-app path is built here so links and redirects cannot drift apart.

export const HOME_PATH = "/";
export const PROFILES_PATH = "/profiles";

export function subjectPath(subjectId: string): string {
  return `/subjects/${encodeURIComponent(subjectId)}`;
}

export function lessonPath(lessonId: string): string {
  return `/lessons/${encodeURIComponent(lessonId)}`;
}

// The lesson page opened on its introduction ("Giới thiệu bài"), wherever the
// child has been before.
export function introPath(lessonId: string): string {
  return `${lessonPath(lessonId)}?${INTRO_PARAM}=1`;
}

export const INTRO_PARAM = "intro";

export function sectionPath(lessonId: string, sectionId: string): string {
  return `${lessonPath(lessonId)}/sections/${encodeURIComponent(sectionId)}`;
}

export function reviewPath(lessonId: string): string {
  return `${lessonPath(lessonId)}/review`;
}

export const PARENT_PATH = "/parent";
