const { exec } = require("child_process");

const buildFrontend = () => {
  exec(
    "cd ../frontend/client && npm install && npm run build",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );
};

buildFrontend();
