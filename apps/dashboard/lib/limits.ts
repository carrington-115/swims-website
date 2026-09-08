/**
 * Limits shared between the form, the picker and the server action.
 *
 * A separate module because `app/(app)/actions.ts` carries `'use server'`, and
 * such a file may export nothing but async functions -- a plain `export const`
 * in it silently strips every export from the module, which surfaces at build
 * time as "The module has no exports at all".
 */

/** How many images one blog section may carry. */
export const MAX_SECTION_IMAGES = 5;
