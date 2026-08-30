# CakeUrban — AI Agent System Guidance & Project Blueprint Index

## Project Blueprint Documentation
Detailed architectural specifications, button functions, workflow mapping, and database schemas are stored in `/docs/blueprint/`:

1. **Architecture & Overview**: `/docs/blueprint/OVERVIEW.md`
2. **Pages & Interactive Blueprint**: `/docs/blueprint/PAGES_MAPPING.md`
3. **Components & Button Reference**: `/docs/blueprint/COMPONENTS_AND_BUTTONS.md`
4. **Workflows & State Lifecycle**: `/docs/blueprint/WORKFLOWS_AND_STATE.md`
5. **Firebase & Services Reference**: `/docs/blueprint/FIREBASE_AND_SERVICES.md`

## Key Execution Rules for AI Agent
- **Background Styling**: Maintain the dark luxury gold theme with custom geometric HTML pattern in `/src/index.css` (`#131313` base + linear gradients).
- **Sound Effects**: Preserve audio sound effects via `/src/lib/audio.ts` when users click buttons, add items to cart, scratch cards, or spin wheels.
- **Full Workflow Integrity**: Ensure any button, form, or filter modification updates both local state (`localStorage`) and Firestore persistence seamlessly.
- **Button Mapping Precision**: Refer to `/docs/blueprint/COMPONENTS_AND_BUTTONS.md` whenever modifying, styling, or adding functionality to any UI element.
