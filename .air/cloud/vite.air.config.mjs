import { mergeConfig } from 'vite';
import baseConfig from '/workspaces/social-sandbox-backend-test/vite.config.ts';

export default mergeConfig(baseConfig, { server: { allowedHosts: true } });
