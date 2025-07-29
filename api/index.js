
export default async (req, res) => {
    const { default: app } = await import('../backend/dist/index.js');
    app(req, res); // Call the imported app
  };