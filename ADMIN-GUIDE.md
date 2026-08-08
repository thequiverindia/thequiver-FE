# TheQuiverIndia — Admin Panel Guide

Everything on the website is managed from **https://thequiverindia.com/admin**.
No code, no deploys. You edit here, the site updates within seconds.

---

## 1. Signing in

1. Go to **https://thequiverindia.com/admin**
2. Enter your email and password.

**Important:** always type the address **without `www`**. `www.thequiverindia.com`
is not set up and will show a security warning. Bookmark the correct address on
your phone so autocomplete doesn't add `www` for you.

Forgot your password? Ask another admin to reset it in **Users**.

### Two different logins — don't mix them up

| | Who | Where |
|---|---|---|
| **Admin login** (email + password) | You, the editors | `/admin` |
| **Reader login** (Google) | The public | `/login` |

They are separate systems. Signing in with Google on the main site does **not**
sign you into the admin panel.

---

## 2. The layout

The left sidebar lists every content type. The ones you'll use daily are at the top:

- **Articles** — all news stories
- **Fact Checks** — verified/false claim ratings
- **Videos** — YouTube videos
- **Authors**, **Categories**, **Tags** — the things articles are tagged with
- **Leaders**, **Parties** — the politician and party database
- **Polls** — reader polls
- **Comments** — reader comments awaiting approval
- **Submissions** — messages from the contact / advertise forms
- **Media** — every uploaded image
- **Users** — admin accounts
- **Settings** — site-wide values (see §9)

On a phone, tap the ☰ icon in the top-left to open this sidebar.

---

## 3. Publishing an article — step by step

**Articles → Create New**

### Required fields

| Field | What to put |
|---|---|
| **Title** | The headline. Keep it under ~70 characters so it isn't cut off in Google. |
| **Slug** | Auto-fills from the title. This becomes the URL: `/article/your-slug`. |
| **Language** | `English` or `Hindi`. Controls which version of the site the story appears on. |
| **Category** | Pick one. This decides which section page it lands on. |
| **Author** | Pick from Authors. Create the author first if they're new. |
| **Hero image** | See §5 for the image rules. |
| **Excerpt** | 1–2 sentences. Used on cards and in Google results. |
| **Body** | The story itself. |

### Optional but worth doing

- **Tags** — helps readers find related stories.
- **Leaders / Parties mentioned** — links the story into the leader profile pages.
- **Related articles** — if you leave this empty the site picks related stories
  automatically by category and tag, so you only need it for special cases.
- **Translation of** — if this is the Hindi version of an English story (or vice
  versa), point it at the other one. Readers then get a language-switch link.

### Draft vs Published

At the bottom there is a **status** control.

- **Save as draft** — nobody can see it. Safe to leave half-finished.
- **Publish** — live on the website immediately.

A draft is genuinely invisible: it won't show on section pages, in search, in
sitemaps, or on a direct link. Use drafts freely.

### Unpublishing

Open the article, switch the status back to draft, save. It disappears from the
site within seconds. Deleting also works, but unpublishing is reversible — prefer it.

---

## 4. How the site updates

The website caches pages so it loads fast. When you save, the affected pages are
refreshed automatically. Expect the change to appear **within a few seconds**.

If you don't see it:

1. Hard-refresh the page (pull down to refresh on mobile).
2. Confirm the status is **Published**, not draft.
3. Check the **Language** — an English article won't appear on the Hindi site.

---

## 5. Images — please read this bit

Images are the most common source of problems, so the rules are strict on purpose.

### Allowed formats

**JPG, PNG, WebP, AVIF, GIF.**

**SVG is blocked** and always will be — it can carry scripts, and the image
optimiser refuses to render it. (Every broken avatar on the site was an SVG.)

### Recommended size

- **Hero images:** around **1600 px wide**. Anything wider is wasted.
- **File size:** aim for **under 1 MB**.

The system automatically generates three smaller copies of every upload
(320 px, 768 px, 1600 px) and serves whichever fits the reader's screen. You do
not need to make multiple versions yourself.

