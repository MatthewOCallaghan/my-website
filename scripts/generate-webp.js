const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Replaces every raster image Eleventy has already copied into dist/images with a .webp
// version, so templates/CSS reference .webp directly with no jpg/png fallback shipped.
const IMAGES_DIR = path.join(__dirname, "..", "dist", "images");
const CONVERTIBLE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

async function convertDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            await convertDir(fullPath);
            continue;
        }

        const ext = path.extname(entry.name).toLowerCase();
        if (!CONVERTIBLE_EXTENSIONS.has(ext)) {
            continue;
        }

        const webpPath = fullPath.slice(0, -ext.length) + ".webp";
        await sharp(fullPath).webp({ quality: 82 }).toFile(webpPath);
        fs.unlinkSync(fullPath);
    }
}

async function main() {
    if (!fs.existsSync(IMAGES_DIR)) {
        console.error(`No such directory: ${IMAGES_DIR} (run build:eleventy first)`);
        process.exit(1);
    }

    await convertDir(IMAGES_DIR);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
