import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir:'./tests/e2e',timeout:60000,workers:1,
  use:{baseURL:'http://127.0.0.1:4173',channel:'chrome',headless:true,viewport:{width:1280,height:860},reducedMotion:'reduce',trace:'retain-on-failure'},
  webServer:{command:'node tools/preview-server.mjs',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI,timeout:15000},
});
