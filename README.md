# PDFlex

**Select and extract PDF pages with flexible viewing and selection modes**

PDFlex is a modern web application that allows you to preview, select, and extract specific pages from PDF documents. Built with Next.js and React, it offers an intuitive interface with multiple viewing and selection modes.

## ✨ Features

- 📄 **PDF Upload & Preview** - Upload any PDF and preview all pages
- 🎯 **Flexible Selection Modes**
  - Single click to select/deselect individual pages
  - Range mode for selecting page ranges
  - Select all/clear all functionality
- 👁️ **Multiple View Modes**
  - Grid view for compact overview
  - Scroll view for detailed browsing
- 🔍 **Full-Page Preview** - Double-click any page to view in full resolution
- 💾 **Easy Extraction** - Download selected pages as a new PDF
- 🎨 **Visual Feedback**
  - Selected pages highlighted in blue
  - Range start marked with golden/yellow indicator
  - Smooth transitions and hover effects

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ignite312/PDFlex.git
cd PDFlex
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Framework:** Next.js 14.2.0 (App Router)
- **UI Library:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **PDF Processing:**
  - `pdfjs-dist` - PDF rendering
  - `pdf-lib` - PDF manipulation and extraction

## 📖 How to Use

1. **Upload a PDF** - Click the upload area or drag and drop a PDF file
2. **Choose View Mode** - Toggle between Grid and Scroll view
3. **Select Pages:**
   - Click individual pages to select/deselect
   - Enable Range Mode and click two pages to select everything between them
   - Use "Select All" or "Clear Selection" buttons
4. **Preview Pages** - Double-click any page to view it in full resolution
5. **Extract** - Click "Extract Selected Pages" to download your custom PDF

## 🏗️ Project Structure

```
pdf-nextjs/
├── app/
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── PDFViewer.tsx        # Main PDF viewer component
│   ├── UploadSection.tsx    # File upload interface
│   └── pdf/
│       ├── PageThumbnail.tsx    # Grid view page component
│       ├── ScrollPageComp.tsx   # Scroll view page component
│       └── FullPageCanvas.tsx   # Full-page preview modal
├── utils/
│   └── pdf.ts               # PDF utility functions
└── ...config files

```

## 🎨 Features in Detail

### Range Mode
Range mode allows you to select consecutive pages efficiently:
1. Click "Range Mode" button
2. Click on the first page of your range (marked with yellow/golden indicator)
3. Click on the last page - all pages between will be selected automatically

### View Modes
- **Grid View:** Compact thumbnail grid for quick overview
- **Scroll View:** Larger page previews with checkboxes, ideal for detailed review

### Selection Indicators
- **Blue highlight:** Selected pages
- **Yellow/Golden ring:** Range start marker (in range mode)
- **Checkboxes:** Available in scroll view for easy selection

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

**ignite312**

---

Made with ❤️ using Next.js and React
