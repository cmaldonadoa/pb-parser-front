const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#0d68b0",
              "@error-color": "#26a79a",
              "@font-size-base": "18px",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