If your original is smaller than 1600 px, the larger copies simply aren't
generated and the site falls back to the original. That's normal, not a bug.

### Uploading from a phone

Photos straight from a phone camera are often 4–12 MB. These now upload directly
to storage rather than through the website, so large files work — but they are
still slow on a weak connection and wasteful for readers. **Resize before
uploading when you can.**

### Alt text is required

Every image needs an **Alt** description — what the image actually shows. It's
required because screen readers and Google both depend on it. Write what you'd
say describing the photo over the phone. "photo1.jpg" is not alt text.

### Replacing an image

Upload a **new** Media item and re-point the article at it. Overwriting an
existing file can leave the old version cached.

---

## 6. Fact Checks

**Fact Checks → Create New**. Same flow as articles, plus:

- **Claim** — the exact claim being checked, quoted.
- **Rating** — True / Mostly True / Misleading / False. This drives the coloured
  badge readers see, so pick carefully.
- **Evidence / sources** — always fill this in. A fact check without sources
  damages trust more than publishing nothing.

Fact checks can be linked from an article via the article's **Fact check** field.

---

## 7. Videos

Videos are pulled from the YouTube channel automatically on a schedule. You
normally don't need to touch this collection.

To feature one manually, open it and set the feature flag. To hide one, delete it
— but note it may return on the next sync if it's still on the channel.

---

## 8. Comments and Submissions

### Comments

Reader comments are **held for moderation** — nothing appears publicly until you
approve it.

**Comments** → open one → set status to **Approved** or **Rejected**. Approved
comments show on the article immediately.

### Submissions

Everything sent through the contact, story-tip, correction and advertising forms
lands in **Submissions**. Nothing is emailed anywhere, so **this list is the only
place these messages exist — check it regularly.**

Each entry shows the type, the sender's details and the message. Mark it handled
when you've dealt with it.

---

## 9. Settings

**Settings** (a single record, not a list) holds site-wide values: contact
details, social links, and similar. Edit and save — it applies everywhere on the
site at once. Use this instead of asking for a code change.

---

## 10. Users — admin accounts

**Users → Create New** to add an editor. Set a role:

- **Admin** — full access, including creating and deleting other users.
- **Editor** — can create and edit content, cannot manage users.

Rules enforced by the system:

- Only an admin can create, delete, or change anyone's role — including their own.
- Everyone else can only see and edit their own account.

Never share one login between people. Individual accounts mean the edit history
is meaningful.

---

## 11. Using the panel on a phone

The admin panel works on a phone. A few things to know:

- Tap ☰ (top-left) for the sidebar.
- The rich-text toolbar scrolls sideways — swipe it to reach more options.
- **Save often.** Mobile browsers discard background tabs, and an unsaved form
  is lost when that happens.
- If a page looks stuck, pull down to refresh — you stay signed in.
- Again: **no `www`** in the address.

For writing a full article, a laptop is genuinely faster. Phones are best for
quick edits, approving comments, and checking submissions.

---

## 12. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Security warning, page won't open | You're on `www.thequiverindia.com`. Drop the `www`. |
| "Invalid credentials" | Wrong email or password. Ask an admin to reset it — there is no self-serve reset email. |
| Signed out unexpectedly | Session expired. Sign in again; nothing is lost except an unsaved form. |
| Upload fails | Check the format (no SVG). If it still fails, the file is likely very large — resize and retry. |
| Image doesn't appear on the site | Confirm the article is Published and the image field is actually filled. |
| Article not on the section page | Wrong Category, wrong Language, or still a draft. |
| Change not visible | Wait a few seconds and hard-refresh. If it persists after a minute, flag it. |
| Can't save — a field is red | A required field is empty. Scroll up; the panel marks it. |

---

## 13. Quick daily checklist

- [ ] **Comments** — approve or reject the queue
- [ ] **Submissions** — read new tips, corrections and enquiries
- [ ] **Articles** — anything sitting in draft that should be live?
- [ ] Spot-check the homepage on a phone
