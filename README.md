# Github Kanban Board

This project is a GitHub repository issues viewer implemented as a kanban board. Users can enter a repo URL in the input field on top of the page and press "Load" to fetch the issues from the specified repository using the GitHub API. The application contains three columns:

1. ToDo: All new issues.
2. In Progress: Opened issues with assignees.
3. Done: Closed issues.

Users can drag-n-drop issues between the columns to change their status. The application stores the current issue positions (column and order) between search and browser sessions. Additionally, users can visit the profile of the owner of the repository and navigate to the repository itself using links provided under the input field.

## Technologies Used

- React 18 with hooks
- Typescript
- State manager: Redux with Redux Toolkit
- UI library: Ant Design
- Testing: React Testing Library

## Getting Started

### Installation

1. Clone this repository.

```bash
git clone https://github.com/TaniaUdod/github-kanban-board.git
```

2. Install dependencies.

```bash
npm install
```

3. Run the application.

```bash
npm start
```

The application will run on http://localhost:3000/.

## Accessing the Application Online

If you want to access the application online, you can visit
https://taniaudod.github.io/github-kanban-board/.
