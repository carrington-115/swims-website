"use server";

import type { NewsletterState } from "@/components/sections/newsletter-form";
import { contactEmail } from "@/lib/navigation";

/**
 * Records a newsletter signup.
 *
 * There is no subscribe endpoint on `blogs-api` yet, so this posts to whatever
 * `NEWSLETTER_ENDPOINT` names and, when that is unset, tells the visitor how to
 * reach us instead of silently pretending to have signed them up. Point the
 * variable at the real list and the form works unchanged.
 */
export async function subscribeToNewsletter(
  _state: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }

  const endpoint = process.env.NEWSLETTER_ENDPOINT;
  if (!endpoint) {
    return {
      status: "error",
      message: `Signup is not connected yet -- email ${contactEmail} and we will add you.`,
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error(`Subscribe failed: ${response.status}`);
  } catch {
    return {
      status: "error",
      message: "Something went wrong. Please try again in a moment.",
    };
  }

  return { status: "success", message: "You are on the list. Watch your inbox." };
}
