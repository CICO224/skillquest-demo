# SKILLQuest

Parents turn chores into quests. Teens (8–15) earn **Points** by sending one photo as proof, then spend them on real-life rewards that parents hand over themselves.

Built with Vite, React, TypeScript, Tailwind CSS v4 and Lucide icons, with an Apple-style look.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## Pages

| Route | Who | Layout |
|---|---|---|
| `#/` | Everyone | Landing page |
| `#/parent` | Parent | Desktop dashboard: Quests, Review Proofs, Reward Delivery, Teen Progress |
| `#/teen` | Teen | Mobile app: Today's Quests, Reward Shop, My Claims |

Data lives in `localStorage` (prototype). Open the Parent and Teen views in two tabs and they stay in sync.
Use **Reset demo data** in the parent sidebar to start over.

See `SKILLQUEST_PROJECT_GUIDELINES.md` for the product rules this follows.
