# Planner App

A modern staff scheduling and roster management application built with Next.js and Chakra UI.

## What's This?

This is a planner app designed to help manage staff schedules, view calendars, and organize team rosters. Think of it as your digital scheduling assistant - drag staff members onto time slots, switch between day and month views, and keep everything organized in one place.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're good to go! The app will automatically redirect you to the planner page.

## Features

- **Drag & Drop Scheduling** - Just grab a staff member from the roster and drop them onto a time slot. It's that simple.
- **Multiple Views** - Switch between day view for detailed scheduling or month view to see the big picture.
- **Live & Planner Tabs** - Keep your current schedule separate from future planning. Each tab remembers its own date.
- **Responsive Design** - Works on desktop, tablet, and mobile. The sidebar becomes a drawer on smaller screens.
- **Staff Roster** - Filter by availability, search by name, and see everyone's hours at a glance.

## Project Structure

```
├── app/                    # Next.js app directory
├── components/
│   ├── layout/            # Sidebar, Header, AppLayout
│   ├── planner/           # Calendar, Roster, MonthView, etc.
│   └── ui/                # Reusable UI components
├── lib/
│   ├── data.ts            # Mock data for events and staff
│   └── types.ts           # TypeScript type definitions
└── public/                # Static assets
```

## Tech Stack

- **Next.js 16** with App Router
- **React** for the UI
- **Chakra UI** for components and styling
- **@dnd-kit** for drag-and-drop functionality
- **TypeScript** because types are nice

## A Few Notes

- The default events automatically use today's date, so you'll always see current data
- All the data is mock data right now - perfect for testing and development
- The calendar supports overlapping events and handles them gracefully
- Month view shows event counts for busy days

## Need Help?

The code is pretty straightforward. If you're looking to customize something:
- Mock data lives in `/lib/data.ts`
- Type definitions are in `/lib/types.ts`
- Main planner logic is in `/app/planner/page.tsx`
- Individual components are in `/components/planner/`

That's about it. Happy scheduling! 🗓️


