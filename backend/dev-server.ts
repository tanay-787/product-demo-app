import app from "./index.js";      // ensure path matches compiled output
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Dev server listening on ${PORT}`));