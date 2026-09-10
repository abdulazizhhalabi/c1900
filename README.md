# Charter1900

A study site for the Level I CFA exam, named for 1900, the highest scaled score a candidate can receive. Short form and domain: C1900. Notes for all ten topics plus practice questions with explanations. Progress is saved in the browser, nothing is sent anywhere.

Live at https://charter1900.com

## Stack

Astro, React islands for the quiz and progress tracking, Tailwind CSS, TypeScript. Content lives in `src/content` as Markdown (materials) and JSON (questions).

## Running locally

```bash
npm install
npm run dev
```

Every push to `main` builds and deploys the site through GitHub Actions.
