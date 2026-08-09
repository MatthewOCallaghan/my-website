const fs = require("fs");

module.exports = function (eleventyConfig) {
    eleventyConfig.addNunjucksFilter("getWorkInfo", (work, page) => work.filter((workItem) => workItem.page === page)[0]);
    eleventyConfig.addNunjucksFilter("countProperties", (obj) => Object.keys(obj).length);

    eleventyConfig.addPassthroughCopy({ "src/images": "images" });
    eleventyConfig.addPassthroughCopy({ "src/videos": "videos" });
    // Raw JS, so `npm run dev`/`eleventy --serve` alone has working scripts.
    // `npm run build` overwrites these with esbuild-minified versions afterwards.
    eleventyConfig.addPassthroughCopy({ "src/js": "js" });
    eleventyConfig.addPassthroughCopy({ favicon: "." });
    eleventyConfig.addPassthroughCopy("CNAME");

    // cv.pdf doesn't exist in the repo yet; only wire up the copy once it's been added.
    if (fs.existsSync("cv.pdf")) {
        eleventyConfig.addPassthroughCopy("cv.pdf");
    }

    // Sass and JS aren't part of Eleventy's own build (compiled separately via npm scripts),
    // but watch them here so `npm run dev`'s Eleventy dev server reloads when they change.
    eleventyConfig.addWatchTarget("src/scss");
    eleventyConfig.addWatchTarget("src/js");

    return {
        dir: {
            input: "src/pages",
            includes: "../_includes",
            data: "../_data",
            output: "dist",
        },
    };
};
