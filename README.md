# Interactive-Matrix-Component

This project provides a 3D-style interactive matrix component built in Next.js. Each cell represents a floating-point number between 0 and 1. You can switch between multiple “layers” of data, including a total/average layer.

![Demo](https://github.com/HarryRudolph/Interactive-Matrix-Component/blob/assets/demo.mp4)

## Features

- **Stacked Layers**: Five layers are displayed in a stack; navigation buttons bring different layers to the front.
- **Conditional Formatting**: Each cell’s background colour interpolates from green (near 0) to orange (near 0.5) to red (near 1).
- **Expandable Cells**: Clicking a cell reveals a pop-up with further details.

## Requirements

- [Node.js](https://nodejs.org/) (v16 or later)
- [pnpm](https://pnpm.io/), [npm](https://www.npmjs.com/), or [yarn](https://yarnpkg.com/) to install dependencies

## Getting Started

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/interactive-matrix-3d.git
   cd interactive-matrix-3d
   ```

2. Install Dependencies:

   ```bash
   pnpm install
   # or npm install
   # or yarn
   ```

3. Run the Development Server:

   ```bash
   pnpm dev
   # or npm run dev
   # or yarn dev
   ```

4. Open in Browser:

   Visit http://localhost:3000 to see the matrix in action.
