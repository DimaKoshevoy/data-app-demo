const findWorkspaceRoot = require('find-yarn-workspace-root');
const dotenv = require('dotenv');
const path =  require('path');
dotenv.config({
  path: path.join(findWorkspaceRoot(), '.env'),
});

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        require('postcss-nested')
      ]
    }
  }
};
