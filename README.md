# Puzzlelise — Keyboard Puzzle

Client-side puzzle builder. Load an image, set rows/columns (or total pieces), scramble and solve using keyboard.

## Live demo

The page is published with GitHub Pages and can be opened directly in the browser:

- **URL:** https://giolauria.github.io/puzzlelize/
- **Source:** `main` branch, root folder (`/`)
- **Entry point:** `index.html` (served automatically as the default document)

No build step or server is required — GitHub Pages serves the static files (`index.html`, `style.css`, `script.js`) as-is.

Usage

- Open [index.html](index.html) in your browser.
- Choose an image with the **Image** control.
- Set **Rows** and **Cols** (or enter **Total** which auto-calculates a near-square grid) and click **Apply**.
- Use arrow keys to move the cursor over the board. Press **Space** to select a piece, move the cursor and press **Space** to swap.
- Use **Scramble** to randomize pieces and **Reset** to restore the original layout.

Notes

- This is a pure client-side implementation — no build or server required.
- To publish on GitHub: commit the files and push to a repository. GitHub Pages will serve `index.html` directly.
