# AILiverCare

Built by using React, TypeSCript and Vite. The project "AILiverCare" has its mission to improve Livercare health management system.
## Main features:

- **Dashboard**: Overview of Liver Health with charts and statistic
- **Assessments**: Assessing Liver Health risks with step-by-step process
- **Appointments**: Manage Doctor Appointments through Visual Calendar
- **Labs**: Track your test result with a graph overtime
- **Questionnaires**: The assessment questionnaire with automatic save
- **Notifications**: Notification system based on categories and priority levels  
- **Dark Mode**: Dark mode with the customizable store options

## Requirement:

- Node.js 14+ (16+ only)
- npm or yarn
- Backend API (take a look README.md in the original folder)

## Settings:

1. Clone project
```
git clone <repository-url>
```

2. Move to the fronted folder
```
cd frontend
```

3. install dependencies
```
npm install
```

4. Copy the sample configuration file
```
cp .env.example .env
```

5. Update the configuration in `.env` according to your environment

## Improvement:

Launch the development environment
```
npm run dev
```

The application will launch in this adress: [http://localhost:5173](http://localhost:5173)

## Build:

Build the application for environment production:
```
npm run build
```

All the generated folder will be in the folder `dist`

## The project structure:

```
frontend/
  ├─ src/
  │  ├─ api/          # API services
  │  ├─ components/   # Shared components
  │  ├─ hooks/        # Custom hooks
  │  ├─ pages/        # UI for it pages
  │  ├─ store/        # Redux store, slices
  │  ├─ styles/       # CSS modules and global CSS
  │  ├─ utils/        # Utilities and helpers
  │  ├─ App.tsx       # Original Component 
  │  └─ main.tsx      # Entry point
  ├─ public/          # Static assets
  ├─ .env.example     # sample configuration
  ├─ index.html       # HTML template
  ├─ vite.config.ts   #  Vite Config
  └─ package.json     # Dependencies and scripts
```

## All used Technologies:

- **React**: UI Libary
- **TypeScript**: ensure type safety
- **Redux Toolkit**:  state management
- **Axios**: HTTP requests
- **Chart.js**: Show charts
- **React Router**: Client-side routing
- **React-Big-Calendar**: Calendar component
- **CSS Modules**: Styling scoped to component

## API Integration

All API services will be defined in the folder `src/api`.Each service corresponds to one module backend:

- `auth.ts`: indentifies user
- `assessments.ts`: API assess all risks
- `appointments.ts`: manage the appointment
- `labs.ts`: Test results
- `questionnaires.ts`: Questionnaires
- `notifications.ts`: Notification

## Responsive Design

- **Desktop**: Display in full with horizontal menu
- **Tablet**: Suitable Layout 
- **Mobile**: Menu toggle and UI optimize for small screen

## Best Practices

- **Dark Mode**: Apply system-wide with CSS variables
- **Modular CSS**: Each component have different CSS modules 
- **API Service Layer**: Seperate logic API and UI
- **Authentication Flow**: Handling refresh token and token expiry
- **Performance**: Lazy loading and code splitting

## License

[MIT](LICENSE) 