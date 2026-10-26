/**
 * Submits a form to Netlify Forms (https://docs.netlify.com/forms/setup/).
 * The form must also exist as static HTML in index.html so Netlify detects it at deploy time.
 * Submissions appear in the Netlify dashboard and can be emailed to the studio.
 *
 * During local development there is no Netlify to receive the post, so nothing is sent
 * and `sent: false` is returned — the UI can say so instead of pretending.
 */
export async function submitNetlifyForm(formName: string, fields: Record<string, string>): Promise<{ sent: boolean }> {
  if (import.meta.env.DEV) {
    console.info(`[dev] Netlify form "${formName}" not sent:`, fields);
    return { sent: false };
  }

  const body = new URLSearchParams({ 'form-name': formName, ...fields }).toString();
  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!response.ok) throw new Error(`Form submission failed (${response.status})`);
  return { sent: true };
}
