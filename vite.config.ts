// Conteúdo completo para o arquivo: vite.config.ts

import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // IMPORTANTE: Substitua 'NOME_DO_SEU_REPOSITORIO_NO_GITHUB'
    // pelo nome exato do seu repositório no GitHub.
    // Exemplo: se seu repositório for https://github.com/seu-usuario/meu-relogio-app
    // então repoName deve ser 'meu-relogio-app'
    const repoName = 'Jogo-do-rel-gio';

    return {
      define: {
        // Estas linhas são do seu arquivo original, podem ser mantidas ou removidas
        // se não forem usadas, mas para este app de relógio não são necessárias.
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Esta é a linha crucial para o GitHub Pages
      base: mode === 'production' ? `/${repoName}/` : '/',
    };
});
