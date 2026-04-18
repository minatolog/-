# Testing

Frontend tests are implemented with `Vitest` and `Testing Library`.

Run the tests from the `frontend` directory:

```bash
npm run test -- --run
```

The current automated tests are in [frontend/src/App.test.tsx](/Users/luogewen/PycharmProjects/presto/frontend/src/App.test.tsx).

Test coverage includes:

- Unauthenticated users see the landing page.
- A user can register and land on the dashboard.
- Happy path: a user can register, create a presentation, add and switch slides, delete the presentation, logout, and login again.
- A second path: a user can create a presentation, add a text element, edit the text element, and delete the text element.

Rationale for the second test:

- It is meaningfully different from the happy path because it focuses on slide element interactions instead of authentication and presentation lifecycle only.
- It covers one of the core editor workflows required by the assignment: creating, editing, and deleting content inside a slide.
- I chose the text element flow because it exercises the main editor behaviours in a stable and deterministic way: button click, double click edit, form save, and right click delete.
