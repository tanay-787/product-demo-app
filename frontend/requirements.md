
# Miniature Full-Stack Collaborative Product Demo Platform

Build a miniature full-stack version of a collaborative product demo platform inspired by **Arcade**. This task tests your ability to design, build, and deploy a modern web application that enables users to create and share interactive product stories.


Short about Arcade:

Arcade is a leading interactive demo platform that enables teams to create visually engaging, interactive product demos with minimal effort. The platform automates the demo creation process by recording user actions—such as clicks and scrolls—capturing screens, and assembling these into seamless, interactive product stories. Arcade’s intuitive editor allows users to add hotspots, tooltips, callouts, and even branching logic, making it easy to guide viewers through complex workflows.

Key features include:

Effortless Demo Creation: Quickly build interactive demos without advanced technical skills.

Visual Editing: Add annotations, tooltips, and step transitions to enhance clarity.

Multi-Channel Sharing: Share demos via websites, blogs, emails, or social media, and export as video or GIF.

Analytics: Track viewer engagement to optimize demos for conversion and adoption.

Integrations: Connect with tools like Salesforce, HubSpot, Figma, and Slack for seamless workflows.

Collaboration: Manage workspaces, permissions, and branding for teams of any size.

Arcade is widely used by marketers, product managers, sales teams, and support professionals to showcase products, educate users, and drive product-led growth by allowing prospects to interact with products before making a purchase.

This section gives context about Arcade’s purpose, features, and typical use cases, providing a clear foundation for your MVP inspired by its core ideas

**More about Arcade:**
- 🌐 [Official Website](https://www.arcade.software/)
- 🚀 [ProductHunt Page](https://www.producthunt.com/products/arcade)


## Problem Statement

Create a web application that allows users to:

1. Sign up, log in, and manage sessions securely.
2. Create interactive product tours by uploading images/screenshots and adding descriptions or highlights.
3. Use an in-browser screen recorder to capture their workflow (basic screen capture support is sufficient).
4. View and edit their demos using a visual editor interface.
5. Publish demos as public or private links.
6. Browse a dashboard with all their demos and analytics (mocked).

---

## Core Features

### Frontend

- Clean landing page with call-to-action.
- Signup/login pages with form validation.
- **Product tour editor**:
  - Upload screenshots or use placeholders.
  - Add/edit/delete tour steps with text annotations.
  - Use a screen recorder to capture product workflows.
  - Preview mode with animated step transitions.
- Dashboard to view all created tours.
- Responsive, interactive UI with smooth animations.

### Backend

- RESTful API.
- Authentication & session management (JWT/OAuth).
- CRUD operations for product tours.
- User & tour data persistence (Neon Postgres).
- Role-based access (basic user vs viewer).

---

## Tech Requirements

- **Frontend**: NextJS, Shadcn Tailwind CSS, Framer Motion.
- **Backend**: NextJS 
- **Database**: PostgreSQL
- **Auth**: NeonAuth
- **Hosting**: Vercel.

---

## Bonus (Optional)

- Add live collaboration (socket-based or mocked).
- Shareable public demo page with unique URL.
- Add analytics page (mock views, clicks per tour).
- Drag-and-drop tour step reordering.
- Dark/light mode toggle.

---
