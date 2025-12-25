# DSA Pattern Mastery Tracker

A minimal tracking app to help you master Data Structures and Algorithms using the 15 essential coding patterns from *Grokking the Coding Interview*. Progress is synced across devices using Firebase.

Currently, the app supports:

- Daily streak tracking to keep you consistent.
- Cloud-synced progress and stats using Firebase Firestore.
- Email/password authentication with Firebase Auth.
- A responsive UI that works well on both desktop and mobile.
- A visual dashboard showing patterns completed and problems solved.
- A curated list of LeetCode problems for each pattern (e.g. Prefix Sum, Sliding Window).

## Tech Stack

- React (Vite)
- Tailwind CSS
- Firebase Firestore
- Firebase Authentication
- Lucide React icons
- Firebase Hosting

## Running the project locally

To run this project locally, you need Node.js and npm installed.

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/dsa-tracker.git
cd dsa-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root and add your Firebase config:

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the dev server:

```bash
npm run dev
```

## Firebase configuration

This project expects a Firebase project configured with:

- Email/password authentication enabled.
- A Firestore database in production or test mode.
- Rules that restrict each user to their own document, for example:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

You can set this up from the [Firebase console](https://console.firebase.google.com/).

## Building and deployment

This project is set up for Firebase Hosting.

To create a production build:

```bash
npm run build
```

To deploy with the Firebase CLI (after `firebase init`):

```bash
firebase deploy
```

## Contributing

You can extend this project by adding new patterns, problem sets, or visualizations.

Typical workflow:

- Create a feature branch.
- Implement and test your changes.
- Open a pull request with a clear description.

The project is distributed under the MIT License.