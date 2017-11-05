const binaryPath = require('puppeteer').executablePath();

module.exports = {
  src_folders: ['assets/app/test_e2e/tests/'],
  output_folder: 'reports',
  custom_commands_path: '',
  custom_assertions_path: '',
  page_objects_path: 'assets/app/test_e2e/page_objects/',
  globals_path: './globals.js',

  selenium: {
    start_process: false,
  },

  test_settings: {
    default: {
      default_path_prefix: '',
      selenium_port: 9515,
      selenium_host: '127.0.0.1',
      launch_url: 'http://localhost:8080',
      javascriptEnabled: true,
      acceptSslCerts: true,
      trustAllSSLCerficates: true,
      screenshots: {
        enabled: true,
        path: './screenshots/',
        on_failure: true,
        on_error: true,
      },
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          binary: binaryPath,
          args: [
            '--no-sandbox',
            '--headless',
            'start-fullscreen',
            'window-size=1280,800',
          ],
        },
      },
    },
  },
};
